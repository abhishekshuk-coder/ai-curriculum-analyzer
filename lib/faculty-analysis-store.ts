import type { FacultyAnalysisResult } from "./faculty-analysis-schema";
import { addToHistory, buildHistoryEntry } from "./executive-store";

const STORAGE_KEY = "faculty-analysis-result";

export interface StoredFacultyAnalysis {
  result: FacultyAnalysisResult;
  sourceFilenames: { portfolio: string; research: string | null };
  analyzedAt: string;
}

export function saveFacultyAnalysis(data: StoredFacultyAnalysis) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  addToHistory(buildHistoryEntry(
    "faculty",
    data.result.facultyName,
    data.result.healthScore,
    data.result.healthLabel,
    data.result.scores.map((s) => ({ key: s.key, label: s.label, value: s.value })),
    data.sourceFilenames.portfolio,
    data.analyzedAt
  ));
}

export function loadFacultyAnalysis(): StoredFacultyAnalysis | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredFacultyAnalysis;
  } catch {
    return null;
  }
}

export function clearFacultyAnalysis() {
  sessionStorage.removeItem(STORAGE_KEY);
}
