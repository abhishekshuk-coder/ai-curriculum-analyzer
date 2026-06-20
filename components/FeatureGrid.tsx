"use client";

import { motion } from "framer-motion";
import {
  Gauge, Radar, TrendingUp, Grid3x3, ListChecks, Stethoscope,
  SlidersHorizontal, FileBarChart, type LucideIcon,
} from "lucide-react";
import { dashboardCards } from "@/lib/mock-data";

const icons: Record<string, LucideIcon> = {
  Gauge, Radar, TrendingUp, Grid3x3, ListChecks, Stethoscope, SlidersHorizontal, FileBarChart,
};

export default function FeatureGrid() {
  return (
    <section id="platform" className="relative bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-dark">
            World-Class Dashboards
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
            Everything an Academic Council needs to modernize a program
          </h2>
          <p className="mt-4 text-muted">
            Eight purpose-built dashboards turn raw curriculum documents and live job-market signals
            into decisions your accreditation committee can act on.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardCards.map((card, i) => {
            const Icon = icons[card.icon];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                whileHover={{ y: -8 }}
                className="glow-ring group relative overflow-hidden rounded-2xl border border-silver bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-elevated"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-deepblue/5 to-emerald/10 transition-transform duration-500 group-hover:scale-150" />
                <div className="relative">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-deepblue/10 to-emerald/10 text-deepblue transition-all duration-300 group-hover:scale-110 group-hover:from-deepblue group-hover:to-emerald group-hover:text-white">
                    {Icon && <Icon size={20} />}
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-navy">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{card.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-deepblue opacity-0 transition-all duration-300 group-hover:opacity-100">
                    View dashboard →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
