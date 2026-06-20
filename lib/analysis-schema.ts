import { z } from "zod";

const scoreKey = z.enum([
  "relevance",
  "employability",
  "future",
  "alignment",
  "innovation",
  "practical",
  "coverage",
  "emerging",
]);

export const AnalysisSchema = z.object({
  programName: z.string(),
  summary: z.string(),

  healthScore: z.number().int(),
  healthLabel: z.enum(["Excellent", "Good", "Average", "Needs Improvement"]),

  scores: z.array(z.object({
    key: scoreKey,
    label: z.string(),
    value: z.number().int(),
    rationale: z.string(),
  })),

  skillGapRadar: z.array(z.object({
    skill: z.string(),
    curriculum: z.number().int(),
    industry: z.number().int(),
  })),

  futureSkillsForecast: z.array(z.object({
    year: z.string(),
    aiLiteracy: z.number().int(),
    dataFluency: z.number().int(),
    automation: z.number().int(),
    sustainability: z.number().int(),
  })),

  industryHeatmap: z.array(z.object({
    industry: z.string(),
    alignment: z.number().int(),
  })),

  missingSkills: z.object({
    critical: z.array(z.string()),
    high: z.array(z.string()),
    recommended: z.array(z.string()),
  }),

  curriculumDoctor: z.array(z.object({
    type: z.string(),
    items: z.array(z.string()),
    tone: z.enum(["critical", "warning", "neutral"]),
  })),

  detectedSubjects: z.array(z.string()),

  findings: z.array(z.object({
    title: z.string(),
    narrative: z.string(),
    evidence: z.array(z.string()),
    severity: z.enum(["critical", "high", "medium", "positive"]),
  })),

  actionPlan: z.array(z.object({
    priority: z.number().int(),
    action: z.string(),
    rationale: z.string(),
    expectedImpact: z.string(),
  })),

  simulatorAdditions: z.array(z.object({
    id: z.string(),
    label: z.string(),
    impact: z.object({
      employability: z.number().int(),
      relevance: z.number().int(),
      future: z.number().int(),
    }),
  })),
});

/**
 * Generated via a SEPARATE structured-output call from the main AnalysisSchema.
 * The main schema is already at Claude's structured-output grammar-size ceiling —
 * adding any field to it (even plain strings) triggers a 400 "compiled grammar is
 * too large" error. Keeping this as its own small schema/call sidesteps that limit
 * entirely without risking the verified main analysis pipeline.
 */
export const NirfBenchmarkSchema = z.object({
  fieldCategory: z.string(),
  benchmarkNarrative: z.string(),
  gapAnalysis: z.string(),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema> & {
  nirfBenchmark: z.infer<typeof NirfBenchmarkSchema>;
};

export const SCORE_LABELS: Record<z.infer<typeof scoreKey>, { label: string; icon: string }> = {
  relevance: { label: "Curriculum Relevance", icon: "Target" },
  employability: { label: "Employability", icon: "Briefcase" },
  future: { label: "Future Readiness", icon: "Rocket" },
  alignment: { label: "Industry Alignment", icon: "Building2" },
  innovation: { label: "Innovation", icon: "Lightbulb" },
  practical: { label: "Practical Exposure", icon: "FlaskConical" },
  coverage: { label: "Skill Coverage", icon: "Layers" },
  emerging: { label: "Emerging Skills Adoption", icon: "Sparkles" },
};
