import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { FacultyTeachingSchema, FacultyResearchSchema, type FacultyAnalysisResult } from "@/lib/faculty-analysis-schema";
import { extractText } from "@/lib/extract-text";

export const runtime = "nodejs";
export const maxDuration = 180;

const MAX_FILE_BYTES = 25 * 1024 * 1024;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function normalizeTeaching(raw: FacultyAnalysisResult): FacultyAnalysisResult {
  return {
    ...raw,
    healthScore: clamp(raw.healthScore, 0, 100),
    scores: raw.scores.map((s) => ({ ...s, value: clamp(s.value, 0, 100) })),
    skillGapRadar: raw.skillGapRadar.map((r) => ({
      ...r,
      current: clamp(r.current, 0, 100),
      benchmark: clamp(r.benchmark, 0, 100),
    })),
    industryHeatmap: raw.industryHeatmap.map((h) => ({ ...h, alignment: clamp(h.alignment, 0, 100) })),
    improvementRoadmap: raw.improvementRoadmap.map((a) => ({ ...a, priority: clamp(a.priority, 1, 10) })),
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

const TEACHING_SYSTEM_PROMPT = `You are an expert academic consultant who has spent 20 years advising universities on teaching quality, pedagogy, and faculty development — the kind of advisor accreditation bodies (NAAC, NBA, AACSB, ABET) bring in for deep program reviews.

You will be given the extracted text of a teaching portfolio, syllabus, or course material document. Read it carefully and produce a complete, evidence-grounded teaching effectiveness analysis.

Hard requirements:
- Ground every score, finding, and recommendation in something actually present (or conspicuously absent) in the supplied text. Name real courses, topics, methods, or outcomes you found — do not invent generic filler.
- "evidence" arrays must quote or closely paraphrase specific items from the document — never generic statements.
- Narrative findings should read like an expert's written assessment of teaching quality.
- Scores must be internally consistent with your findings.
- The improvement roadmap must be concretely actionable by a faculty member or department head.
- Output must validate against the provided schema exactly.

Field-by-field guidance:
- facultyName: the faculty member's name as identified in the document, or "Faculty Member" if not found.
- department: the department or discipline identified from the document.
- summary: 2-4 sentence executive summary of overall teaching effectiveness.
- healthScore: integer 0-100. healthLabel: one of "Excellent" | "Good" | "Average" | "Needs Improvement" (85+ Excellent, 70+ Good, 50+ Average, below Needs Improvement).
- scores: EXACTLY 8 entries with these keys and labels — pedagogyQuality/"Pedagogy Quality", curriculumCoverage/"Curriculum Coverage", studentEngagement/"Student Engagement", assessmentDesign/"Assessment Design", technologyIntegration/"Technology Integration", industryRelevance/"Industry Relevance", learningOutcomes/"Learning Outcomes", innovativeTeaching/"Innovative Teaching". Each value 0-100 with rationale.
- skillGapRadar: 6-8 entries, each a teaching competency with current and benchmark scores (0-100).
- industryHeatmap: 6-8 industry verticals showing alignment of teaching content.
- missingSkills: critical/high/recommended arrays of teaching competencies or content gaps.
- teachingDiagnostics: 3-6 diagnostic entries (e.g. "Outdated Content", "Missing Pedagogy", "Assessment Gaps", "Strengths") with specific items from the document and tone.
- detectedTopics: at least 4 subjects/courses/topics found in the document.
- findings: 4-8 narrative findings about teaching quality with evidence and severity.
- improvementRoadmap: 3-8 prioritized actions with rationale and expected impact.
- simulatorAdditions: 3-6 teaching improvement options with impact scores.`;

const RESEARCH_SYSTEM_PROMPT = `You are an expert academic research evaluator producing a research impact and peer benchmarking assessment for a faculty member.

You will be given the extracted text of a faculty member's teaching portfolio and optionally their research papers. Analyze their research profile based on available evidence.

If research papers were provided, assess them directly. If only a teaching portfolio is available, infer what you can about research activity from any mentions of publications, projects, or research interests in the document. If no research evidence exists, clearly state this in the summary and provide conservative estimates.

Produce exactly these fields:
- researchSummary: 2-4 sentence overview of research profile and impact.
- publicationCount: estimated count of publications mentioned or inferable. Use 0 if none found.
- estimatedHIndex: rough estimate based on available evidence. Use 0 if insufficient data.
- citationPotential: "High" | "Moderate" | "Low" | "Insufficient Data".
- researchStrengths: 2-5 research areas of strength.
- researchGaps: 2-5 areas where research profile could be strengthened.
- peerBenchmark: compare against faculty at top NIRF-ranked Indian institutions in the same field — use real institution names (IITs, IIMs, IISc, NITs, etc.) and describe what distinguishes top researchers. Include benchmarkNarrative, topResearchersComparison, and collaborationOpportunities as rich paragraphs.
- researchDirections: 2-4 recommended future research directions with rationale and impactPotential.

Output must validate against the provided schema exactly.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const portfolioFile = formData.get("portfolio");
    const researchFile = formData.get("research");

    if (!(portfolioFile instanceof File)) {
      return NextResponse.json({ error: "No teaching portfolio was uploaded." }, { status: 400 });
    }
    if (portfolioFile.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "That file exceeds the 25MB limit." }, { status: 400 });
    }

    const portfolioBuffer = Buffer.from(await portfolioFile.arrayBuffer());
    let portfolioText: string;
    try {
      portfolioText = await extractText(portfolioBuffer, portfolioFile.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't read this file.";
      return NextResponse.json({ error: message }, { status: 422 });
    }

    let researchText = "";
    if (researchFile instanceof File) {
      if (researchFile.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "The research file exceeds the 25MB limit." }, { status: 400 });
      }
      const researchBuffer = Buffer.from(await researchFile.arrayBuffer());
      try {
        researchText = await extractText(researchBuffer, researchFile.name);
      } catch {
        researchText = "";
      }
    }

    if (portfolioText.trim().length < 200) {
      return NextResponse.json(
        { error: "Couldn't find enough readable text in this document. Please upload a text-based file (not a scanned image)." },
        { status: 422 }
      );
    }

    const client = new Anthropic();

    const documentBlock = [
      `--- TEACHING PORTFOLIO: ${portfolioFile.name} ---`,
      portfolioText,
      `--- END OF PORTFOLIO ---`,
      ...(researchText ? [
        ``,
        `--- RESEARCH PAPERS: ${(researchFile as File).name} ---`,
        researchText,
        `--- END OF RESEARCH ---`,
      ] : []),
    ].join("\n");

    const teachingPrompt = `Analyze the faculty teaching portfolio below and produce the full structured teaching effectiveness report per your instructions.\n\n${documentBlock}`;
    const researchPrompt = `Here is a faculty member's teaching portfolio${researchText ? " and research papers" : ""}. Analyze their research profile and produce the peer benchmarking comparison per your instructions.\n\n${documentBlock}`;

    const [teachingResponse, researchResponse] = await Promise.all([
      client.messages.parse({
        model: "claude-opus-4-8",
        max_tokens: 16000,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "high",
          format: zodOutputFormat(FacultyTeachingSchema),
        },
        system: TEACHING_SYSTEM_PROMPT,
        messages: [{ role: "user", content: teachingPrompt }],
      }),
      client.messages.parse({
        model: "claude-opus-4-8",
        max_tokens: 4000,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "high",
          format: zodOutputFormat(FacultyResearchSchema),
        },
        system: RESEARCH_SYSTEM_PROMPT,
        messages: [{ role: "user", content: researchPrompt }],
      }),
    ]);

    const teachingParsed = teachingResponse.parsed_output;
    const researchParsed = researchResponse.parsed_output;
    if (!teachingParsed || !researchParsed) {
      return NextResponse.json(
        { error: "The analysis engine returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    const merged: FacultyAnalysisResult = { ...teachingParsed, research: researchParsed };

    const payload = {
      result: normalizeTeaching(merged),
      sourceFilenames: {
        portfolio: portfolioFile.name,
        research: researchFile instanceof File ? researchFile.name : null,
      },
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
    console.error("Analyze-faculty route error:", err);
    return NextResponse.json({ error: "Something went wrong while analyzing your documents." }, { status: 500 });
  }
}
