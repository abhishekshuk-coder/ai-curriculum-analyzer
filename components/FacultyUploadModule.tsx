"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  UploadCloud, FileText, FileSpreadsheet, Presentation, File as FileIcon,
  CheckCircle2, AlertCircle,
} from "lucide-react";
import ProcessingOverlay, { PROCESSING_STEPS } from "@/components/ProcessingOverlay";
import { saveFacultyAnalysis } from "@/lib/faculty-analysis-store";
import type { FacultyAnalysisResult } from "@/lib/faculty-analysis-schema";

const fileTypes = [
  { ext: "PDF", icon: FileText },
  { ext: "DOCX", icon: FileIcon },
  { ext: "PPTX", icon: Presentation },
  { ext: "XLSX", icon: FileSpreadsheet },
  { ext: "CSV", icon: FileSpreadsheet },
];

const extraction = [
  "Teaching Effectiveness Analysis", "Research Impact Assessment", "Peer Benchmarking",
  "Pedagogy Improvement Roadmap", "Technology Integration Audit", "Accreditation Readiness",
];

const ACCEPTED_EXTENSIONS = ["pdf", "docx", "pptx", "xlsx", "csv"];
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const STEP_INTERVAL_MS = 1700;

type Status = "idle" | "running" | "done" | "error";

