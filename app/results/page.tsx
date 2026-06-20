"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Download, Radar, TrendingUp, Grid3x3, ListChecks, Sparkles,
  FileSearch, ListOrdered, FileText, Award,
} from "lucide-react";
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
import NirfBenchmark from "@/components/NirfBenchmark";
import { loadAnalysis, type StoredAnalysis } from "@/lib/analysis-store";
import { downloadReport } from "@/lib/report";
import { SCORE_LABELS } from "@/lib/analysis-schema";

const sections = [
  { id: "health", label: "Health Meter", icon: Sparkles },
  { id: "findings", label: "Findings", icon: FileSearch },
  { id: "radar", label: "Skill Gap Radar", icon: Radar },
  { id: "forecast", label: "Future Skills", icon: TrendingUp },
  { id: "heatmap", label: "Industry Alignment", icon: Grid3x3 },
  { id: "missing", label: "Missing Skills", icon: ListChecks },
  { id: "nirf", label: "NIRF Benchmarking", icon: Award },
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

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<StoredAnalysis | null | "loading">("loading");

  useEffect(() => {
    setAnalysis(loadAnalysis());
  }, []);

  if (analysis === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm text-muted">Loading your report…</p>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-deepblue/10 text-deepblue">
          <FileText size={26} />
        </span>
        <h1 className="font-display text-xl font-semibold text-navy">No analysis found</h1>
        <p className="max-w-md text-sm text-muted">
          We couldn&apos;t find a recent curriculum analysis in this browser session. Upload a curriculum
          to generate a fresh, AI-powered relevance report.
        </p>
        <Link
          href="/#upload-module"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
        >
          <ArrowLeft size={16} />
          Go upload a curriculum
        </Link>
      </main>
    );
  }

  const { result, sourceFilename, analyzedAt } = analysis;
  const scoresWithMeta = result.scores.map((s) => ({
    ...s,
    label: s.label || SCORE_LABELS[s.key]?.label || s.key,
    icon: SCORE_LABELS[s.key]?.icon ?? "Sparkles",
  }));

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
              <p className="font-display text-sm font-bold text-navy">{result.programName}</p>
              <p className="text-xs text-muted">
                {sourceFilename} · Analyzed {new Date(analyzedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => downloadReport(analysis)}
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
            AI Curriculum Analysis Engine · Live Report
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            {result.programName}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{result.summary}</p>

          {result.detectedSubjects.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {result.detectedSubjects.map((subject) => (
                <span
                  key={subject}
                  className="inline-flex items-center rounded-lg border border-silver bg-white px-3 py-1.5 text-xs font-medium text-navy shadow-soft"
                >
                  {subject}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <div id="health" className="scroll-mt-28">
          <HealthMeter score={result.healthScore} label={result.healthLabel} />
        </div>

        <ScoreGrid scores={scoresWithMeta} showHeading={false} />

        <SectionCard
          id="findings"
          title="Narrative Findings & Evidence"
          subtitle="What the AI found in your document — with direct citations — and why each finding matters."
        >
          <NarrativeFindings findings={result.findings} />
        </SectionCard>

        <SectionCard
          id="radar"
          title="Skill Gap Radar"
          subtitle="Your curriculum's skill coverage overlaid against live industry demand."
        >
          <SkillGapRadarChart data={result.skillGapRadar} />
        </SectionCard>

        <SectionCard
          id="forecast"
          title="Future Skills Forecast (2025 – 2030)"
          subtitle="Projected demand trajectories for the skill families shaping future hiring."
        >
          <FutureForecastChart data={result.futureSkillsForecast} />
        </SectionCard>

        <SectionCard
          id="heatmap"
          title="Industry Alignment Heatmap"
          subtitle="How well this curriculum aligns with hiring demand across major verticals."
        >
          <IndustryHeatmap data={result.industryHeatmap} />
        </SectionCard>

        <SectionCard
          id="missing"
          title="Missing Skills Analysis"
          subtitle="Ranked additions that would move the needle fastest on employability."
        >
          <MissingSkillsPanel data={result.missingSkills} />
        </SectionCard>

        <SectionCard
          id="nirf"
          title="NIRF Benchmarking"
          subtitle="How this curriculum compares against top NIRF-ranked institutions in the same field."
        >
          <NirfBenchmark data={result.nirfBenchmark} />
        </SectionCard>

        <div id="plan" className="scroll-mt-28 grid gap-6 lg:grid-cols-2">
          <ActionPlan actions={result.actionPlan} />
          <CurriculumDoctor data={result.curriculumDoctor} />
        </div>

        <EmployabilitySimulator
          baseline={{
            employability: result.scores.find((s) => s.key === "employability")?.value ?? 0,
            relevance: result.scores.find((s) => s.key === "relevance")?.value ?? 0,
            future: result.scores.find((s) => s.key === "future")?.value ?? 0,
          }}
          additions={result.simulatorAdditions}
        />
      </div>
    </main>
  );
}
