"use client";

import { motion } from "framer-motion";
import { ListOrdered, ArrowRight, TrendingUp } from "lucide-react";
import type { AnalysisResult } from "@/lib/analysis-schema";

interface ActionPlanProps {
  actions: AnalysisResult["actionPlan"];
  title?: string;
  subtitle?: string;
}

export default function ActionPlan({ actions, title, subtitle }: ActionPlanProps) {
  const sorted = [...actions].sort((a, b) => a.priority - b.priority);

  return (
    <div className="rounded-3xl border border-silver bg-white p-6 shadow-soft sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-deepblue to-emerald text-white shadow-soft">
          <ListOrdered size={20} />
        </span>
        <div>
          <h3 className="font-display font-semibold text-navy">{title ?? "Prioritized Action Plan"}</h3>
          <p className="text-xs text-muted">{subtitle ?? "What to do first — ranked by urgency and expected impact"}</p>
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {sorted.map((action, i) => (
          <motion.li
            key={`${action.priority}-${action.action}`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ x: 4 }}
            className="group flex items-start gap-4 rounded-xl border border-silver bg-surface/50 p-4 transition-all duration-300 hover:border-transparent hover:bg-white hover:shadow-soft"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-deepblue/10 font-display text-sm font-bold text-deepblue">
              {action.priority}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy">{action.action}</p>
              <p className="mt-1 text-sm text-muted">{action.rationale}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-dark">
                <TrendingUp size={13} />
                {action.expectedImpact}
              </p>
            </div>
            <ArrowRight size={16} className="mt-1 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
