"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skillCloud } from "@/lib/mock-data";

const palette = ["#1E3A8A", "#10B981", "#0D7377", "#3B5BB5", "#0B8F63"];

export default function SkillCloud() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative rounded-3xl border border-silver bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display font-semibold text-navy">Live Industry Skill Cloud</h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-medium text-emerald-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
          Updating daily
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {skillCloud.map((skill, i) => {
          const size = 0.78 + (skill.weight / 100) * 0.85;
          const color = palette[i % palette.length];
          const isActive = active === skill.name;
          return (
            <motion.button
              key={skill.name}
              onMouseEnter={() => setActive(skill.name)}
              onMouseLeave={() => setActive(null)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              whileHover={{ scale: 1.12, y: -3 }}
              style={{
                fontSize: `${size}rem`,
                borderColor: isActive ? color : "transparent",
                color: isActive ? color : "#1A2233",
              }}
              className="cursor-default rounded-full border bg-surface px-4 py-1.5 font-medium leading-none transition-colors duration-200 hover:bg-white hover:shadow-glow"
            >
              {skill.name}
            </motion.button>
          );
        })}
      </div>
      <p className="mt-5 text-xs text-muted">
        Sized by demand frequency across {(12480).toLocaleString()}+ live job listings. Hover a skill to highlight it.
      </p>
    </div>
  );
}
