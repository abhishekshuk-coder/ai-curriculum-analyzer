"use client";

import { motion } from "framer-motion";
import { healthMeter as mockHealthMeter } from "@/lib/mock-data";

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BAND_CAPTIONS: Record<string, string> = {
  Excellent: "right at the top of the band — a model for industry-aligned program design.",
  Good: "close to Excellent, with clear room to modernize emerging-skill coverage.",
  Average: "mid-pack — solid fundamentals, but meaningful gaps are holding back graduate readiness.",
  "Needs Improvement": "well below where it should be — the findings below identify exactly what's driving this and how to close the gap fastest.",
};

interface HealthMeterProps {
  score?: number;
  label?: string;
  title?: string;
  subjectNoun?: string;
}

export default function HealthMeter({ score, label, title, subjectNoun }: HealthMeterProps = {}) {
  const healthMeter = {
    ...mockHealthMeter,
    score: score ?? mockHealthMeter.score,
    label: label ?? mockHealthMeter.label,
  };
  const pct = healthMeter.score / 100;
  const offset = CIRCUMFERENCE * (1 - pct);
  const noun = subjectNoun ?? "program";

  return (
    <div className="rounded-3xl border border-silver bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-soft">
      <h3 className="font-display font-semibold text-navy mb-6">{title ?? "AI Curriculum Health Meter"}</h3>
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="relative h-48 w-48 shrink-0">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#E5E9F0" strokeWidth="14" />
            <motion.circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke="url(#healthGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              whileInView={{ strokeDashoffset: offset }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold text-navy">{healthMeter.score}</span>
            <span className="text-xs uppercase tracking-wider text-muted">/ 100</span>
            <span className="mt-2 rounded-full bg-deepblue/10 px-3 py-1 text-xs font-semibold text-deepblue">
              {healthMeter.label}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2.5">
          {healthMeter.bands.map((band) => {
            const isCurrent = band.name === healthMeter.label;
            return (
              <div
                key={band.name}
                className={`flex items-center justify-between rounded-xl border px-4 py-2.5 transition-all duration-300 ${
                  isCurrent
                    ? "border-deepblue/30 bg-deepblue/5 shadow-soft scale-[1.02]"
                    : "border-silver bg-surface/60"
                }`}
              >
                <span className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: band.color }} />
                  {band.name}
                </span>
                <span className="text-xs text-muted">{band.min}+ score</span>
              </div>
            );
          })}
          <p className="pt-1 text-xs text-muted">
            This {noun} lands in the <span className="font-semibold text-navy">{healthMeter.label}</span> band —{" "}
            {BAND_CAPTIONS[healthMeter.label] ?? "see the findings below for what's driving this score."}
          </p>
        </div>
      </div>
    </div>
  );
}
