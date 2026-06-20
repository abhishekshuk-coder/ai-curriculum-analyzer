"use client";

import { motion } from "framer-motion";
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, Quote, type LucideIcon } from "lucide-react";
import type { AnalysisResult } from "@/lib/analysis-schema";

const severityStyle: Record<string, { color: string; icon: LucideIcon; label: string }> = {
  critical: { color: "#DC6B5A", icon: AlertOctagon, label: "Critical" },
  high: { color: "#D4AF37", icon: AlertTriangle, label: "High Priority" },
  medium: { color: "#3B5BB5", icon: Info, label: "Worth Addressing" },
  positive: { color: "#10B981", icon: CheckCircle2, label: "Strength" },
};

interface NarrativeFindingsProps {
  findings: AnalysisResult["findings"];
}

export default function NarrativeFindings({ findings }: NarrativeFindingsProps) {
  return (
    <div className="space-y-4">
      {findings.map((finding, i) => {
        const style = severityStyle[finding.severity] ?? severityStyle.medium;
        const Icon = style.icon;
        return (
          <motion.div
            key={finding.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="group rounded-2xl border border-silver bg-white p-5 shadow-soft transition-all duration-300 hover:border-transparent hover:shadow-elevated sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${style.color}1A`, color: style.color }}
              >
                <Icon size={17} />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-navy">{finding.title}</h4>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                    style={{ background: `${style.color}1A`, color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink">{finding.narrative}</p>
                {finding.evidence?.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {finding.evidence.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 rounded-lg bg-surface/70 px-3 py-2 text-xs text-muted"
                      >
                        <Quote size={12} className="mt-0.5 shrink-0 text-deepblue/50" />
                        <span className="italic">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
