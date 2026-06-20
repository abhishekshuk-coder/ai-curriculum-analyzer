"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileSearch, Sparkles } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import SkillCloud from "./SkillCloud";
import HealthMeter from "./HealthMeter";
import { liveStats, programs } from "@/lib/mock-data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 bg-dot-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald/15 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-40 -left-32 h-80 w-80 rounded-full bg-deepblue/10 blur-3xl animate-float [animation-delay:2s]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-silver bg-white/80 px-4 py-1.5 text-xs font-medium text-deepblue shadow-soft backdrop-blur"
        >
          <Sparkles size={14} className="text-emerald" />
          Built for Universities, Colleges & Training Institutes — Any Program
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mx-auto max-w-4xl text-balance text-center font-display text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-6xl"
        >
          Is Your Curriculum{" "}
          <span className="text-gradient bg-[length:200%_auto] animate-gradient-x">Future Ready?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-center text-base text-muted sm:text-lg"
        >
          Upload any curriculum and instantly discover how well it aligns with industry demand,
          future skills, and employer expectations — powered by AI analysis across 10,000+ live job listings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            id="upload"
            href="#upload-module"
            className="btn-ripple group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-7 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-14px_rgba(16,185,129,0.45)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald to-teal opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            <FileSearch size={17} className="relative" />
            <span className="relative">Upload Curriculum</span>
          </Link>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full border border-silver bg-white px-7 py-3.5 text-sm font-semibold text-navy shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-deepblue/40 hover:shadow-soft"
          >
            Explore Demo Report
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Programs ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-muted">Works for</span>
          {programs.slice(0, 8).map((p) => (
            <span
              key={p}
              className="rounded-full border border-silver bg-white/70 px-3 py-1 text-xs font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald/40 hover:text-emerald-dark hover:shadow-soft"
            >
              {p}
            </span>
          ))}
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">+7 more</span>
        </motion.div>

        {/* Live animated stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {liveStats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-silver bg-white/80 px-4 py-5 text-center shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald/30 hover:shadow-glow"
            >
              <div className="font-display text-2xl font-bold text-navy sm:text-3xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-xs font-medium text-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dashboard preview: skill cloud + health meter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-2"
        >
          <SkillCloud />
          <HealthMeter />
        </motion.div>
      </div>
    </section>
  );
}
