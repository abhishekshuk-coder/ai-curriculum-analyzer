"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Download, Radar, Grid3x3, ListChecks, Sparkles,
  FileSearch, ListOrdered, FileText, FlaskConical,
} from "lucide-react";
import HealthMeter from "@/components/HealthMeter";
import ScoreGrid from "@/components/ScoreGrid";
import SkillGapRadarChart from "@/components/charts/SkillGapRadarChart";
import IndustryHeatmap from "@/components/charts/IndustryHeatmap";
import MissingSkillsPanel from "@/components/MissingSkillsPanel";
import CurriculumDoctor from "@/components/CurriculumDoctor";
import EmployabilitySimulator from "@/components/EmployabilitySimulator";
import NarrativeFindings from "@/components/NarrativeFindings";
import ActionPlan from "@/components/ActionPlan";
import FacultyBenchmark from "@/components/FacultyBenchmark";
import { loadFacultyAnalysis, type StoredFacultyAnalysis } from "@/lib/faculty-analysis-store";
import { downloadFacultyReport } from "@/lib/faculty-report";
import { FACULTY_SCORE_LABELS } from "@/lib/faculty-analysis-schema";

const sections = [
  { id: "health", label: "Teaching Score", icon: Sparkles },
  { id: "findings", label: "Findings", icon: FileSearch },
  { id: "radar", label: "Skill Gap Radar", icon: Radar },
  { id: "heatmap", label: "Industry Alignment", icon: Grid3x3 },
  { id: "missing", label: "Missing Skills", icon: ListChecks },
  { id: "roadmap", label: "Improvement Roadmap", icon: ListOrdered },
  { id: "research", label: "Research & Benchmarking", icon: FlaskConical },
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

export default function FacultyResultsPage() {
  const [analysis, setAnalysis] = useState<StoredFacultyAnalysis | null | "loading">("loading");

  useEffect(() => {
    setAnalysis(loadFacultyAnalysis());
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
          We couldn&apos;t find a recent faculty analysis in this browser session. Upload your
          teaching portfolio to generate a fresh, AI-powered assessment.
        </p>
        <Link
          href="/faculty#faculty-upload-module"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
        >
          <ArrowLeft size={16} />
          Go upload your portfolio
        </Link>
      </main>
    );
  }

  const { result, sourceFilenames, analyzedAt } = analysis;
  const scoresWithMeta = result.scores.map((s) => ({
    ...s,
    label: s.label || FACULTY_SCORE_LABELS[s.key]?.label || s.key,
    icon: FACULTY_SCORE_LABELS[s.key]?.icon ?? "Sparkles",
  }));

  return (
    <main className="min-h-screen bg-surface pb-24">
      <div className="sticky top-0 z-40 border-b border-silver bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/faculty"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-navy"
            >
              <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back
            </Link>
            <div className="hidden h-6 w-px bg-silver sm:block" />
            <div className="hidden sm:block">
              <p className="font-display text-sm font-bold text-navy">{result.facultyName}</p>
              <p className="text-xs text-muted">
                {sourceFilenames.portfolio}
                {sourceFilenames.research ? ` · ${sourceFilenames.research}` : ""} · Analyzed{" "}
                {new Date(analyzedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => downloadFacultyReport(analysis)}
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
            AI Faculty Assessment Engine · Live Report
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
            {result.facultyName} · {result.department}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{result.summary}</p>

          {result.detectedTopics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {result.detectedTopics.map((topic) => (
                <span key={topic} className="inline-flex items-center rounded-lg border border-silver bg-white px-3 py-1.5 text-xs font-medium text-navy shadow-soft">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <div id="health" className="scroll-mt-28">
          <HealthMeter score={result.healthScore} label={result.healthLabel} title="Teaching Effectiveness Score" subjectNoun="teaching profile" />
        </div>

        <ScoreGrid scores={scoresWithMeta} showHeading={false} />

        <SectionCard id="findings" title="Narrative Findings & Evidence" subtitle="What the AI found in your teaching portfolio — with direct citations — and why each finding matters.">
          <NarrativeFindings findings={result.findings} />
        </SectionCard>

        <SectionCard id="radar" title="Your Teaching vs. Top Faculty Benchmark" subtitle="Your teaching competency levels overlaid against benchmarks from top-performing faculty in your field.">
          <SkillGapRadarChart
            data={result.skillGapRadar}
            seriesAKey="current"
            seriesALabel="Your Teaching"
            seriesAColor="#1E3A8A"
            seriesBKey="benchmark"
            seriesBLabel="Top Faculty Benchmark"
            seriesBColor="#10B981"
          />
        </SectionCard>

        <SectionCard id="heatmap" title="Industry Alignment of Teaching Content" subtitle="How well your teaching content aligns with hiring demand across major industry verticals.">
          <IndustryHeatmap data={result.industryHeatmap} />
        </SectionCard>

        <SectionCard id="missing" title="Missing Teaching Competencies" subtitle="Ranked additions that would most improve teaching effectiveness and student outcomes.">
          <MissingSkillsPanel data={result.missingSkills} />
        </SectionCard>

        <div id="roadmap" className="scroll-mt-28 grid gap-6 lg:grid-cols-2">
          <ActionPlan actions={result.improvementRoadmap} title="Improvement Roadmap" subtitle="Concrete steps to elevate teaching effectiveness — ranked by urgency" />
          <CurriculumDoctor data={result.teachingDiagnostics} title="AI Teaching Doctor™" subtitle="Automatic teaching diagnosis with prioritized recommendations" />
        </div>

        <SectionCard id="research" title="Research Profile & Peer Benchmarking" subtitle="Research impact assessment and comparison against top faculty at NIRF-ranked institutions.">
          <FacultyBenchmark data={result.research} />
        </SectionCard>

        <EmployabilitySimulator
          baseline={{
            employability: result.scores.find((s) => s.key === "industryRelevance")?.value ?? 50,
            relevance: result.scores.find((s) => s.key === "curriculumCoverage")?.value ?? 50,
            future: result.scores.find((s) => s.key === "innovativeTeaching")?.value ?? 50,
          }}
          additions={result.simulatorAdditions}
        />
      </div>
    </main>
  );
}
