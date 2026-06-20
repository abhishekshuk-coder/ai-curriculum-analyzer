"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Plus, Check, TrendingUp } from "lucide-react";
import { simulatorAdditions as mockAdditions, simulatorBaseline as mockBaseline } from "@/lib/mock-data";

const metrics = [
  { key: "employability", label: "Employability" },
  { key: "relevance", label: "Relevance" },
  { key: "future", label: "Future Readiness" },
] as const;

export interface SimulatorAddition {
  id: string;
  label: string;
  impact: { employability: number; relevance: number; future: number };
}

export interface SimulatorBaseline {
  employability: number;
  relevance: number;
  future: number;
}

interface EmployabilitySimulatorProps {
  baseline?: SimulatorBaseline;
  additions?: SimulatorAddition[];
}

export default function EmployabilitySimulator({ baseline, additions }: EmployabilitySimulatorProps = {}) {
  const simulatorBaseline = baseline ?? mockBaseline;
  const simulatorAdditions = additions ?? mockAdditions;
  const [selected, setSelected] = useState<string[]>([]);

  const totals = useMemo(() => {
    const result = { ...simulatorBaseline };
    for (const id of selected) {
      const addition = simulatorAdditions.find((a) => a.id === id);
      if (!addition) continue;
      result.employability += addition.impact.employability;
      result.relevance += addition.impact.relevance;
      result.future += addition.impact.future;
    }
    return {
      employability: Math.min(100, result.employability),
      relevance: Math.min(100, result.relevance),
      future: Math.min(100, result.future),
    };
  }, [selected, simulatorBaseline, simulatorAdditions]);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="rounded-3xl border border-silver bg-white p-6 shadow-soft sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald to-teal text-white shadow-soft">
          <SlidersHorizontal size={20} />
        </span>
        <div>
          <h3 className="font-display font-semibold text-navy">Employability Simulator™</h3>
          <p className="text-xs text-muted">Add courses, skills, or certifications — see the impact instantly</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          {simulatorAdditions.map((addition) => {
            const active = selected.includes(addition.id);
            return (
              <button
                key={addition.id}
                onClick={() => toggle(addition.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
                  active
                    ? "border-emerald/50 bg-emerald/5 shadow-soft"
                    : "border-silver bg-surface/60 hover:border-deepblue/30 hover:bg-white hover:shadow-soft"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-300 ${
                      active ? "border-emerald bg-emerald text-white" : "border-silver text-transparent"
                    }`}
                  >
                    {active ? <Check size={14} /> : <Plus size={14} />}
                  </span>
                  <span className={`font-medium ${active ? "text-navy" : "text-ink"}`}>{addition.label}</span>
                </span>
                <span className="text-xs font-semibold text-emerald-dark">
                  +{addition.impact.employability} emp · +{addition.impact.future} future
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-surface to-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy">
            <TrendingUp size={16} className="text-emerald" />
            Projected Score Impact
          </div>
          <div className="mt-5 space-y-5">
            {metrics.map((m) => {
              const base = simulatorBaseline[m.key];
              const current = totals[m.key];
              const delta = current - base;
              return (
                <div key={m.key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{m.label}</span>
                    <span className="flex items-center gap-1.5 font-semibold text-navy">
                      {current}
                      <AnimatePresence>
                        {delta > 0 && (
                          <motion.span
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="rounded-full bg-emerald/15 px-1.5 py-0.5 text-xs font-bold text-emerald-dark"
                          >
                            +{delta}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-silver">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-deepblue to-emerald"
                      animate={{ width: `${current}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-xs text-muted">
            {selected.length === 0
              ? "Select additions on the left to simulate their impact on your scores."
              : `${selected.length} addition${selected.length > 1 ? "s" : ""} selected — scores update in real time.`}
          </p>
        </div>
      </div>
    </div>
  );
}
