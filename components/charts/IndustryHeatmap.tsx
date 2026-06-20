"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { industryHeatmap as mockIndustryHeatmap } from "@/lib/mock-data";

function tone(value: number) {
  if (value >= 75) return { bg: "#10B981", label: "Strong" };
  if (value >= 60) return { bg: "#3B5BB5", label: "Moderate" };
  if (value >= 45) return { bg: "#D4AF37", label: "Developing" };
  return { bg: "#DC6B5A", label: "Weak" };
}

export interface IndustryAlignmentEntry {
  industry: string;
  alignment: number;
}

interface IndustryHeatmapProps {
  data?: IndustryAlignmentEntry[];
}

export default function IndustryHeatmap({ data }: IndustryHeatmapProps = {}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const industryHeatmap = data ?? mockIndustryHeatmap;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {industryHeatmap.map((row, i) => {
          const t = tone(row.alignment);
          const isHovered = hovered === row.industry;
          return (
            <motion.div
              key={row.industry}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              onMouseEnter={() => setHovered(row.industry)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ scale: 1.05, y: -4 }}
              className="cursor-default rounded-2xl p-4 text-white shadow-soft transition-shadow duration-300"
              style={{
                background: `linear-gradient(135deg, ${t.bg}, ${t.bg}CC)`,
                boxShadow: isHovered ? `0 16px 40px -10px ${t.bg}88` : undefined,
              }}
            >
              <p className="text-xs font-medium uppercase tracking-wide opacity-80">{row.industry}</p>
              <p className="mt-2 font-display text-2xl font-bold">{row.alignment}%</p>
              <p className="mt-1 text-xs opacity-90">{t.label} alignment</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted">
        {[
          { label: "Strong (75+)", color: "#10B981" },
          { label: "Moderate (60-74)", color: "#3B5BB5" },
          { label: "Developing (45-59)", color: "#D4AF37" },
          { label: "Weak (<45)", color: "#DC6B5A" },
        ].map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
