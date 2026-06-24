"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BarChart3, GraduationCap, Users, ArrowRight } from "lucide-react";
import { loadHistory, type HistoryEntry } from "@/lib/executive-store";

export default function LastUpdatedBanner() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  if (history.length === 0) return null;

  const latest = history[0];
  const date = new Date(latest.analyzedAt);
  const typeIcons = { curriculum: BarChart3, student: GraduationCap, faculty: Users };
  const TypeIcon = typeIcons[latest.type];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-silver bg-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10 text-emerald-dark">
            <Clock size={15} />
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-navy">Last analysis:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
              <TypeIcon size={11} />
              {latest.type.charAt(0).toUpperCase() + latest.type.slice(1)}
            </span>
            <span className="text-muted">{latest.title}</span>
            <span className="text-xs text-muted">
              · {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted sm:block">
            {history.length} total {history.length === 1 ? "analysis" : "analyses"}
          </span>
          <Link
            href="/executive"
            className="group inline-flex items-center gap-1.5 rounded-full border border-silver bg-surface px-3 py-1.5 text-xs font-medium text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-deepblue/30 hover:shadow-soft"
          >
            View All
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
