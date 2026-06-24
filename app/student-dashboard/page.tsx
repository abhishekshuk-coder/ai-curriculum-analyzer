"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Radar, TrendingUp, Grid3x3, ListChecks, Sparkles, FileSearch, ListOrdered, GraduationCap } from "lucide-react";
import HealthMeter from "@/components/HealthMeter";
import ScoreGrid from "@/components/ScoreGrid";
import SkillGapRadarChart from "@/components/charts/SkillGapRadarChart";
import CareerTrajectoryChart from "@/components/charts/CareerTrajectoryChart";
import IndustryHeatmap from "@/components/charts/IndustryHeatmap";
import MissingSkillsPanel from "@/components/MissingSkillsPanel";
import CurriculumDoctor from "@/components/CurriculumDoctor";
import EmployabilitySimulator from "@/components/EmployabilitySimulator";
import NarrativeFindings from "@/components/NarrativeFindings";
import ActionPlan from "@/components/ActionPlan";
import EmptyDashboardState from "@/components/EmptyDashboardState";
import { downloadStudentReport } from "@/lib/student-report";
import { loadStudentAnalysis, type StoredStudentAnalysis } from "@/lib/student-analysis-store";
import { STUDENT_SCORE_LABELS } from "@/lib/student-analysis-schema";
import {
  studentScoreCards, studentHealthMeter, studentSkillGapRadar, careerTrajectory, studentIndustryHeatmap,
  studentMissingSkills, studentProfileDiagnostics, studentSimulatorAdditions,
  demoStudentName, demoStudentSummary, demoDetectedSkills, demoStudentFindings, demoCareerRoadmap,
} from "@/lib/student-mock-data";

const sections = [
  { id: "health", label: "Readiness Meter", icon: Sparkles },
  { id: "findings", label: "Findings", icon: FileSearch },
  { id: "radar", label: "Skill Gap Radar", icon: Radar },
  { id: "trajectory", label: "Career Trajectory", icon: TrendingUp },
  { id: "heatmap", label: "Industry Fit", icon: Grid3x3 },
  { id: "missing", label: "Missing Skills", icon: ListChecks },
  { id: "roadmap", label: "Career Roadmap", icon: ListOrdered },
];

