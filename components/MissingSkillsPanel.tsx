"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";
import { missingSkills as mockMissingSkills } from "@/lib/mock-data";

const groups = [
  { key: "critical", title: "Critical Missing Skills", icon: AlertTriangle, color: "#DC6B5A" },
  { key: "high", title: "High Priority Skills", icon: AlertCircle, color: "#D4AF37" },
  { key: "recommended", title: "Recommended Additions", icon: Lightbulb, color: "#10B981" },
] as const;

export interface MissingSkillsData {
  critical: string[];
  high: string[];
  recommended: string[];
}

interface MissingSkillsPanelProps {
  data?: MissingSkillsData;
}

export default function MissingSkillsPanel({ data }: MissingSkillsPanelProps = {}) {
  const missingSkills = data ?? mockMissingSkills;
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {groups.map((g, i) => (
        <motion.div
          key={g.key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          whileHover={{ y: -5 }}
          className="rounded-2xl border border-silver bg-white p-5 shadow-soft transition-shadow duration-300 hover:shadow-elevated"
        >
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${g.color}1A`, color: g.color }}
            >
              <g.icon size={17} />
            </span>
            <h4 className="text-sm font-semibold text-navy">{g.title}</h4>
          </div>
          <ul className="mt-4 space-y-2">
            {missingSkills[g.key].map((item) => (
              <li
                key={item}
                className="flex items-center justify-between rounded-lg bg-surface/70 px-3 py-2 text-sm text-ink transition-colors duration-200 hover:bg-surface"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
