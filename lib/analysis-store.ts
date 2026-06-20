import type { AnalysisResult } from "./analysis-schema";

const STORAGE_KEY = "curriculum-analysis-result";

export interface StoredAnalysis {
  result: AnalysisResult;
  sourceFilename: string;
  analyzedAt: string;
}

export function saveAnalysis(data: StoredAnalysis) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadAnalysis(): StoredAnalysis | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAnalysis;
  } catch {
    return null;
  }
}

export function clearAnalysis() {
  sessionStorage.removeItem(STORAGE_KEY);
}
