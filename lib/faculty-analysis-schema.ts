import { z } from "zod";

const scoreKey = z.enum([
  "pedagogyQuality",
  "curriculumCoverage",
  "studentEngagement",
  "assessmentDesign",
  "technologyIntegration",
  "industryRelevance",
  "learningOutcomes",
  "innovativeTeaching",
]);

export const FacultyTeachingSchema = z.object({
  facultyName: z.string(),
  department: z.string(),
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
    current: z.number().int(),
    benchmark: z.number().int(),
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

  teachingDiagnostics: z.array(z.object({
    type: z.string(),
    items: z.array(z.string()),
    tone: z.enum(["critical", "warning", "neutral"]),
  })),

  detectedTopics: z.array(z.string()),

  findings: z.array(z.object({
    title: z.string(),
    narrative: z.string(),
    evidence: z.array(z.string()),
    severity: z.enum(["critical", "high", "medium", "positive"]),
  })),

  improvementRoadmap: z.array(z.object({
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

export const FacultyResearchSchema = z.object({
  researchSummary: z.string(),
  publicationCount: z.number().int(),
  estimatedHIndex: z.number().int(),
  citationPotential: z.enum(["High", "Moderate", "Low", "Insufficient Data"]),

  researchStrengths: z.array(z.string()),
  researchGaps: z.array(z.string()),

  peerBenchmark: z.object({
    benchmarkNarrative: z.string(),
    topResearchersComparison: z.string(),
    collaborationOpportunities: z.string(),
  }),

  researchDirections: z.array(z.object({
    direction: z.string(),
    rationale: z.string(),
    impactPotential: z.enum(["High", "Medium", "Low"]),
  })),
});

export type FacultyAnalysisResult = z.infer<typeof FacultyTeachingSchema> & {
  research: z.infer<typeof FacultyResearchSchema>;
};

export const FACULTY_SCORE_LABELS: Record<z.infer<typeof scoreKey>, { label: string; icon: string }> = {
  pedagogyQuality: { label: "Pedagogy Quality", icon: "GraduationCap" },
  curriculumCoverage: { label: "Curriculum Coverage", icon: "Layers" },
  studentEngagement: { label: "Student Engagement", icon: "Users" },
  assessmentDesign: { label: "Assessment Design", icon: "ClipboardCheck" },
  technologyIntegration: { label: "Technology Integration", icon: "Laptop" },
  industryRelevance: { label: "Industry Relevance", icon: "Building2" },
  learningOutcomes: { label: "Learning Outcomes", icon: "Target" },
  innovativeTeaching: { label: "Innovative Teaching", icon: "Lightbulb" },
};
