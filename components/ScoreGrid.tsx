"use client";

import { motion } from "framer-motion";
import {
  Target, Briefcase, Rocket, Building2, Lightbulb, FlaskConical, Layers, Sparkles,
  type LucideIcon,
} from "lucide-react";
import { scoreCards as mockScoreCards } from "@/lib/mock-data";

const icons: Record<string, LucideIcon> = {
  Target, Briefcase, Rocket, Building2, Lightbulb, FlaskConical, Layers, Sparkles,
};

function scoreColor(value: number) {
  if (value >= 80) return "#10B981";
  if (value >= 65) return "#3B5BB5";
  if (value >= 50) return "#D4AF37";
  return "#DC6B5A";
}

export interface ScoreCard {
  key: string;
  label: string;
  value: number;
  icon: string;
  rationale?: string;
}

interface ScoreGridProps {
  scores?: ScoreCard[];
  showHeading?: boolean;
}

export default function ScoreGrid({ scores, showHeading = true }: ScoreGridProps = {}) {
  const scoreCards: ScoreCard[] = scores ?? mockScoreCards;
  return (
    <section className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {showHeading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-deepblue">
              AI Curriculum Analysis Engine
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
              Eight scores. One unmistakable picture.
            </h2>
            <p className="mt-4 text-muted">
              We compare curriculum content against industry demand and future skill forecasts to
              generate a complete relevance profile in seconds.
            </p>
          </motion.div>
        )}

        <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${showHeading ? "mt-14" : ""}`}>
          {scoreCards.map((card, i) => {
            const Icon = icons[card.icon];
            const color = scoreColor(card.value);
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group rounded-2xl border border-silver bg-surface/60 p-5 shadow-soft transition-all duration-300 hover:border-transparent hover:bg-white hover:shadow-elevated"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ background: `${color}1A`, color }}
                  >
                    {Icon && <Icon size={18} />}
                  </div>
                  <span className="font-display text-2xl font-bold" style={{ color }}>
                    {card.value}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-navy">{card.label}</h3>
                {card.rationale && (
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{card.rationale}</p>
                )}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-silver">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${card.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.15 + i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