function SectionCard({
  id, title, subtitle, children,
}: { id: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="scroll-mt-28 rounded-3xl border border-silver bg-white p-6 shadow-soft sm:p-7"
    >
      <h2 className="font-display text-lg font-semibold text-navy">{title}</h2>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

function buildDemoAnalysis(): StoredStudentAnalysis {
  return {
    sourceFilenames: { resume: "demo-aarav-mehta-resume.pdf", transcript: "demo-aarav-mehta-transcript.pdf" },
    analyzedAt: new Date().toISOString(),
    result: {
      studentName: demoStudentName,
      summary: demoStudentSummary,
      healthScore: studentHealthMeter.score,
      healthLabel: studentHealthMeter.label,
      scores: studentScoreCards.map((c) => ({
        key: c.key,
        label: c.label,
        value: c.value,
        rationale: "Sample rationale — upload your own resume for a real analysis.",
      })),
      skillGapRadar: studentSkillGapRadar,
      careerTrajectory,
      industryHeatmap: studentIndustryHeatmap,
      missingSkills: studentMissingSkills,
      profileDiagnostics: studentProfileDiagnostics,
      detectedSkills: demoDetectedSkills,
      findings: demoStudentFindings,
      careerRoadmap: demoCareerRoadmap,
      simulatorAdditions: studentSimulatorAdditions,
    },
  } as StoredStudentAnalysis;
}

export default function StudentDashboardPage() {
  return <Suspense><StudentDashboardContent /></Suspense>;
}

function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const [analysis, setAnalysis] = useState<StoredStudentAnalysis | null | "loading">("loading");

  useEffect(() => {
    if (isDemo) {
      setAnalysis(buildDemoAnalysis());
    } else {
      setAnalysis(loadStudentAnalysis());
    }
  }, [isDemo]);

  if (analysis === "loading") return null;

  if (!analysis) {
    return (
      <EmptyDashboardState
        title="No Student Analysis Yet"
        description="Upload your resume to generate an AI-powered career readiness report with skill gap analysis, career trajectory, and a personalized roadmap."
        uploadHref="/students"
        uploadLabel="Upload Your Resume"
        demoHref="/student-dashboard?demo=true"
        icon={<GraduationCap size={36} />}
      />
    );
  }

  const { result, sourceFilenames, analyzedAt } = analysis;
  const isLive = !isDemo;

  return (
    <main className="min-h-screen bg-surface pb-24">
      <div className="sticky top-0 z-40 border-b border-silver bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/students"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-navy"
            >
              <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back
            </Link>
            <div className="hidden h-6 w-px bg-silver sm:block" />
            <div className="hidden sm:block">
              <p className="font-display text-sm font-bold text-navy">
                {isLive ? `${result.studentName} · Career Report` : "Demo Career Report"}
              </p>
              <p className="text-xs text-muted">
                {isLive
                  ? `${sourceFilenames.resume} · Analyzed ${new Date(analyzedAt).toLocaleDateString()}`
                  : "Aarav Mehta · Final Year, B.Tech CSE · Sample Data"}
              </p>
            </div>
          </div>
          <button
            onClick={() => downloadStudentReport(analysis as Parameters<typeof downloadStudentReport>[0])}
            className="btn-ripple group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald to-teal opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            <Download size={16} className="relative" />
            <span className="relative">Export Report</span>
          </button>
        </div>
        <div className="scrollbar-none mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-6 pb-3 lg:px-8">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-silver bg-surface px-3.5 py-1.5 text-xs font-medium text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-deepblue/30 hover:bg-white hover:text-navy hover:shadow-soft"
            >
              <s.icon size={13} className="text-deepblue transition-transform duration-300 group-hover:scale-110" />
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 pt-8 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-dark">
            AI Student Career Analysis Engine · {isLive ? "Live Report" : "Demo Report"}
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            Career Readiness Dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            {isLive
              ? `Career readiness analysis for ${result.studentName}.`
              : "A complete walkthrough populated with sample analysis so you can see the experience before uploading your own resume."}
          </p>
        </motion.div>

        <div id="health" className="scroll-mt-28">
          <HealthMeter score={result.healthScore} label={result.healthLabel} title="Career Readiness Meter" subjectNoun="profile" />
        </div>

        <ScoreGrid
          scores={result.scores.map((s) => ({
            ...s,
            label: s.label || STUDENT_SCORE_LABELS[s.key as keyof typeof STUDENT_SCORE_LABELS]?.label || s.key,
            icon: STUDENT_SCORE_LABELS[s.key as keyof typeof STUDENT_SCORE_LABELS]?.icon ?? "Sparkles",
          }))}
          showHeading={false}
        />

        <SectionCard id="findings" title="Narrative Findings & Evidence" subtitle="What the AI found — with direct citations — and why each finding matters.">
          <NarrativeFindings findings={result.findings as Parameters<typeof NarrativeFindings>[0]["findings"]} />
        </SectionCard>

        <SectionCard id="radar" title="Your Skills vs. Industry Expectations" subtitle="Demonstrated skill levels overlaid against what entry-level roles now expect.">
          <SkillGapRadarChart
            data={result.skillGapRadar}
            seriesAKey="current"
            seriesALabel="Your Current Level"
            seriesAColor="#1E3A8A"
            seriesBKey="expected"
            seriesBLabel="Industry Expectation"
            seriesBColor="#10B981"
          />
        </SectionCard>

        <SectionCard id="trajectory" title="Your Career Trajectory" subtitle="Projected readiness — following the roadmap vs. staying on the current path.">
          <CareerTrajectoryChart data={result.careerTrajectory} />
        </SectionCard>

        <SectionCard id="heatmap" title="Industry Fit Heatmap" subtitle="How well this profile aligns with hiring demand across major verticals.">
          <IndustryHeatmap data={result.industryHeatmap} />
        </SectionCard>

        <SectionCard id="missing" title="Missing Skills Analysis" subtitle="Ranked additions that would move the needle fastest on employability.">
          <MissingSkillsPanel data={result.missingSkills} />
        </SectionCard>

        <div id="roadmap" className="scroll-mt-28 grid gap-6 lg:grid-cols-2">
          <ActionPlan actions={result.careerRoadmap} title="Your Career Roadmap" subtitle="What to do first — ranked by urgency and expected impact" />
          <CurriculumDoctor data={result.profileDiagnostics} title="AI Resume Doctor™" subtitle="Automatic profile diagnosis with prioritized recommendations" />
        </div>

        <EmployabilitySimulator
          baseline={{
            employability: result.scores.find((s) => s.key === "technicalSkills")?.value ?? 50,
            relevance: result.scores.find((s) => s.key === "industryReadiness")?.value ?? 50,
            future: result.scores.find((s) => s.key === "marketAlignment")?.value ?? 50,
          }}
          additions={result.simulatorAdditions}
        />
      </div>
    </main>
  );
}
