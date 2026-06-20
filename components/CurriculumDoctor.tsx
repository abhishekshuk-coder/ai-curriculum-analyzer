"use client";

import { motion } from "framer-motion";
import { Stethoscope, ChevronRight } from "lucide-react";
import { curriculumDoctor as mockCurriculumDoctor } from "@/lib/mock-data";

const toneColor: Record<string, string> = {
  critical: "#DC6B5A",
  warning: "#D4AF37",
  neutral: "#3B5BB5",
};

export interface CurriculumDoctorEntry {
  type: string;
  items: string[];
  tone: string;
}

interface CurriculumDoctorProps {
  data?: CurriculumDoctorEntry[];
  title?: string;
  subtitle?: string;
}

export default function CurriculumDoctor({ data, title, subtitle }: CurriculumDoctorProps = {}) {
  const curriculumDoctor = data ?? mockCurriculumDoctor;
  return (
    <div className="rounded-3xl border border-silver bg-white p-6 shadow-soft sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-deepblue to-emerald text-white shadow-soft">
          <Stethoscope size={20} />
        </span>
        <div>
          <h3 className="font-display font-semibold text-navy">{title ?? "AI Curriculum Doctor™"}</h3>
          <p className="text-xs text-muted">{subtitle ?? "Automatic diagnosis with prioritized recommendations"}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {curriculumDoctor.map((entry, i) => {
          const color = toneColor[entry.tone];
          return (
            <motion.div
              key={entry.type}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ x: 4 }}
              className="group flex items-start gap-3 rounded-xl border border-silver bg-surface/50 p-4 transition-all duration-300 hover:border-transparent hover:bg-white hover:shadow-soft"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy">{entry.type}</p>
                <ul className="mt-1.5 space-y-1">
                  {entry.items.map((item) => (
                    <li key={item} className="text-sm text-muted">{item}</li>
                  ))}
                </ul>
              </div>
              <ChevronRight size={16} className="mt-1 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
