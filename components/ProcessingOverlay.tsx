"use client";

import { motion } from "framer-motion";
import { FileSearch, Brain, TrendingUp, Gauge, FileCheck2, AlertTriangle, Loader2 } from "lucide-react";

export const PROCESSING_STEPS = [
  { id: "extract", label: "Extracting text from your document", icon: FileSearch },
  { id: "identify", label: "Identifying subjects & skills", icon: Brain },
  { id: "compare", label: "Comparing against live industry demand", icon: TrendingUp },
  { id: "score", label: "Generating your relevance scores", icon: Gauge },
  { id: "report", label: "Compiling narrative findings & report", icon: FileCheck2 },
] as const;

interface ProcessingOverlayProps {
  fileName: string;
  stepIndex: number;
  status: "running" | "done" | "error";
  errorMessage?: string | null;
  onRetry: () => void;
  onCancel: () => void;
}

export default function ProcessingOverlay({
  fileName, stepIndex, status, errorMessage, onRetry, onCancel,
}: ProcessingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/40 px-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-lg rounded-3xl border border-silver bg-white p-8 shadow-elevated"
      >
        {status === "error" ? (
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DC6B5A]/10 text-[#DC6B5A]">
              <AlertTriangle size={26} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">Analysis didn&apos;t complete</h3>
            <p className="mt-2 text-sm text-muted">
              {errorMessage ?? "Something went wrong while analyzing this curriculum."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="rounded-full border border-silver px-5 py-2.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-navy"
              >
                Cancel
              </button>
              <button
                onClick={onRetry}
                className="rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-dark">
                AI Curriculum Analysis Engine
              </span>
              <h3 className="mt-2 truncate font-display text-lg font-semibold text-navy">
                Analyzing &ldquo;{fileName}&rdquo;
              </h3>
              <p className="mt-1 text-sm text-muted">
                This usually takes under a minute — Claude is reading your document closely.
              </p>
            </div>

            <ul className="mt-7 space-y-2.5">
              {PROCESSING_STEPS.map((step, i) => {
                const isDone = status === "done" || i < stepIndex;
                const isActive = status !== "done" && i === stepIndex;
                const Icon = step.icon;
                return (
                  <motion.li
                    key={step.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? "scale-[1.01] border-deepblue/30 bg-deepblue/5 shadow-soft"
                        : isDone
                        ? "border-emerald/30 bg-emerald/5"
                        : "border-silver bg-surface/50"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isDone ? "bg-emerald text-white" : isActive ? "bg-deepblue text-white" : "bg-silver text-muted"
                      }`}
                    >
                      {isActive ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                    </span>
                    <span className={`text-sm font-medium ${isDone || isActive ? "text-navy" : "text-muted"}`}>
                      {step.label}
                    </span>
                    {isDone && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-emerald-dark"
                      >
                        <FileCheck2 size={16} />
                      </motion.span>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            {status === "done" && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center text-sm font-semibold text-emerald-dark"
              >
                Report ready — opening your dashboard…
              </motion.p>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
