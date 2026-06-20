import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { AnalysisSchema, NirfBenchmarkSchema, type AnalysisResult } from "@/lib/analysis-schema";
import { extractText } from "@/lib/extract-text";

export const runtime = "nodejs";
export const maxDuration = 180;

const MAX_FILE_BYTES = 25 * 1024 * 1024;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

/**
 * The schema deliberately omits numeric min/max bounds (a tightly-bounded schema across
 * this many nested fields blows up Claude's structured-output grammar compiler). Clamp
 * here instead so the UI — which assumes 0-100 percentages, etc. — always gets valid values.
 */
function normalizeAnalysis(raw: AnalysisResult): AnalysisResult {
  return {
    ...raw,
    healthScore: clamp(raw.healthScore, 0, 100),
    scores: raw.scores.map((s) => ({ ...s, value: clamp(s.value, 0, 100) })),
    skillGapRadar: raw.skillGapRadar.map((r) => ({
      ...r,
      curriculum: clamp(r.curriculum, 0, 100),
      industry: clamp(r.industry, 0, 100),
    })),
    futureSkillsForecast: raw.futureSkillsForecast.map((f) => ({
      ...f,
      aiLiteracy: clamp(f.aiLiteracy, 0, 100),
      dataFluency: clamp(f.dataFluency, 0, 100),
      automation: clamp(f.automation, 0, 100),
      sustainability: clamp(f.sustainability, 0, 100),
    })),
    industryHeatmap: raw.industryHeatmap.map((h) => ({ ...h, alignment: clamp(h.alignment, 0, 100) })),
    actionPlan: raw.actionPlan.map((a) => ({ ...a, priority: clamp(a.priority, 1, 10) })),
    simulatorAdditions: raw.simulatorAdditions.map((s) => ({
      ...s,
      impact: {
        employability: clamp(s.impact.employability, 1, 15),
        relevance: clamp(s.impact.relevance, 1, 15),
        future: clamp(s.impact.future, 1, 15),
      },
    })),
  };
}

const SYSTEM_PROMPT = `You are an expert curriculum analyst who has spent 20 years advising universities on industry relevance — the kind of advisor accreditation bodies (NAAC, NBA, AACSB, ABET, NIRF) bring in for deep program reviews.

You will be given the extracted text of a real curriculum document (a syllabus, program handbook, or course catalog). Read it carefully and produce a complete, evidence-grounded relevance analysis.

Hard requirements:
- Ground every score, finding, and recommendation in something actually present (or conspicuously absent) in the supplied text. Name real subjects, modules, tools, or outcomes you found — do not invent generic filler.
- "evidence" arrays must quote or closely paraphrase specific items from the document (module names, topics, tools, outcomes) — never generic statements.
- Narrative findings should read like an expert's written assessment: state what you found, why it matters for graduate employability, and how urgent it is. Reference real industry shifts (e.g., rising demand for AI/ML, cloud, data fluency; declining demand for legacy tools) when relevant to what's in the document.
- Scores must be internally consistent with your findings — a curriculum heavy on outdated tools and light on emerging skills should not score "Excellent" on future readiness.
- The action plan must be concretely actionable by a program head (specific courses/modules/certifications to add, drop, or update) and ranked by urgency.
- If the document is short or thin on detail, say so honestly in the summary and findings rather than inventing depth that isn't there — but still produce a complete, well-reasoned report from what is available.
- Output must validate against the provided schema exactly.

Field-by-field guidance (the schema only enforces shape — follow these content rules precisely):
- programName: the program/course/syllabus name as identified in the document, e.g. "MBA — Strategy & Analytics" or "B.Tech Computer Science, Semester 6".
- summary: 2-4 sentence executive summary of overall industry relevance, written for a dean or program head.
- healthScore: integer 0-100. healthLabel: one of "Excellent" | "Good" | "Average" | "Needs Improvement", consistent with healthScore (85+ Excellent, 70+ Good, 50+ Average, below Needs Improvement).
- scores: EXACTLY 8 entries, in this exact order with these exact keys and labels — relevance/"Curriculum Relevance", employability/"Employability", future/"Future Readiness", alignment/"Industry Alignment", innovation/"Innovation", practical/"Practical Exposure", coverage/"Skill Coverage", emerging/"Emerging Skills Adoption". Each value is an integer 0-100; rationale is a 1-2 sentence justification citing something specific found (or missing) in the document.
- skillGapRadar: 6-8 entries, each a skill family (e.g. "AI / ML", "Data Analysis", "Cloud Platforms") with curriculum and industry coverage as integers 0-100.
- futureSkillsForecast: EXACTLY 6 entries for years "2025" through "2030" in order, each with aiLiteracy/dataFluency/automation/sustainability as integers 0-100, generally trending upward across the years.
- industryHeatmap: 6-8 industry verticals relevant to this program's graduates, each with an alignment integer 0-100.
- missingSkills: critical/high/recommended arrays, 2-5 skill names each, ranked by urgency.
- curriculumDoctor: 3-6 entries, each a diagnosis category (e.g. "Outdated Topics", "Redundant Subjects", "Missing Technologies", "Missing Certifications", "Missing Industry Projects") with 1-4 specific items named directly from the document, and a tone of "critical" | "warning" | "neutral".
- detectedSubjects: at least 4 subjects/courses/modules actually identified by name in the document.
- findings: 4-8 narrative findings — the depth layer. Each has a short title, a full narrative paragraph (what was found, why it matters for employability, how urgent), 1-4 evidence strings quoting/closely paraphrasing specific items from the document, and severity "critical" | "high" | "medium" | "positive".
- actionPlan: 3-8 entries ordered by priority ascending (1 = most urgent, integer 1-10), each a concrete action, a rationale tied to findings/scores, and an expectedImpact string like "Employability score: +6-9 pts".
- simulatorAdditions: 3-6 tailored options (specific course/certification/lab), each with a short kebab-case id and an impact object giving employability/relevance/future as integers 1-15.`;

