"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Compass, FlaskConical, TrendingUp } from "lucide-react";
import type { FacultyAnalysisResult } from "@/lib/faculty-analysis-schema";

interface FacultyBenchmarkProps {
  data: FacultyAnalysisResult["research"];
}

const impactColor = (level: string) => {
  switch (level) {
    case "High": return "bg-emerald/10 text-emerald-dark";
    case "Medium": return "bg-amber-100 text-amber-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function FacultyBenchmark({ data }: FacultyBenchmarkProps) {
  return (
    <div className="space-y-5">
      {/* Research stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Publications", value: data.publicationCount, icon: BookOpen },
          { label: "Est. H-Index", value: data.estimatedHIndex, icon: Award },
          { label: "Citation Potential", value: data.citationPotential, icon: TrendingUp },
          { label: "Strengths", value: data.researchStrengths.length, icon: FlaskConical },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 rounded-2xl border border-silver bg-white p-4 shadow-soft"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-deepblue/10 text-deepblue">
              <stat.icon size={17} />
            </span>
            <div>
              <p className="text-lg font-bold text-navy">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Research summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-silver bg-white p-5 shadow-soft sm:p-6"
      >
        <p className="text-sm font-semibold text-navy">Research Summary</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{data.researchSummary}</p>
      </motion.div>

      {/* Peer benchmarking */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-silver bg-gradient-to-br from-surface to-white p-5 shadow-soft sm:p-6"
      >
        <p className="text-sm font-semibold text-navy">Peer Benchmarking</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{data.peerBenchmark.benchmarkNarrative}</p>
        <div className="mt-4 rounded-xl bg-deepblue/5 p-4">
          <p className="text-xs font-semibold text-deepblue">How Top Researchers Compare</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{data.peerBenchmark.topResearchersComparison}</p>
        </div>
        <div className="mt-3 rounded-xl bg-emerald/5 p-4">
          <p className="text-xs font-semibold text-emerald-dark">Collaboration Opportunities</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{data.peerBenchmark.collaborationOpportunities}</p>
        </div>
      </motion.div>

      {/* Research strengths & gaps */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-navy">Research Strengths</p>
          <ul className="mt-3 space-y-2">
            {data.researchStrengths.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-navy">Research Gaps</p>
          <ul className="mt-3 space-y-2">
            {data.researchGaps.map((g) => (
              <li key={g} className="flex items-center gap-2 text-sm text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DC6B5A]" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Research directions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-silver bg-white p-5 shadow-soft sm:p-6"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-deepblue/10 text-deepblue">
            <Compass size={17} />
          </span>
          <p className="text-sm font-semibold text-navy">Recommended Research Directions</p>
        </div>
        <div className="mt-4 space-y-3">
          {data.researchDirections.map((d) => (
            <div key={d.direction} className="rounded-xl border border-silver bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-navy">{d.direction}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${impactColor(d.impactPotential)}`}>
                  {d.impactPotential}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{d.rationale}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
