import { buildReportHtml } from "./report";
import { buildStudentReportHtml } from "./student-report";
import { buildFacultyReportHtml } from "./faculty-report";
import type { StoredAnalysis } from "./analysis-store";
import type { StoredStudentAnalysis } from "./student-analysis-store";
import type { StoredFacultyAnalysis } from "./faculty-analysis-store";

function openPrintWindow(html: string, title: string) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Please allow pop-ups to export your report as PDF.");
    return;
  }
  w.document.write(html);
  w.document.close();
  w.document.title = title;
  w.onafterprint = () => w.close();
  setTimeout(() => w.print(), 500);
}

export function exportCurriculumPdf(analysis: StoredAnalysis) {
  openPrintWindow(buildReportHtml(analysis), `${analysis.result.programName} — Report`);
}

export function exportStudentPdf(analysis: StoredStudentAnalysis) {
  openPrintWindow(buildStudentReportHtml(analysis), `${analysis.result.studentName} — Career Report`);
}

export function exportFacultyPdf(analysis: StoredFacultyAnalysis) {
  openPrintWindow(buildFacultyReportHtml(analysis), `${analysis.result.facultyName} — Faculty Report`);
}
