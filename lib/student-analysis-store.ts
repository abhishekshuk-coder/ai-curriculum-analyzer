import type { StudentAnalysisResult } from "./student-analysis-schema";

const STORAGE_KEY = "student-analysis-result";

export interface StoredStudentAnalysis {
  result: StudentAnalysisResult;
  sourceFilenames: { resume: string; transcript: string | null };
  analyzedAt: string;
}

export function saveStudentAnalysis(data: StoredStudentAnalysis) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadStudentAnalysis(): StoredStudentAnalysis | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredStudentAnalysis;
  } catch {
    return null;
  }
}

export function clearStudentAnalysis() {
  sessionStorage.removeItem(STORAGE_KEY);
}
