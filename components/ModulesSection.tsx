"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Users, FileBarChart, ArrowUpRight } from "lucide-react";

const modules = [
  {
    id: "students",
    href: "/students",
    icon: GraduationCap,
    title: "For Students",
    tagline: "Know exactly where you stand",
    points: [
      "Upload resume & transcript",
      "Personalised skill-gap report",
      "Career path suggestions",
      "Industry readiness score",
      "Certification recommendations",
      "Guided learning roadmap",
    ],
    color: "from-deepblue to-deepblue-light",
  },
  {
    id: "faculty",
    icon: Users,
    title: "For Faculty",
    tagline: "Turn insight into curriculum action",
    points: [
      "Curriculum improvement reports",
      "New course & topic suggestions",
      "Lab and practical recommendations",
      "Certification roadmaps",
      "Industry project ideas",
      "Industry collaboration leads",
    ],
    color: "from-emerald to-teal",
  },
  {
    id: "reporting",
    icon: FileBarChart,
    title: "Executive Reporting",
    tagline: "Board-ready, accreditation-ready",
    points: [
      "Downloadable PDF reports",
      "Excel data exports",
      "PowerPoint presentations",
      "NAAC / NBA / AACSB / ABET formats",
      "NIRF-aligned summaries",
      "Academic Council briefing decks",
    ],
    color: "from-navy to-deepblue",
  },
];

export default function ModulesSection() {
  return (
    <section className="relative bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-dark">
            Built for Every Stakeholder
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
            One platform, three audiences, zero guesswork
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {modules.map((m, i) => (
            <motion.div
              key={m.id}
              id={m.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-silver bg-white p-7 shadow-soft transition-all duration-300 hover:shadow-elevated"
            >
              <div className={`absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${m.color} opacity-[0.07] transition-transform duration-500 group-hover:scale-125`} />
              <div className={`relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${m.color} text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                <m.icon size={22} />
              </div>
              <h3 className="relative mt-5 font-display text-xl font-bold text-navy">{m.title}</h3>
              <p className="relative mt-1 text-sm font-medium text-emerald-dark">{m.tagline}</p>
              <ul className="relative mt-5 space-y-2">
                {m.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-deepblue/40 transition-colors duration-300 group-hover:bg-emerald" />
                    {p}
                  </li>
                ))}
              </ul>
              {m.href ? (
                <Link
                  href={m.href}
                  className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-deepblue opacity-0 transition-all duration-300 group-hover:opacity-100"
                >
                  Learn more <ArrowUpRight size={15} />
                </Link>
              ) : (
                <span className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-deepblue opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Learn more <ArrowUpRight size={15} />
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
