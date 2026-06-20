import { z } from "zod";

const scoreKey = z.enum([
  "technicalSkills",
  "softSkills",
  "academicPerformance",
  "industryReadiness",
  "experienceDepth",
  "certificationStrength",
  "careerClarity",
  "marketAlignment",
]);

export const StudentAnalysisSchema = z.object({
  studentName: z.string(),
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
    expected: z.number().int(),
  })),

  careerTrajectory: z.array(z.object({
    milestone: z.string(),
    withRoadmap: z.number().int(),
    withoutRoadmap: z.number().int(),
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

  profileDiagnostics: z.array(z.object({
    type: z.string(),
    items: z.array(z.string()),
    tone: z.enum(["critical", "warning", "neutral"]),
  })),

  detectedSkills: z.array(z.string()),

  findings: z.array(z.object({
    title: z.string(),
    narrative: z.string(),
    evidence: z.array(z.string()),
    severity: z.enum(["critical", "high", "medium", "positive"]),
  })),

  careerRoadmap: z.array(z.object({
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

export type StudentAnalysisResult = z.infer<typeof StudentAnalysisSchema>;

export const STUDENT_SCORE_LABELS: Record<z.infer<typeof scoreKey>, { label: string; icon: string }> = {
  technicalSkills: { label: "Technical Skills", icon: "Target" },
  softSkills: { label: "Soft Skills", icon: "Lightbulb" },
  academicPerformance: { label: "Academic Performance", icon: "Layers" },
  industryReadiness: { label: "Industry Readiness", icon: "Briefcase" },
  experienceDepth: { label: "Experience Depth", icon: "FlaskConical" },
  certificationStrength: { label: "Certification Strength", icon: "Building2" },
  careerClarity: { label: "Career Clarity", icon: "Rocket" },
  marketAlignment: { label: "Market Alignment", icon: "Sparkles" },
};
