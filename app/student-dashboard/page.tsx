"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Radar, TrendingUp, Grid3x3, ListChecks, Sparkles, FileSearch, ListOrdered } from "lucide-react";
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
import { downloadStudentReport } from "@/lib/student-report";
import {
  studentScoreCards, studentHealthMeter, studentSkillGapRadar, careerTrajectory, studentIndustryHeatmap,
  studentMissingSkills, studentProfileDiagnostics, studentSimulatorAdditions, studentSimulatorBaseline,
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

const demoAnalysis = {
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
      rationale: "Sample rationale — upload your own resume for an analysis grounded in its actual content.",
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
} as unknown as Parameters<typeof downloadStudentReport>[0];

export default function StudentDashboardPage() {
  return (
    <main className="min-h-screen bg-surface pb-24">
      {/* Top bar */}
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
              <p className="font-display text-sm font-bold text-navy">Demo Career Report</p>
              <p className="text-xs text-muted">Aarav Mehta · Final Year, B.Tech CSE · Sample Data</p>
            </div>
          </div>
          <button
            onClick={() => downloadStudentReport(demoAnalysis)}
            className="btn-ripple group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald to-teal opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            <Download size={16} className="relative" />
            <span className="relative">Export Report</span>
          </button>
        </div>
        {/* Section nav */}
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-dark">
            AI Student Career Analysis Engine · Demo Report
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            Career Readiness Dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            A complete walkthrough of every report the platform generates for students — populated
            with sample analysis so you can see the experience before uploading your own resume.
          </p>
        </motion.div>

        <div id="health" className="scroll-mt-28">
          <HealthMeter
            score={studentHealthMeter.score}
            label={studentHealthMeter.label}
            title="Career Readiness Meter"
            subjectNoun="profile"
          />
        </div>

        <ScoreGrid scores={studentScoreCards} showHeading={false} />

        <SectionCard
          id="findings"
          title="Narrative Findings & Evidence"
          subtitle="What the AI found in the documents — with direct citations — and why each finding matters."
        >
          <NarrativeFindings findings={demoStudentFindings as Parameters<typeof NarrativeFindings>[0]["findings"]} />
        </SectionCard>

        <SectionCard
          id="radar"
          title="Your Skills vs. Industry Expectations"
          subtitle="Demonstrated skill levels overlaid against what entry-level roles in this field now expect."
        >
          <SkillGapRadarChart
            data={studentSkillGapRadar}
            seriesAKey="current"
            seriesALabel="Your Current Level"
            seriesAColor="#1E3A8A"
            seriesBKey="expected"
            seriesBLabel="Industry Expectation"
            seriesBColor="#10B981"
          />
        </SectionCard>

        <SectionCard
          id="trajectory"
          title="Your Career Trajectory"
          subtitle="Projected readiness over the next two years — following the roadmap vs. staying on the current path."
        >
          <CareerTrajectoryChart data={careerTrajectory} />
        </SectionCard>

        <SectionCard
          id="heatmap"
          title="Industry Fit Heatmap"
          subtitle="How well this profile aligns with hiring demand across major industry verticals."
        >
          <IndustryHeatmap data={studentIndustryHeatmap} />
        </SectionCard>

        <SectionCard
          id="missing"
          title="Missing Skills Analysis"
          subtitle="Ranked additions that would move the needle fastest on employability."
        >
          <MissingSkillsPanel data={studentMissingSkills} />
        </SectionCard>

        <div id="roadmap" className="scroll-mt-28 grid gap-6 lg:grid-cols-2">
          <ActionPlan
            actions={demoCareerRoadmap}
            title="Your Career Roadmap"
            subtitle="What to do first — ranked by urgency and expected impact"
          />
          <CurriculumDoctor
            data={studentProfileDiagnostics}
            title="AI Resume Doctor™"
            subtitle="Automatic profile diagnosis with prioritized recommendations"
          />
        </div>

        <EmployabilitySimulator baseline={studentSimulatorBaseline} additions={studentSimulatorAdditions} />
      </div>
    </main>
  );
}
