import * as XLSX from "xlsx";
import type { HistoryEntry } from "./executive-store";

function download(wb: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(wb, filename);
}

export function exportHistoryToXlsx(history: HistoryEntry[]) {
  const wb = XLSX.utils.book_new();

  const rows = history.map((h) => ({
    Type: h.type,
    Title: h.title,
    "Health Score": h.healthScore,
    "Health Label": h.healthLabel,
    "Avg Score": h.avgScore,
    "Top Strength": h.topStrength,
    "Top Weakness": h.topWeakness,
    "Source File": h.sourceFilename,
    "Analyzed At": new Date(h.analyzedAt).toLocaleString(),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 12 }, { wch: 35 }, { wch: 12 }, { wch: 18 },
    { wch: 10 }, { wch: 25 }, { wch: 25 }, { wch: 30 }, { wch: 22 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Analysis History");

  const summary = [
    { Metric: "Total Analyses", Value: history.length },
    { Metric: "Curriculum Analyses", Value: history.filter((h) => h.type === "curriculum").length },
    { Metric: "Student Analyses", Value: history.filter((h) => h.type === "student").length },
    { Metric: "Faculty Analyses", Value: history.filter((h) => h.type === "faculty").length },
    { Metric: "Average Health Score", Value: history.length ? Math.round(history.reduce((s, h) => s + h.healthScore, 0) / history.length) : 0 },
    { Metric: "Highest Score", Value: history.length ? Math.max(...history.map((h) => h.healthScore)) : 0 },
    { Metric: "Lowest Score", Value: history.length ? Math.min(...history.map((h) => h.healthScore)) : 0 },
  ];
  const summaryWs = XLSX.utils.json_to_sheet(summary);
  summaryWs["!cols"] = [{ wch: 22 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

  download(wb, "analysis-history.xlsx");
}

export function exportScoresToXlsx(
  title: string,
  scores: Array<{ key: string; label: string; value: number }>,
  healthScore: number,
  healthLabel: string
) {
  const wb = XLSX.utils.book_new();

  const overview = [
    { Metric: "Program/Profile", Value: title },
    { Metric: "Health Score", Value: healthScore },
    { Metric: "Health Label", Value: healthLabel },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(overview), "Overview");

  const scoreRows = scores.map((s) => ({ Dimension: s.label, Score: s.value }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(scoreRows), "Scores");

  download(wb, `${title.replace(/[^a-zA-Z0-9]/g, "-")}-scores.xlsx`);
}
