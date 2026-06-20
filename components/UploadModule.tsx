"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud, FileText, FileSpreadsheet, Presentation, File as FileIcon, CheckCircle2, AlertCircle } from "lucide-react";
import ProcessingOverlay, { PROCESSING_STEPS } from "@/components/ProcessingOverlay";
import { saveAnalysis } from "@/lib/analysis-store";
import type { AnalysisResult } from "@/lib/analysis-schema";

const fileTypes = [
  { ext: "PDF", icon: FileText },
  { ext: "DOCX", icon: FileIcon },
  { ext: "PPTX", icon: Presentation },
  { ext: "XLSX", icon: FileSpreadsheet },
  { ext: "CSV", icon: FileSpreadsheet },
];

const extraction = [
  "Subjects & Topics", "Learning Outcomes", "Course Outcomes", "Skill Components",
  "Tools & Technologies", "Certifications", "Practical Components",
];

const ACCEPTED_EXTENSIONS = ["pdf", "docx", "pptx", "xlsx", "csv"];
const MAX_FILE_BYTES = 25 * 1024 * 1024;

const STEP_INTERVAL_MS = 1700;

type Status = "idle" | "running" | "done" | "error";

export default function UploadModule() {
  const router = useRouter();
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const validateFile = useCallback((file: File): string | null => {
    const ext = file.name.toLowerCase().split(".").pop() ?? "";
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return `".${ext}" isn't supported yet — please upload a PDF, DOCX, PPTX, XLSX, or CSV file.`;
    }
    if (file.size > MAX_FILE_BYTES) {
      return "That file is larger than the 25MB limit.";
    }
    return null;
  }, []);

  const runAnalysis = useCallback(async (file: File) => {
    setStatus("running");
    setError(null);
    setStepIndex(0);
    clearTimer();

    timerRef.current = setInterval(() => {
      setStepIndex((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, STEP_INTERVAL_MS);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const payload = await res.json().catch(() => null);

      if (!res.ok || !payload?.result) {
        throw new Error(payload?.error ?? "The analysis engine couldn't process this file. Please try again.");
      }

      clearTimer();
      setStepIndex(PROCESSING_STEPS.length - 1);
      setStatus("done");

      saveAnalysis({
        result: payload.result as AnalysisResult,
        sourceFilename: payload.sourceFilename ?? file.name,
        analyzedAt: new Date().toISOString(),
      });

      setTimeout(() => router.push("/results"), 1100);
    } catch (err) {
      clearTimer();
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong while analyzing this curriculum.");
    }
  }, [clearTimer, router]);

  const startWithFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    setFileName(file.name);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      setPendingFile(null);
      return;
    }
    setError(null);
    setPendingFile(file);
    void runAnalysis(file);
  }, [runAnalysis, validateFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) startWithFile(file);
  }, [startWithFile]);

  const handleRetry = useCallback(() => {
    if (pendingFile) void runAnalysis(pendingFile);
  }, [pendingFile, runAnalysis]);

  const handleCancel = useCallback(() => {
    clearTimer();
    setStatus("idle");
    setError(null);
    setFileName(null);
    setPendingFile(null);
  }, [clearTimer]);

  const showOverlay = status === "running" || status === "done" || (status === "error" && pendingFile !== null);

  return (
    <section id="upload-module" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-deepblue">
              Curriculum Upload Module
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
              Drop in any curriculum — AI does the rest
            </h2>
            <p className="mt-4 text-muted">
              Upload an entire program curriculum, a single course syllabus, a department handbook,
              or university regulations. Our AI extracts the structure automatically.
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
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-8 py-16 text-center transition-all duration-300 ${
                dragOver
                  ? "scale-[1.01] border-emerald bg-emerald/5 shadow-glow"
                  : "border-silver bg-surface hover:border-deepblue/40 hover:bg-white hover:shadow-soft"
              }`}
            >
              <motion.div
                animate={dragOver ? { scale: 1.15, rotate: 6 } : { scale: 1, rotate: 0 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-deepblue to-emerald text-white shadow-elevated"
              >
                <UploadCloud size={28} />
              </motion.div>
              <h3 className="mt-5 font-display font-semibold text-navy">
                {fileName ? fileName : "Drag & drop your curriculum file"}
              </h3>
              <p className="mt-1 text-sm text-muted">or click to browse — PDF, DOCX, PPTX, XLSX, CSV up to 25MB</p>
              <label className="btn-ripple group/btn relative mt-6 inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald to-teal opacity-0 transition-all duration-500 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
                <span className="relative">Choose File</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.pptx,.xlsx,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) startWithFile(file);
                    e.target.value = "";
                  }}
                />
              </label>

              <AnimatePresence>
                {status === "error" && !pendingFile && error && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#DC6B5A]"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="mt-4 text-xs text-muted">
                Real AI analysis powered by Claude — your document is read, scored, and reported in under a minute.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showOverlay && fileName && (
          <ProcessingOverlay
            fileName={fileName}
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
