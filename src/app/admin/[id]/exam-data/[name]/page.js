"use client";
import React, { useEffect, useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { usePathname } from "next/navigation";
import { getStudentExamResult } from "../../../../../../utils/firefunction";
import ExamResultPDF from "./examreport";

const calculateStats = (scores) => {
  if (scores.length === 0) return { avg: 0, median: 0, mode: 0 };
  const sum = scores.reduce((a, b) => a + b, 0);
  const avg = sum / scores.length;
  const sorted = [...scores].sort((a, b) => a - b);
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
  const freq = {};
  for (const score of scores) freq[score] = (freq[score] || 0) + 1;
  const mode = Object.keys(freq).reduce((a, b) => (freq[+a] > freq[+b] ? a : b));
  return { avg, median, mode: Number(mode) };
};

const getCheatingRisk = (exitedFullscreen, tabSwitchCount) => {
  if (exitedFullscreen || tabSwitchCount > 10) {
    return { level: "High", color: "bg-rose-500/15 text-rose-100 border border-rose-500/40" };
  }
  if (tabSwitchCount > 5) {
    return { level: "Medium", color: "bg-amber-500/15 text-amber-100 border border-amber-500/40" };
  }
  return { level: "Low", color: "bg-emerald-500/15 text-emerald-100 border border-emerald-500/40" };
};

const getScoreColor = (score) => {
  if (score >= 50) return "text-emerald-200 bg-emerald-500/15 border border-emerald-500/40";
  if (score >= 30) return "text-sky-200 bg-sky-500/15 border border-sky-500/40";
  if (score >= 20) return "text-amber-200 bg-amber-500/15 border border-amber-500/40";
  return "text-rose-200 bg-rose-500/15 border border-rose-500/40";
};

const getStatusBadge = (passed) =>
  passed
    ? "bg-emerald-500/15 text-emerald-100 border border-emerald-500/40"
    : "bg-rose-500/15 text-rose-100 border border-rose-500/40";

export default function ExamAnalysis() {
  const pathname = usePathname();
  const [result, setResult] = useState([]);
  const [stats, setStats] = useState({ avg: 0, median: 0, mode: 0 });
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const parts = pathname.split("/");
  const examId = parts[2];
  const examName = decodeURIComponent(parts[4]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStudentExamResult(examId);
      setResult(data);
      const scores = data.map((entry) => entry.score);
      setStats(calculateStats(scores));
    };
    fetchData();
  }, [examId]);

  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let filtered = result.filter(
      (r) =>
        r.name?.toLowerCase().includes(query) || String(r.userId).toLowerCase().includes(query),
    );

    if (selectedFilter === "passed") {
      filtered = filtered.filter((r) => r.passed);
    } else if (selectedFilter === "failed") {
      filtered = filtered.filter((r) => !r.passed);
    } else if (selectedFilter === "cheating") {
      filtered = filtered.filter((r) => r.exitedFullscreen || r.tabSwitchCount > 5);
    }

    return filtered;
  }, [searchQuery, result, selectedFilter]);

  const handleDownloadPDF = async () => {
    const filePath = `Exam_Analysis_${examName.replace(/\s+/g, "_")}.pdf`;
    const blob = await pdf(
      <ExamResultPDF examName={examName} stats={stats} results={filteredResults} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filePath;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(109,40,217,0.2),transparent_36%)]"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-900/40">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                Admin / Analysis
              </p>
              <h1 className="text-4xl font-bold text-white">Exam analysis</h1>
              <p className="text-sm text-slate-400">
                Comprehensive results for <span className="font-semibold text-slate-100">{examName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:-translate-y-[1px] hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download PDF</span>
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: "Average score", value: stats.avg.toFixed(1), accent: "from-indigo-500 to-sky-500" },
            { label: "Median score", value: stats.median, accent: "from-emerald-500 to-teal-500" },
            { label: "Mode score", value: stats.mode, accent: "from-purple-500 to-pink-500" },
            { label: "Total students", value: result.length, accent: "from-amber-500 to-orange-500" },
          ].map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${card.accent} text-white`}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-10 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All students" },
                { key: "passed", label: "Passed" },
                { key: "failed", label: "Failed" },
                { key: "cheating", label: "High risk" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    selectedFilter === filter.key
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-900/40"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredResults.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-12 text-center shadow-lg shadow-slate-950/30">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800">
                <svg className="h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No results found</h3>
              <p className="text-slate-400">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            filteredResults.map((r, idx) => {
              const cheatingRisk = getCheatingRisk(r.exitedFullscreen, r.tabSwitchCount);
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-indigo-400/30"
                >
                  <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-lg font-bold text-white">
                        {r.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{r.name}</h3>
                        <p className="text-slate-400">{r.email}</p>
                        <p className="text-xs text-slate-500">ID: {r.userId}</p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col space-y-2 md:items-end">
                      <div
                        className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-lg font-bold ${getScoreColor(
                          r.score,
                        )}`}
                      >
                        Score: {r.score}
                      </div>
                      <div
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadge(
                          r.passed,
                        )}`}
                      >
                        {r.passed ? "Passed" : "Failed"}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                      <div className="mb-2 flex items-center space-x-2">
                        <svg className="h-5 w-5 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-slate-200">Submission time</span>
                      </div>
                      <p className="text-slate-100">
                        {new Date(r.date?.toDate?.() ?? r.date).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                      <div className="mb-2 flex items-center space-x-2">
                        <svg className="h-5 w-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="font-semibold text-slate-200">Cheating risk</span>
                      </div>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${cheatingRisk.color}`}>
                        {cheatingRisk.level}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                      <div className="mb-2 flex items-center space-x-2">
                        <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-semibold text-slate-200">Tab switches</span>
                      </div>
                      <p className="text-slate-100">{r.tabSwitchCount} times</p>
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl border border-rose-800/40 bg-rose-500/10 p-4">
                    <h4 className="mb-3 flex items-center font-semibold text-rose-100">
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Security monitoring
                    </h4>
                    <div className="grid grid-cols-1 gap-3 text-sm text-rose-50 md:grid-cols-2">
                      <div className="flex justify-between">
                        <span>Fullscreen exited:</span>
                        <span
                          className={`font-semibold ${
                            r.exitedFullscreen ? "text-rose-100" : "text-emerald-100"
                          }`}
                        >
                          {r.exitedFullscreen ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tab switch count:</span>
                        <span
                          className={`font-semibold ${
                            r.tabSwitchCount > 5 ? "text-rose-100" : "text-emerald-100"
                          }`}
                        >
                          {r.tabSwitchCount}
                        </span>
                      </div>
                    </div>

                    {r.tabSwitchLogs?.length > 0 && (
                      <details className="mt-3 text-slate-200">
                        <summary className="cursor-pointer text-sm font-semibold text-rose-100 hover:text-rose-50">
                          View detailed logs ({r.tabSwitchLogs.length} events)
                        </summary>
                        <div className="mt-2 rounded-lg border border-rose-800/40 bg-slate-950/60 p-3">
                          <ul className="space-y-1 text-xs text-slate-200">
                            {r.tabSwitchLogs.map((log, i) => (
                              <li key={i} className="flex justify-between">
                                <span className="font-medium text-rose-100">{log.type}</span>
                                <span className="text-slate-400">{new Date(log.time).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-4">
                    <button
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                      className="flex items-center space-x-2 text-indigo-200 transition hover:text-indigo-100"
                    >
                      <svg
                        className={`h-5 w-5 transition-transform ${openIndex === idx ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{openIndex === idx ? "Hide code" : "View submitted code"}</span>
                    </button>

                    {openIndex === idx && (
                      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                            <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                          </div>
                          <span className="text-sm text-slate-500">Submitted code</span>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-emerald-200">
                          {r.code}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