const NIRF_SYSTEM_PROMPT = `You are an expert on Indian higher education rankings (NIRF) and curriculum design, producing a benchmarking comparison for a program review.

You will be given the extracted text of a curriculum document. Identify its academic field, then compare it against how top NIRF-ranked Indian institutions approach that same field — drawn entirely from your own knowledge (no external dataset is provided; name only real, well-known institutions and programs you are confident about).

Produce exactly these three fields:
- fieldCategory: identify this program's broad field from the document (e.g. "Management / Business Administration", "Engineering — Computer Science", "Computer Applications", "Pharmacy", "Law"), then state the matching NIRF ranking category (Management, Engineering, Pharmacy, Law, Medical, Overall, etc.).
- benchmarkNarrative: a rich, flowing narrative (5-8 sentences, written as connected prose — not a list or bullet catalogue) that names 3-5 REAL top NIRF-ranked Indian institutions whose programs are widely known to be strong in this exact field — e.g. for B-School/Management programs use IIM Ahmedabad, IIM Bangalore, IIM Calcutta, XLRI Jamshedpur, FMS Delhi; for Engineering/CS use IIT Madras, IIT Delhi, IIT Bombay, IIT Kanpur, NIT Trichy; for Pharmacy use NIPER institutes and Jamia Hamdard; for Law use NLSIU Bangalore and NALSAR Hyderabad — choosing whichever set genuinely matches the field you identified (do not force-fit B-School names onto an engineering program or vice versa). For each institution you name, mention its approximate/well-known NIRF standing (e.g. "ranked #1 in NIRF's Management category" or "among India's top 5 engineering institutes"), 1-2 specific strengths of its program in this field, and one concrete curricular or pedagogical practice that distinguishes it (e.g. "runs a mandatory live-client consulting practicum every term" or "embeds a semester-long industry residency before the final year"). Write it as a cohesive paragraph a reader can skim in one pass.
- gapAnalysis: a grounded 3-6 sentence paragraph comparing THIS curriculum's actual content (cite specific module/course names or gaps you can see in the supplied text) against the practices you described above — name the concrete gap(s) and what closing them would look like. Be honest: if this curriculum already does some of these things well, say so rather than manufacturing a deficit.

Output must validate against the provided schema exactly.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const programHint = formData.get("program");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "That file exceeds the 25MB limit." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let text: string;
    try {
      text = await extractText(buffer, file.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't read this file.";
      return NextResponse.json({ error: message }, { status: 422 });
    }

    if (text.trim().length < 200) {
      return NextResponse.json(
        { error: "Couldn't find enough readable text in this document. Please upload a text-based curriculum file (not a scanned image)." },
        { status: 422 }
      );
    }

    const client = new Anthropic();

    const userPrompt = [
      `Analyze the curriculum document below${programHint ? ` (the uploader indicates this is a ${programHint} program)` : ""} and produce the full structured relevance report per your instructions.`,
      ``,
      `--- DOCUMENT: ${file.name} ---`,
      text,
      `--- END OF DOCUMENT ---`,
    ].join("\n");

    const nirfUserPrompt = [
      `Here is the extracted text of a curriculum document${programHint ? ` (the uploader indicates this is a ${programHint} program)` : ""}. Identify its field and produce the NIRF benchmarking comparison per your instructions.`,
      ``,
      `--- DOCUMENT: ${file.name} ---`,
      text,
      `--- END OF DOCUMENT ---`,
    ].join("\n");

    const [response, nirfResponse] = await Promise.all([
      client.messages.parse({
        model: "claude-opus-4-8",
        max_tokens: 16000,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "high",
          format: zodOutputFormat(AnalysisSchema),
        },
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
      client.messages.parse({
        model: "claude-opus-4-8",
        max_tokens: 4000,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "high",
          format: zodOutputFormat(NirfBenchmarkSchema),
        },
        system: NIRF_SYSTEM_PROMPT,
        messages: [{ role: "user", content: nirfUserPrompt }],
      }),
    ]);

    const parsed = response.parsed_output;
    const nirfParsed = nirfResponse.parsed_output;
    if (!parsed || !nirfParsed) {
      return NextResponse.json(
        { error: "The analysis engine returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    const merged: AnalysisResult = { ...parsed, nirfBenchmark: nirfParsed };

    const payload: { result: AnalysisResult; sourceFilename: string } = {
      result: normalizeAnalysis(merged),
      sourceFilename: file.name,
    };
    return NextResponse.json(payload);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "The analysis engine is handling a lot of requests right now — please try again in a minute." },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Claude API error:", err.status, err.message);
      return NextResponse.json(
        { error: "The AI analysis engine is temporarily unavailable. Please try again shortly." },
        { status: 502 }
      );
    }
    console.error("Analyze route error:", err);
    return NextResponse.json({ error: "Something went wrong while analyzing this curriculum." }, { status: 500 });
  }
}
