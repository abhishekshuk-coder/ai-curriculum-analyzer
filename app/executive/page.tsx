"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Download, FileBarChart, FileSpreadsheet, Presentation,
  Trash2, BarChart3, Users, GraduationCap, TrendingUp, Award, AlertCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { loadHistory, clearHistory, removeFromHistory, type HistoryEntry, type AnalysisType } from "@/lib/executive-store";
import { exportHistoryToXlsx } from "@/lib/export-xlsx";
import { exportHistoryToPptx } from "@/lib/export-pptx";
import {
  ACCREDITATION_INFO, generateAccreditationReport,
  type AccreditationBody,
} from "@/lib/accreditation-templates";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const typeConfig: Record<AnalysisType, { label: string; color: string; bg: string; icon: typeof BarChart3 }> = {
  curriculum: { label: "Curriculum", color: "text-deepblue", bg: "bg-deepblue/10", icon: BarChart3 },
  student: { label: "Student", color: "text-emerald-dark", bg: "bg-emerald/10", icon: GraduationCap },
  faculty: { label: "Faculty", color: "text-amber-700", bg: "bg-amber-100", icon: Users },
};

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: typeof BarChart3; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-silver bg-white p-5 shadow-soft"
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon size={18} />
        </span>
        <div>
          <p className="text-2xl font-bold text-navy">{value}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExecutivePage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<AnalysisType | "all">("all");
  const [accBody, setAccBody] = useState<AccreditationBody | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    setMounted(true);
  }, []);

  const filtered = useMemo(() =>
    filter === "all" ? history : history.filter((h) => h.type === filter),
  [history, filter]);

  const avgScore = useMemo(() =>
    filtered.length ? Math.round(filtered.reduce((s, h) => s + h.healthScore, 0) / filtered.length) : 0,
  [filtered]);

  const trendData = useMemo(() => {
    const byDate: Record<string, { scores: number[]; date: string }> = {};
    [...filtered].reverse().forEach((h) => {
      const d = new Date(h.analyzedAt).toLocaleDateString();
      if (!byDate[d]) byDate[d] = { scores: [], date: d };
      byDate[d].scores.push(h.healthScore);
    });
    return Object.values(byDate).map((d) => ({
      date: d.date,
      avgScore: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length),
    }));
  }, [filtered]);

  const handleRemove = (id: string) => {
    removeFromHistory(id);
    setHistory(loadHistory());
  };

  const handleClear = () => {
    if (confirm("Clear all analysis history? This cannot be undone.")) {
      clearHistory();
      setHistory([]);
    }
  };

  if (!mounted) return null;

  if (history.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-deepblue/10 text-deepblue">
              <FileBarChart size={36} />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold text-navy sm:text-3xl">No Analysis History Yet</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Run your first curriculum, student, or faculty analysis and it will automatically
              appear here. The executive dashboard aggregates all your analyses for reporting.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-deepblue to-deepblue-light px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5">
                Analyze a Curriculum
              </Link>
              <Link href="/students" className="inline-flex items-center gap-2 rounded-full border border-silver bg-white px-6 py-3 text-sm font-medium text-muted hover:text-navy">
                Analyze a Student
              </Link>
              <Link href="/faculty" className="inline-flex items-center gap-2 rounded-full border border-silver bg-white px-6 py-3 text-sm font-medium text-muted hover:text-navy">
                Analyze Faculty
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  const accReport = accBody ? generateAccreditationReport(accBody, history) : null;

  return (
    <main className="min-h-screen bg-surface">
      <div className="sticky top-0 z-40 border-b border-silver bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-navy">
              <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back
            </Link>
            <div className="hidden h-6 w-px bg-silver sm:block" />
            <div className="hidden sm:block">
              <p className="font-display text-sm font-bold text-navy">Executive Dashboard</p>
              <p className="text-xs text-muted">{history.length} analyses · All-time history</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => exportHistoryToXlsx(history)} className="inline-flex items-center gap-1.5 rounded-full border border-silver bg-white px-4 py-2 text-xs font-medium text-navy transition-all hover:-translate-y-0.5 hover:shadow-soft" title="Export as Excel">
              <FileSpreadsheet size={14} className="text-emerald" /> XLSX
            </button>
            <button onClick={() => exportHistoryToPptx(history)} className="inline-flex items-center gap-1.5 rounded-full border border-silver bg-white px-4 py-2 text-xs font-medium text-navy transition-all hover:-translate-y-0.5 hover:shadow-soft" title="Export as PowerPoint">
              <Presentation size={14} className="text-deepblue" /> PPTX
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 pt-8 lg:px-8 pb-24">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Analyses" value={history.length} icon={BarChart3} color="bg-deepblue/10 text-deepblue" />
          <StatCard label="Avg Health Score" value={avgScore} icon={TrendingUp} color="bg-emerald/10 text-emerald-dark" />
          <StatCard label="Highest Score" value={Math.max(...history.map((h) => h.healthScore))} icon={Award} color="bg-amber-100 text-amber-700" />
          <StatCard label="Lowest Score" value={Math.min(...history.map((h) => h.healthScore))} icon={AlertCircle} color="bg-red-50 text-red-600" />
        </div>

        {/* Trend chart */}
        {trendData.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-silver bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold text-navy">Health Score Trend</h2>
            <p className="mt-1 text-sm text-muted">Average health score over time across all analyses</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" fontSize={11} tick={{ fill: "#6B7280" }} />
                  <YAxis domain={[0, 100]} fontSize={11} tick={{ fill: "#6B7280" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="avgScore" stroke="#1E3A8A" strokeWidth={2} fill="url(#trendGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Module breakdown */}
        <div className="grid gap-4 sm:grid-cols-3">
          {(["curriculum", "student", "faculty"] as const).map((type) => {
            const items = history.filter((h) => h.type === type);
            const cfg = typeConfig[type];
            const avg = items.length ? Math.round(items.reduce((s, h) => s + h.healthScore, 0) / items.length) : 0;
            return (
              <motion.div key={type} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-2xl border border-silver bg-white p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${cfg.bg} ${cfg.color}`}>
                    <cfg.icon size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">{cfg.label} Module</p>
                    <p className="text-xs text-muted">{items.length} analyses · Avg: {avg}/100</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* History table */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl border border-silver bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-navy">Analysis History</h2>
              <p className="mt-1 text-sm text-muted">All past analyses across all modules</p>
            </div>
            <div className="flex items-center gap-2">
              {(["all", "curriculum", "student", "faculty"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    filter === f ? "bg-deepblue text-white" : "border border-silver bg-surface text-muted hover:text-navy"
                  }`}>
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <button onClick={handleClear} className="ml-2 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50" title="Clear all history">
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-silver text-xs font-semibold uppercase tracking-wider text-muted">
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Title</th>
                  <th className="px-3 py-3">Score</th>
                  <th className="px-3 py-3">Label</th>
                  <th className="px-3 py-3">Top Strength</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => {
                  const cfg = typeConfig[h.type];
                  return (
                    <tr key={h.id} className="border-b border-silver/50 transition-colors hover:bg-surface">
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${cfg.bg} ${cfg.color}`}>
                          <cfg.icon size={11} /> {cfg.label}
                        </span>
                      </td>
                      <td className="max-w-[200px] truncate px-3 py-3 font-medium text-navy">{h.title}</td>
                      <td className="px-3 py-3 font-bold text-navy">{h.healthScore}</td>
                      <td className="px-3 py-3 text-muted">{h.healthLabel}</td>
                      <td className="px-3 py-3 text-muted">{h.topStrength}</td>
                      <td className="px-3 py-3 text-xs text-muted">{new Date(h.analyzedAt).toLocaleDateString()}</td>
                      <td className="px-3 py-3">
                        <button onClick={() => handleRemove(h.id)} className="text-muted transition-colors hover:text-red-500" title="Remove">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">No analyses match the selected filter.</p>
            )}
          </div>
        </motion.div>

        {/* Accreditation Report Builder */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl border border-silver bg-white p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-navy">Accreditation Report Builder</h2>
          <p className="mt-1 text-sm text-muted">Generate structured reports mapped to accreditation criteria from your analysis data</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(ACCREDITATION_INFO) as AccreditationBody[]).map((b) => (
              <button key={b} onClick={() => setAccBody(accBody === b ? null : b)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  accBody === b ? "bg-deepblue text-white shadow-soft" : "border border-silver bg-surface text-navy hover:-translate-y-0.5 hover:shadow-soft"
                }`}>
                {ACCREDITATION_INFO[b].name}
              </button>
            ))}
          </div>

          {accBody && accReport && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 space-y-4">
              <div className="rounded-xl bg-surface p-4">
                <p className="text-xs font-semibold text-deepblue">{ACCREDITATION_INFO[accBody].name}</p>
                <p className="mt-1 text-xs text-muted">{ACCREDITATION_INFO[accBody].description}</p>
              </div>
              {accReport.map((section) => (
                <div key={section.number} className="rounded-xl border border-silver bg-white p-4">
                  <p className="text-sm font-semibold text-navy">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-deepblue/10 text-xs font-bold text-deepblue">
                      {section.number}
                    </span>
                    {section.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{section.content}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={() => {
                  const html = `<!DOCTYPE html><html><head><title>${ACCREDITATION_INFO[accBody].name} Report</title><style>body{font-family:system-ui;max-width:800px;margin:40px auto;padding:0 20px;color:#1F2937}h1{color:#0F2557}h2{color:#1E3A8A;border-bottom:2px solid #E5E7EB;padding-bottom:6px;margin-top:24px}.section{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin:12px 0}</style></head><body><h1>${ACCREDITATION_INFO[accBody].name} Compliance Report</h1><p>Generated ${new Date().toLocaleString()} · Based on ${history.length} AI analyses</p>${accReport.map((s) => `<h2>${s.number}. ${s.title}</h2><div class="section"><p>${s.content}</p></div>`).join("")}</body></html>`;
                  const w = window.open("", "_blank");
                  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
                }} className="inline-flex items-center gap-1.5 rounded-full border border-silver bg-white px-4 py-2 text-xs font-medium text-navy transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <Download size={13} /> Export as PDF
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
