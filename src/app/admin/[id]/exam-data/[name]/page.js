"use client"
import React from "react";
import ReactPDF,{
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { useEffect, useMemo, useState } from "react";
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
  const mode = Object.keys(freq).reduce((a, b) =>
    freq[+a] > freq[+b] ? a : b
  );
  return { avg, median, mode: Number(mode) };
};

// No custom font registration needed - using built-in fonts


export default function ExamAnalysis() {
  const pathname = usePathname();
  const [result, setResult] = useState([]);
  const [stats, setStats] = useState({ avg: 0, median: 0, mode: 0 });
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
  }, [pathname]);

  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return result.filter(
      (r) =>
        r.name?.toLowerCase().includes(query) ||
        String(r.userId).toLowerCase().includes(query)
    );
  }, [searchQuery, result]);

  // PDF Download handler
  const handleDownloadPDF = async () => {
    const filePath = `Exam_Analysis_${examName.replace(/\s+/g, "_")}.pdf`;
    const blob = await ReactPDF.pdf(
      <ExamResultPDF examName={examName} stats={stats} results={filteredResults} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filePath;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Exam Analysis
          </h1>
          <p className="text-gray-500">Exam: {examName}</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition cursor-pointer"
        >
          Download PDF
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or user ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h4 className="text-sm text-gray-500">Average Score</h4>
          <p className="text-xl font-bold text-gray-900">{stats.avg.toFixed(2)}</p>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h4 className="text-sm text-gray-500">Median Score</h4>
          <p className="text-xl font-bold text-gray-900">{stats.median}</p>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h4 className="text-sm text-gray-500">Mode Score</h4>
          <p className="text-xl font-bold text-gray-900">{stats.mode}</p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {filteredResults.map((r, idx) => (
          <div
            key={idx}
            className="border rounded-lg shadow-sm bg-white p-6 transition hover:shadow-md"
          >
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <p className="text-lg font-medium text-gray-900">{r.name}</p>
                <p className="text-sm text-gray-500">{r.email}</p>
                <p className="text-sm text-gray-400">ID: {r.userId}</p>
              </div>
              <div className="text-sm text-gray-700 space-y-1 text-right">
                <p>
                  <strong>Score:</strong> {r.score}
                </p>
                <p>
                  <strong>Status:</strong> {r.passed ? "Passed" : "Failed"}
                </p>
                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(r.date?.toDate?.() ?? r.date).toLocaleString()}
                </p>
              </div>
            </div>
            {/* Cheating Info */}
            <div className="mt-4 text-sm bg-gray-50 rounded-md p-4 space-y-1">
              <p>
                <strong>Exited Fullscreen:</strong>{" "}
                {r.exitedFullscreen ? "Yes" : "No"}
              </p>
              <p>
                <strong>Tab Switch Count:</strong> {r.tabSwitchCount}
              </p>
              {r.tabSwitchLogs?.length > 0 && (
                <details className="mt-2">
                  <summary className="text-blue-600 cursor-pointer">
                    View tab switch logs
                  </summary>
                  <ul className="list-disc ml-5 mt-1 text-gray-600">
                    {r.tabSwitchLogs.map((log, i) => (
                      <li key={i}>
                        {log.type} at {new Date(log.time).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
            {/* Code Toggle */}
            <div className="mt-4">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="text-indigo-600 hover:underline focus:outline-none cursor-pointer"
              >
                {openIndex === idx ? "Hide Code" : "View Code"}
              </button>
              {openIndex === idx && (
                <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
                  {r.code}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}