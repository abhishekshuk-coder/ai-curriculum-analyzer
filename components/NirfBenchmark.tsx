"use client";

import { motion } from "framer-motion";
import { Award, Building2, ScrollText } from "lucide-react";
import type { AnalysisResult } from "@/lib/analysis-schema";

interface NirfBenchmarkProps {
  data: AnalysisResult["nirfBenchmark"];
}

export default function NirfBenchmark({ data }: NirfBenchmarkProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-deepblue/10 text-deepblue">
          <Award size={17} />
        </span>
        <div>
          <p className="text-sm font-semibold text-navy">Benchmark category: {data.fieldCategory}</p>
          <p className="text-xs text-muted">Compared against top NIRF-ranked Indian institutions in this field</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl border border-silver bg-white p-5 shadow-soft sm:p-6"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald/10 text-emerald-dark">
            <Building2 size={16} />
          </span>
          <p className="text-sm font-semibold text-navy">How top NIRF-ranked institutions approach this field</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{data.benchmarkNarrative}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="rounded-2xl border border-silver bg-gradient-to-br from-surface to-white p-5 sm:p-6"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-deepblue/10 text-deepblue">
            <ScrollText size={16} />
          </span>
          <p className="text-sm font-semibold text-navy">Gap Analysis</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{data.gapAnalysis}</p>
      </motion.div>
    </div>
  );
}