function validateFile(file: File): string | null {
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return `".${ext}" isn't supported yet — please upload a PDF, DOCX, PPTX, XLSX, or CSV file.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return "That file is larger than the 25MB limit.";
  }
  return null;
}

interface SlotProps {
  label: string;
  hint: string;
  required?: boolean;
  file: File | null;
  error: string | null;
  onSelect: (file: File) => void;
  onClear: () => void;
}

function UploadSlot({ label, hint, required, file, error, onSelect, onClear }: SlotProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onSelect(dropped);
  }, [onSelect]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${
        dragOver
          ? "scale-[1.01] border-emerald bg-emerald/5 shadow-glow"
          : file
          ? "border-emerald/40 bg-emerald/5"
          : "border-silver bg-surface hover:border-deepblue/40 hover:bg-white hover:shadow-soft"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-navy">{label}</span>
        {required ? (
          <span className="rounded-full bg-deepblue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-deepblue">Required</span>
        ) : (
          <span className="rounded-full bg-silver px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">Optional</span>
        )}
      </div>

      <motion.div
        animate={dragOver ? { scale: 1.12, rotate: 6 } : { scale: 1, rotate: 0 }}
        className={`mt-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-soft ${
          file ? "bg-gradient-to-br from-emerald to-teal" : "bg-gradient-to-br from-deepblue to-emerald"
        }`}
      >
        {file ? <CheckCircle2 size={22} /> : <UploadCloud size={22} />}
      </motion.div>

      <p className="mt-3 max-w-[220px] truncate text-sm font-medium text-navy">
        {file ? file.name : `Drag & drop your ${label.toLowerCase()}`}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>

      <div className="mt-4 flex items-center gap-3">
        <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-full border border-silver bg-white px-4 py-2 text-xs font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-deepblue/30 hover:shadow-soft">
          {file ? "Replace file" : "Choose file"}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.pptx,.xlsx,.csv"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) onSelect(picked);
              e.target.value = "";
            }}
          />
        </label>
        {file && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-muted transition-colors duration-200 hover:text-[#DC6B5A]"
          >
            Remove
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#DC6B5A]"
          >
            <AlertCircle size={14} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FacultyUploadModule() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<File | null>(null);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [research, setResearch] = useState<File | null>(null);
  const [researchError, setResearchError] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const handleSelectPortfolio = useCallback((file: File) => {
    const validationError = validateFile(file);
    setPortfolio(file);
    setPortfolioError(validationError);
  }, []);

  const handleSelectResearch = useCallback((file: File) => {
    const validationError = validateFile(file);
    setResearch(file);
    setResearchError(validationError);
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!portfolio || portfolioError) return;

    setStatus("running");
    setError(null);
    setStepIndex(0);
    clearTimer();

    timerRef.current = setInterval(() => {
      setStepIndex((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, STEP_INTERVAL_MS);

    try {
      const formData = new FormData();
      formData.append("portfolio", portfolio);
      if (research && !researchError) formData.append("research", research);

      const res = await fetch("/api/analyze-faculty", { method: "POST", body: formData });
      const payload = await res.json().catch(() => null);

      if (!res.ok || !payload?.result) {
        throw new Error(payload?.error ?? "The analysis engine couldn't process your documents. Please try again.");
      }

      clearTimer();
      setStepIndex(PROCESSING_STEPS.length - 1);
      setStatus("done");

      saveFacultyAnalysis({
        result: payload.result as FacultyAnalysisResult,
        sourceFilenames: { portfolio: portfolio.name, research: research?.name ?? null },
        analyzedAt: new Date().toISOString(),
      });

      setTimeout(() => router.push("/faculty-results"), 1100);
    } catch (err) {
      clearTimer();
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong while analyzing your documents.");
    }
  }, [portfolio, portfolioError, research, researchError, clearTimer, router]);

  const handleRetry = useCallback(() => {
    void runAnalysis();
  }, [runAnalysis]);

  const handleCancel = useCallback(() => {
    clearTimer();
    setStatus("idle");
    setError(null);
  }, [clearTimer]);

  const canSubmit = !!portfolio && !portfolioError && !researchError;
  const showOverlay = status === "running" || status === "done" || status === "error";

  return (
    <section id="faculty-upload-module" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-deepblue">
              Faculty Development Module
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
              Upload your teaching portfolio — get an expert assessment
            </h2>
            <p className="mt-4 text-muted">
              Add your teaching portfolio or syllabus (and optionally your research papers) and
              our AI builds a comprehensive teaching effectiveness analysis, research impact
              assessment, and peer benchmarking report — tailored to your academic profile.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {fileTypes.map(({ ext, icon: Icon }) => (
                <span
                  key={ext}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-silver bg-surface px-3 py-1.5 text-xs font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-deepblue/30 hover:shadow-soft"
                >
                  <Icon size={14} className="text-deepblue" />
                  {ext}
                </span>
              ))}
            </div>

            <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-2">
              {extraction.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-silver bg-surface p-6 shadow-soft sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <UploadSlot
                label="Teaching Portfolio"
                hint="Syllabus, course materials, or teaching docs (up to 25MB)"
                required
                file={portfolio}
                error={portfolioError}
                onSelect={handleSelectPortfolio}
                onClear={() => { setPortfolio(null); setPortfolioError(null); }}
              />
              <UploadSlot
                label="Research Papers"
                hint="Optional — adds research impact analysis to your report"
                file={research}
                error={researchError}
                onSelect={handleSelectResearch}
                onClear={() => { setResearch(null); setResearchError(null); }}
              />
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => void runAnalysis()}
              className={`btn-ripple group/btn relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 ${
                canSubmit
                  ? "bg-gradient-to-r from-deepblue to-deepblue-light hover:-translate-y-0.5 hover:shadow-elevated"
                  : "cursor-not-allowed bg-silver text-muted"
              }`}
            >
              {canSubmit && (
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald to-teal opacity-0 transition-all duration-500 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
              )}
              <span className="relative">Generate My Faculty Report</span>
            </button>

            <p className="mt-4 text-center text-xs text-muted">
              Real AI analysis powered by Claude — your documents are read, scored, and reported in under two minutes.
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showOverlay && portfolio && (
          <ProcessingOverlay
            fileName={portfolio.name}
            stepIndex={stepIndex}
            status={status === "done" ? "done" : status === "error" ? "error" : "running"}
            errorMessage={error}
            onRetry={handleRetry}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
