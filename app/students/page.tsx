"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import StudentUploadModule from "@/components/StudentUploadModule";
import Footer from "@/components/Footer";

export default function StudentsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

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
            <GraduationCap size={14} className="text-emerald" />
            Built for Students — Final Year, Placement Prep & Career Switchers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mx-auto max-w-4xl text-balance text-center font-display text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-6xl"
          >
            Is Your Resume{" "}
            <span className="text-gradient bg-[length:200%_auto] animate-gradient-x">Industry Ready?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-balance text-center text-base text-muted sm:text-lg"
          >
            Upload your resume — and optionally your transcript — and our AI builds a personalised
            career-readiness report: skill-gap analysis, industry fit, missing certifications,
            and a step-by-step roadmap built around what&apos;s actually in your documents.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="#student-upload-module"
              className="btn-ripple group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-7 py-3.5 text-sm font-semibold text-white shadow-elevated transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-14px_rgba(16,185,129,0.45)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald to-teal opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
              <Sparkles size={17} className="relative" />
              <span className="relative">Analyze My Resume</span>
            </Link>
            <Link
              href="/student-dashboard"
              className="group inline-flex items-center gap-2 rounded-full border border-silver bg-white px-7 py-3.5 text-sm font-semibold text-navy shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-deepblue/40 hover:shadow-soft"
            >
              Explore Demo Report
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      <StudentUploadModule />
      <Footer />
    </main>
  );
}
