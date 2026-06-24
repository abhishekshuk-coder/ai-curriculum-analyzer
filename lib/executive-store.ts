const HISTORY_KEY = "analysis-history";
const MAX_ENTRIES = 200;

export type AnalysisType = "curriculum" | "student" | "faculty";

export interface HistoryEntry {
  id: string;
  type: AnalysisType;
  title: string;
  healthScore: number;
  healthLabel: string;
  scores: Array<{ key: string; label: string; value: number }>;
  sourceFilename: string;
  analyzedAt: string;
  topStrength: string;
  topWeakness: string;
  avgScore: number;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function addToHistory(entry: Omit<HistoryEntry, "id">): void {
  if (typeof window === "undefined") return;
  const history = loadHistory();
  const newEntry: HistoryEntry = { ...entry, id: generateId() };
  history.unshift(newEntry);
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function removeFromHistory(id: string): void {
  if (typeof window === "undefined") return;
  const history = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

export function buildHistoryEntry(
  type: AnalysisType,
  title: string,
  healthScore: number,
  healthLabel: string,
  scores: Array<{ key: string; label: string; value: number }>,
  sourceFilename: string,
  analyzedAt: string
): Omit<HistoryEntry, "id"> {
  const sorted = [...scores].sort((a, b) => b.value - a.value);
  return {
    type,
    title,
    healthScore,
    healthLabel,
    scores,
    sourceFilename,
    analyzedAt,
    topStrength: sorted[0]?.label ?? "N/A",
    topWeakness: sorted[sorted.length - 1]?.label ?? "N/A",
    avgScore: scores.length ? Math.round(scores.reduce((s, c) => s + c.value, 0) / scores.length) : 0,
  };
}
