import type { StoredFacultyAnalysis } from "./faculty-analysis-store";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function severityColor(severity: string) {
  switch (severity) {
    case "critical": return "#DC6B5A";
    case "high": return "#D4AF37";
    case "positive": return "#10B981";
    default: return "#3B5BB5";
  }
}

export function buildFacultyReportHtml({ result, sourceFilenames, analyzedAt }: StoredFacultyAnalysis): string {
  const date = new Date(analyzedAt).toLocaleString();
  const sortedActions = [...result.improvementRoadmap].sort((a, b) => a.priority - b.priority);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(result.facultyName)} — Faculty Teaching & Research Report</title>
<style>
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #1F2937; background: #F5F7FA; margin: 0; padding: 40px; line-height: 1.6; }
  .container { max-width: 900px; margin: auto; }
  h1 { color: #0F2557; font-size: 26px; margin-bottom: 4px; }
  h2 { color: #0F2557; font-size: 18px; margin-top: 36px; border-bottom: 2px solid #E5E7EB; padding-bottom: 6px; }
  .meta { color: #6B7280; font-size: 13px; margin-bottom: 24px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
  .score-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin-top: 12px; }
  .score-card { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px; }
  .score-card .label { font-size: 13px; color: #6B7280; }
  .score-card .value { font-size: 24px; font-weight: 700; color: #0F2557; }
  .finding { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-top: 12px; }
  .finding h3 { margin: 0 0 8px; font-size: 15px; }
  .evidence { background: #F9FAFB; border-left: 3px solid #3B5BB5; padding: 8px 12px; margin-top: 8px; font-size: 13px; color: #4B5563; }
  .action { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px; margin-top: 10px; }
  .summary { background: #EFF6FF; border-radius: 12px; padding: 16px; margin-top: 12px; font-size: 14px; }
  .research-section { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-top: 12px; }
  @media print { body { padding: 20px; background: white; } }
</style>
</head>
<body>
<div class="container">
  <h1>${escapeHtml(result.facultyName)} — Teaching & Research Report</h1>
  <p class="meta">${escapeHtml(result.department)} · ${escapeHtml(sourceFilenames.portfolio)}${sourceFilenames.research ? ` + ${escapeHtml(sourceFilenames.research)}` : ""} · Analyzed ${escapeHtml(date)}</p>

  <div style="text-align:center;margin:24px 0">
    <div style="font-size:48px;font-weight:800;color:#0F2557">${result.healthScore}<span style="font-size:20px;color:#6B7280">/100</span></div>
    <div class="badge" style="background:${result.healthScore >= 85 ? "#D1FAE5;color:#065F46" : result.healthScore >= 70 ? "#DBEAFE;color:#1E3A8A" : result.healthScore >= 50 ? "#FEF3C7;color:#92400E" : "#FEE2E2;color:#991B1B"}">${escapeHtml(result.healthLabel)}</div>
  </div>

  <p class="summary">${escapeHtml(result.summary)}</p>

  <h2>Teaching Effectiveness Scores</h2>
  <div class="score-grid">
    ${result.scores.map((s) => `<div class="score-card"><div class="label">${escapeHtml(s.label)}</div><div class="value">${s.value}</div></div>`).join("\n    ")}
  </div>

  <h2>Key Findings</h2>
  ${result.findings.map((f) => `<div class="finding">
    <h3><span class="badge" style="background:${severityColor(f.severity)}20;color:${severityColor(f.severity)}">${escapeHtml(f.severity)}</span> ${escapeHtml(f.title)}</h3>
    <p>${escapeHtml(f.narrative)}</p>
    ${f.evidence.map((e) => `<div class="evidence">${escapeHtml(e)}</div>`).join("\n    ")}
  </div>`).join("\n  ")}

  <h2>Improvement Roadmap</h2>
  ${sortedActions.map((a, i) => `<div class="action">
    <strong>#${i + 1}. ${escapeHtml(a.action)}</strong>
    <p style="font-size:13px;color:#6B7280;margin:4px 0">${escapeHtml(a.rationale)}</p>
    <p style="font-size:13px;color:#10B981;margin:0">Expected: ${escapeHtml(a.expectedImpact)}</p>
  </div>`).join("\n  ")}

  <h2>Research Profile</h2>
  <div class="research-section">
    <p><strong>Publications:</strong> ${result.research.publicationCount} · <strong>Est. H-Index:</strong> ${result.research.estimatedHIndex} · <strong>Citation Potential:</strong> ${escapeHtml(result.research.citationPotential)}</p>
    <p>${escapeHtml(result.research.researchSummary)}</p>
  </div>

  <h2>Peer Benchmarking</h2>
  <div class="research-section">
    <p>${escapeHtml(result.research.peerBenchmark.benchmarkNarrative)}</p>
    <p class="summary">${escapeHtml(result.research.peerBenchmark.topResearchersComparison)}</p>
  </div>

  <h2>Research Directions</h2>
  ${result.research.researchDirections.map((d) => `<div class="action">
    <strong>${escapeHtml(d.direction)}</strong>
    <p style="font-size:13px;color:#6B7280;margin:4px 0">${escapeHtml(d.rationale)}</p>
    <span class="badge" style="background:#DBEAFE;color:#1E3A8A">${escapeHtml(d.impactPotential)} Impact</span>
  </div>`).join("\n  ")}

  <p style="text-align:center;color:#9CA3AF;font-size:12px;margin-top:40px">Generated by AI Curriculum Analyzer · ${escapeHtml(date)}</p>
</div>
</body>
</html>`;
}

export function downloadFacultyReport(analysis: StoredFacultyAnalysis) {
  const html = buildFacultyReportHtml(analysis);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${analysis.result.facultyName.replace(/[^a-zA-Z0-9]/g, "-")}-faculty-report.html`;
  a.click();
  URL.revokeObjectURL(url);
}
