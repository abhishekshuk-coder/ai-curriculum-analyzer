"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Radar, TrendingUp, Grid3x3, ListChecks, Sparkles, FileSearch, ListOrdered } from "lucide-react";
import HealthMeter from "@/components/HealthMeter";
import ScoreGrid from "@/components/ScoreGrid";
import SkillGapRadarChart from "@/components/charts/SkillGapRadarChart";
import FutureForecastChart from "@/components/charts/FutureForecastChart";
import IndustryHeatmap from "@/components/charts/IndustryHeatmap";
import MissingSkillsPanel from "@/components/MissingSkillsPanel";
import CurriculumDoctor from "@/components/CurriculumDoctor";
import EmployabilitySimulator from "@/components/EmployabilitySimulator";
import NarrativeFindings from "@/components/NarrativeFindings";
import ActionPlan from "@/components/ActionPlan";
import { downloadReport } from "@/lib/report";
import {
  scoreCards, healthMeter, skillGapRadar, futureSkillsForecast, industryHeatmap,
  missingSkills, curriculumDoctor, simulatorAdditions,
  demoProgramName, demoSummary, demoDetectedSubjects, demoFindings, demoActionPlan,
} from "@/lib/mock-data";

const sections = [
  { id: "health", label: "Health Meter", icon: Sparkles },
  { id: "findings", label: "Findings", icon: FileSearch },
  { id: "radar", label: "Skill Gap Radar", icon: Radar },
  { id: "forecast", label: "Future Skills", icon: TrendingUp },
  { id: "heatmap", label: "Industry Alignment", icon: Grid3x3 },
  { id: "missing", label: "Missing Skills", icon: ListChecks },
  { id: "plan", label: "Action Plan", icon: ListOrdered },
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
  sourceFilename: "demo-mba-strategy-analytics.pdf",
  analyzedAt: new Date().toISOString(),
  result: {
    programName: demoProgramName,
    summary: demoSummary,
    healthScore: healthMeter.score,
    healthLabel: healthMeter.label,
    scores: scoreCards.map((c) => ({
      key: c.key,
      label: c.label,
      value: c.value,
      rationale: "Sample rationale — upload your own curriculum for an analysis grounded in its actual content.",
    })),
    skillGapRadar,
    futureSkillsForecast,
    industryHeatmap,
    missingSkills,
    curriculumDoctor,
    detectedSubjects: demoDetectedSubjects,
    findings: demoFindings,
    actionPlan: demoActionPlan,
    simulatorAdditions,
  },
} as unknown as Parameters<typeof downloadReport>[0];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-surface pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-silver bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-navy"
            >
              <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back
            </Link>
            <div className="hidden h-6 w-px bg-silver sm:block" />
            <div className="hidden sm:block">
              <p className="font-display text-sm font-bold text-navy">Demo Curriculum Report</p>
              <p className="text-xs text-muted">MBA — Strategy & Analytics · Sample Data</p>
            </div>
          </div>
          <button
            onClick={() => downloadReport(demoAnalysis)}
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
            AI Curriculum Analysis Engine · Demo Report
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            Curriculum Relevance Dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            A complete walkthrough of every dashboard the platform generates — populated with
            sample analysis so you can see the experience before connecting your own data.
          </p>
        </motion.div>

        <div id="health" className="scroll-mt-28">
          <HealthMeter />
        </div>

        <ScoreGrid />

        <SectionCard
          id="findings"
          title="Narrative Findings & Evidence"
          subtitle="What the AI found in the document — with direct citations — and why each finding matters."
        >
          <NarrativeFindings findings={demoFindings as Parameters<typeof NarrativeFindings>[0]["findings"]} />
        </SectionCard>

        <SectionCard
          id="radar"
          title="Skill Gap Radar"
          subtitle="Your curriculum's skill coverage overlaid against live industry demand."
        >
          <SkillGapRadarChart />
        </SectionCard>

        <SectionCard
          id="forecast"
          title="Future Skills Forecast (2025 – 2030)"
          subtitle="Projected demand trajectories for the skill families shaping future hiring."
        >
          <FutureForecastChart />
        </SectionCard>

        <SectionCard
          id="heatmap"
          title="Industry Alignment Heatmap"
          subtitle="How well this curriculum aligns with hiring demand across major verticals."
        >
          <IndustryHeatmap />
        </SectionCard>

        <SectionCard
          id="missing"
          title="Missing Skills Analysis"
          subtitle="Ranked additions that would move the needle fastest on employability."
        >
          <MissingSkillsPanel />
        </SectionCard>

        <div id="plan" className="scroll-mt-28 grid gap-6 lg:grid-cols-2">
          <ActionPlan actions={demoActionPlan} />
          <CurriculumDoctor />
        </div>

        <EmployabilitySimulator />
      </div>
    </main>
  );
}
