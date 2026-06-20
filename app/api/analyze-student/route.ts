import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { StudentAnalysisSchema, type StudentAnalysisResult } from "@/lib/student-analysis-schema";
import { extractText } from "@/lib/extract-text";

export const runtime = "nodejs";
export const maxDuration = 180;

const MAX_FILE_BYTES = 25 * 1024 * 1024;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

/**
 * Mirrors normalizeAnalysis() in app/api/analyze/route.ts — the schema omits numeric
 * bounds (see that file's comment for why), so clamp here to keep the UI's 0-100
 * percentage assumptions safe.
 */
function normalizeStudentAnalysis(raw: StudentAnalysisResult): StudentAnalysisResult {
  return {
    ...raw,
    healthScore: clamp(raw.healthScore, 0, 100),
    scores: raw.scores.map((s) => ({ ...s, value: clamp(s.value, 0, 100) })),
    skillGapRadar: raw.skillGapRadar.map((r) => ({
      ...r,
      current: clamp(r.current, 0, 100),
      expected: clamp(r.expected, 0, 100),
    })),
    careerTrajectory: raw.careerTrajectory.map((t) => ({
      ...t,
      withRoadmap: clamp(t.withRoadmap, 0, 100),
      withoutRoadmap: clamp(t.withoutRoadmap, 0, 100),
    })),
    industryHeatmap: raw.industryHeatmap.map((h) => ({ ...h, alignment: clamp(h.alignment, 0, 100) })),
    careerRoadmap: raw.careerRoadmap.map((a) => ({ ...a, priority: clamp(a.priority, 1, 10) })),
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

const SYSTEM_PROMPT = `You are an expert career coach and résumé analyst who has spent 20 years helping university students translate their academic background into strong, industry-ready professional profiles — the kind of advisor a top placement cell brings in to prep final-year students.

You will be given the extracted text of a student's résumé, and optionally their academic transcript. Read both carefully and produce a complete, evidence-grounded career-readiness analysis of THIS SPECIFIC PERSON.

Hard requirements:
- Ground every score, finding, and recommendation in something actually present (or conspicuously absent) from the supplied documents. Name real skills, projects, courses, or experiences you found — do not invent generic filler.
- "evidence" arrays must quote or closely paraphrase specific items from the documents (project names, course titles, tools, roles) — never generic statements.
- Narrative findings should read like a coach's honest written assessment: state what you found, why it matters for landing the kind of role this person seems to be aiming for, and how urgent it is to address. Reference real hiring trends (e.g., rising demand for cloud/AI-ML/data skills, the growing importance of portfolio evidence) when relevant to what's in the documents.
- Scores must be internally consistent with your findings — a résumé with no projects or certifications should not score "Excellent" on industry readiness.
- The career roadmap must be concretely actionable by the student themselves (specific certifications, projects, skills, or experiences to pursue) and ranked by urgency/impact.
- If the documents are short or thin on detail, say so honestly in the summary and findings rather than inventing depth that isn't there — but still produce a complete, well-reasoned report from what is available.
- Output must validate against the provided schema exactly.

Field-by-field guidance (the schema only enforces shape — follow these content rules precisely):
- studentName: the candidate's name as it appears on the résumé (if genuinely not findable, use a neutral placeholder like "Candidate").
- summary: 2-4 sentence executive summary of this person's overall career readiness, written directly to them as a coach would.
- healthScore: integer 0-100. healthLabel: one of "Excellent" | "Good" | "Average" | "Needs Improvement", consistent with healthScore (85+ Excellent, 70+ Good, 50+ Average, below Needs Improvement).
- scores: EXACTLY 8 entries, in this exact order with these exact keys and labels — technicalSkills/"Technical Skills", softSkills/"Soft Skills", academicPerformance/"Academic Performance", industryReadiness/"Industry Readiness", experienceDepth/"Experience Depth", certificationStrength/"Certification Strength", careerClarity/"Career Clarity", marketAlignment/"Market Alignment". Each value is an integer 0-100; rationale is a 1-2 sentence justification citing something specific found (or missing) in the documents.
- skillGapRadar: 5-7 entries, each a skill family relevant to this person's apparent target field (e.g. "Programming", "Data Analysis", "Cloud Platforms"), with "current" (this person's demonstrated level) and "expected" (typical level industry now expects for entry-level roles in that field) as integers 0-100.
- careerTrajectory: EXACTLY 5 entries for milestones "Now", "3 Months", "6 Months", "1 Year", "2 Years" in order, each projecting an overall readiness score (0-100) under two scenarios: "withRoadmap" (if they follow your recommended roadmap) and "withoutRoadmap" (if they continue on their current trajectory unchanged). "Now" should have nearly identical values for both; withRoadmap should pull meaningfully ahead at each later milestone while withoutRoadmap drifts only slightly.
- industryHeatmap: 6-8 industry verticals where this person's current profile could realistically be competitive, each with an alignment integer 0-100 reflecting how well-suited their profile is to that industry today.
- missingSkills: critical/high/recommended arrays, 2-5 skill names each, ranked by urgency for this person's apparent target roles.
- profileDiagnostics: 3-6 entries, each a diagnosis category (e.g. "Outdated Tech Stack", "Missing Portfolio Evidence", "Thin Project Depth", "Strong Foundations") with 1-4 specific items referencing this résumé/transcript directly, and a tone of "critical" | "warning" | "neutral".
- detectedSkills: at least 4 skills, tools, courses, or competencies actually identified by name in the documents.
- findings: 4-8 narrative findings — the depth layer. Each has a short title, a full narrative paragraph (what was found, why it matters for this person's job search, how urgent), 1-4 evidence strings quoting/closely paraphrasing specific items from the documents, and severity "critical" | "high" | "medium" | "positive".
- careerRoadmap: 3-8 entries ordered by priority ascending (1 = most urgent, integer 1-10), each a concrete action this student can take themselves, a rationale tied to findings/scores, and an expectedImpact string like "Industry Readiness: +6-9 pts".
- simulatorAdditions: 3-6 tailored options (specific certification/project/experience this person could realistically pursue next), each with a short kebab-case id and an impact object giving employability/relevance/future as integers 1-15.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resume = formData.get("resume");
    const transcript = formData.get("transcript");

    if (!(resume instanceof File)) {
      return NextResponse.json({ error: "Please upload your resume — it's required to generate a report." }, { status: 400 });
    }
    if (resume.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Your resume file exceeds the 25MB limit." }, { status: 400 });
    }
    const hasTranscript = transcript instanceof File && transcript.size > 0;
    if (hasTranscript && (transcript as File).size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Your transcript file exceeds the 25MB limit." }, { status: 400 });
    }

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());

    let resumeText: string;
    try {
      resumeText = await extractText(resumeBuffer, resume.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't read your resume.";
      return NextResponse.json({ error: message }, { status: 422 });
    }

    if (resumeText.trim().length < 80) {
      return NextResponse.json(
        { error: "Couldn't find enough readable text in your resume. Please upload a text-based file (not a scanned image)." },
        { status: 422 }
      );
    }

    let transcriptText = "";
    let transcriptFilename: string | null = null;
    if (hasTranscript) {
      const transcriptFile = transcript as File;
      const transcriptBuffer = Buffer.from(await transcriptFile.arrayBuffer());
      try {
        transcriptText = await extractText(transcriptBuffer, transcriptFile.name);
        transcriptFilename = transcriptFile.name;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Couldn't read your transcript.";
        return NextResponse.json({ error: message }, { status: 422 });
      }
    }

    const client = new Anthropic();

    const userPromptParts = [
      `Analyze the candidate's documents below and produce the full structured career-readiness report per your instructions.`,
      ``,
      `--- RESUME: ${resume.name} ---`,
      resumeText,
      `--- END OF RESUME ---`,
    ];
    if (transcriptFilename) {
      userPromptParts.push(
        ``,
        `--- TRANSCRIPT: ${transcriptFilename} ---`,
        transcriptText,
        `--- END OF TRANSCRIPT ---`,
      );
    }

    const response = await client.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "high",
        format: zodOutputFormat(StudentAnalysisSchema),
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPromptParts.join("\n") }],
    });

    const parsed = response.parsed_output;
    if (!parsed) {
      return NextResponse.json(
        { error: "The analysis engine returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    const payload: { result: StudentAnalysisResult; sourceFilenames: { resume: string; transcript: string | null } } = {
      result: normalizeStudentAnalysis(parsed),
      sourceFilenames: { resume: resume.name, transcript: transcriptFilename },
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
    console.error("Analyze-student route error:", err);
    return NextResponse.json({ error: "Something went wrong while analyzing your documents." }, { status: 500 });
  }
}
