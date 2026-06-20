import type { StoredAnalysis } from "./analysis-store";

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

export function buildReportHtml({ result, sourceFilename, analyzedAt }: StoredAnalysis): string {
  const date = new Date(analyzedAt).toLocaleString();
  const sortedActions = [...result.actionPlan].sort((a, b) => a.priority - b.priority);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(result.programName)} — Curriculum Relevance Report</title>
<style>
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #1F2937; background: #F5F7FA; margin: 0; padding: 40px; line-height: 1.6; }
  .sheet { max-width: 880px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E9F0; border-radius: 24px; padding: 48px; }
  h1 { font-size: 26px; color: #1E3A8A; margin: 0 0 4px; }
  h2 { font-size: 18px; color: #1E3A8A; margin: 36px 0 12px; border-bottom: 1px solid #E5E9F0; padding-bottom: 8px; }
  .eyebrow { text-transform: uppercase; letter-spacing: 0.16em; font-size: 11px; font-weight: 700; color: #10B981; }
  .meta { color: #5B677A; font-size: 13px; margin-top: 6px; }
  .summary { font-size: 15px; color: #374151; background: #F5F7FA; border-radius: 14px; padding: 16px 20px; margin-top: 16px; }
  .health { display: inline-flex; align-items: baseline; gap: 8px; background: linear-gradient(90deg, #1E3A8A, #10B981); color: white; border-radius: 14px; padding: 14px 22px; margin-top: 8px; }
  .health b { font-size: 28px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  td, th { text-align: left; padding: 8px 10px; font-size: 13px; border-bottom: 1px solid #E5E9F0; }
  th { color: #5B677A; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; }
  .score-val { font-weight: 700; color: #1E3A8A; }
  .pill { display: inline-block; border-radius: 999px; padding: 2px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: white; }
  .finding { border: 1px solid #E5E9F0; border-radius: 14px; padding: 14px 18px; margin-top: 10px; }
  .finding h4 { margin: 0 0 6px; font-size: 14px; color: #1E3A8A; }
  .finding p { margin: 4px 0; font-size: 13px; }
  .evidence { font-size: 12px; color: #5B677A; font-style: italic; margin: 4px 0 0 16px; }
  .action { display: flex; gap: 12px; border: 1px solid #E5E9F0; border-radius: 14px; padding: 12px 16px; margin-top: 8px; }
  .action .num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 999px; background: #1E3A8A1A; color: #1E3A8A; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
  .tag-list span { display: inline-block; background: #F5F7FA; border-radius: 999px; padding: 4px 12px; margin: 3px 4px 0 0; font-size: 12px; }
  .footer { margin-top: 40px; font-size: 11px; color: #9AA6B8; text-align: center; }
  @media print { body { background: white; padding: 0; } .sheet { border: none; border-radius: 0; } }
</style>
</head>
<body>
  <div class="sheet">
    <span class="eyebrow">AI Curriculum Analysis Engine · Powered by Claude</span>
    <h1>${escapeHtml(result.programName)}</h1>
    <p class="meta">Source document: ${escapeHtml(sourceFilename)} · Generated ${escapeHtml(date)}</p>

    <p class="summary">${escapeHtml(result.summary)}</p>

    <div class="health">
      <b>${result.healthScore}</b><span>/ 100 — ${escapeHtml(result.healthLabel)} curriculum health</span>
    </div>

    <h2>Relevance Scores</h2>
    <table>
      <thead><tr><th>Score</th><th>Value</th><th>Why</th></tr></thead>
      <tbody>
        ${result.scores.map((s) => `<tr><td>${escapeHtml(s.label)}</td><td class="score-val">${s.value}</td><td>${escapeHtml(s.rationale)}</td></tr>`).join("")}
      </tbody>
    </table>

    <h2>Subjects &amp; Modules Detected</h2>
    <div class="tag-list">${result.detectedSubjects.map((s) => `<span>${escapeHtml(s)}</span>`).join("")}</div>

    <h2>Narrative Findings &amp; Evidence</h2>
    ${result.findings.map((f) => `
      <div class="finding">
        <h4>${escapeHtml(f.title)} <span class="pill" style="background:${severityColor(f.severity)}">${escapeHtml(f.severity)}</span></h4>
        <p>${escapeHtml(f.narrative)}</p>
        ${f.evidence.map((e) => `<div class="evidence">&ldquo;${escapeHtml(e)}&rdquo;</div>`).join("")}
      </div>
    `).join("")}

    <h2>Missing Skills</h2>
    <p><strong>Critical:</strong> ${result.missingSkills.critical.map(escapeHtml).join(", ")}</p>
    <p><strong>High priority:</strong> ${result.missingSkills.high.map(escapeHtml).join(", ")}</p>
    <p><strong>Recommended:</strong> ${result.missingSkills.recommended.map(escapeHtml).join(", ")}</p>

    <h2>NIRF Benchmarking — ${escapeHtml(result.nirfBenchmark.fieldCategory)}</h2>
    <p>${escapeHtml(result.nirfBenchmark.benchmarkNarrative)}</p>
    <p class="summary">${escapeHtml(result.nirfBenchmark.gapAnalysis)}</p>

    <h2>AI Curriculum Doctor™ Diagnosis</h2>
    ${result.curriculumDoctor.map((d) => `<p><strong>${escapeHtml(d.type)}:</strong> ${d.items.map(escapeHtml).join("; ")}</p>`).join("")}

    <h2>Prioritized Action Plan</h2>
    ${sortedActions.map((a) => `
      <div class="action">
        <span class="num">${a.priority}</span>
        <div>
          <p style="margin:0;font-weight:700;color:#1E3A8A;">${escapeHtml(a.action)}</p>
          <p style="margin:2px 0;">${escapeHtml(a.rationale)}</p>
          <p style="margin:2px 0;color:#10B981;font-weight:600;">Expected impact: ${escapeHtml(a.expectedImpact)}</p>
        </div>
      </div>
    `).join("")}

    <p class="footer">Generated by the Universal AI Curriculum Relevance Analyzer — analysis produced by Claude (Anthropic). For institutional use; verify findings against your official records before submission to accreditation bodies.</p>
  </div>
</body>
</html>`;
}

export function downloadReport(analysis: StoredAnalysis) {
  const html = buildReportHtml(analysis);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = analysis.result.programName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  a.href = url;
  a.download = `${safeName || "curriculum"}-relevance-report.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
