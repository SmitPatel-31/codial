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
  const [selectedFilter, setSelectedFilter] = useState('all');

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
    let filtered = result.filter(
      (r) =>
        r.name?.toLowerCase().includes(query) ||
        String(r.userId).toLowerCase().includes(query)
    );

    if (selectedFilter === 'passed') {
      filtered = filtered.filter(r => r.passed);
    } else if (selectedFilter === 'failed') {
      filtered = filtered.filter(r => !r.passed);
    } else if (selectedFilter === 'cheating') {
      filtered = filtered.filter(r => r.exitedFullscreen || r.tabSwitchCount > 5);
    }

    return filtered;
  }, [searchQuery, result, selectedFilter]);

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

  const getCheatingRisk = (exitedFullscreen, tabSwitchCount) => {
    if (exitedFullscreen || tabSwitchCount > 10) return { level: 'High', color: 'bg-red-100 text-red-800' };
    if (tabSwitchCount > 5) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Low', color: 'bg-green-100 text-green-800' };
  };

  const getScoreColor = (score) => {
    if (score >= 50) return 'text-green-600 bg-green-50';
    if (score >= 30) return 'text-blue-600 bg-blue-50';
    if (score >= 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusBadge = (passed) => {
    return passed 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };


  
  return (
    // <div className="p-6 max-w-7xl mx-auto">
    //   <div className="mb-8 flex justify-between items-center">
    //     <div>
    //       <h1 className="text-3xl font-semibold text-gray-900 mb-1">
    //         Exam Analysis
    //       </h1>
    //       <p className="text-gray-500">Exam: {examName}</p>
    //     </div>
    //     <button
    //       onClick={handleDownloadPDF}
    //       className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition cursor-pointer"
    //     >
    //       Download PDF
    //     </button>
    //   </div>

    //   {/* Search */}
    //   <div className="mb-6">
    //     <input
    //       type="text"
    //       placeholder="Search by name or user ID..."
    //       value={searchQuery}
    //       onChange={(e) => setSearchQuery(e.target.value)}
    //       className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //     />
    //   </div>

    //   {/* Statistics */}
    //   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    //     <div className="bg-white border rounded-lg p-4 shadow-sm">
    //       <h4 className="text-sm text-gray-500">Average Score</h4>
    //       <p className="text-xl font-bold text-gray-900">{stats.avg.toFixed(2)}</p>
    //     </div>
    //     <div className="bg-white border rounded-lg p-4 shadow-sm">
    //       <h4 className="text-sm text-gray-500">Median Score</h4>
    //       <p className="text-xl font-bold text-gray-900">{stats.median}</p>
    //     </div>
    //     <div className="bg-white border rounded-lg p-4 shadow-sm">
    //       <h4 className="text-sm text-gray-500">Mode Score</h4>
    //       <p className="text-xl font-bold text-gray-900">{stats.mode}</p>
    //     </div>
    //   </div>

    //   {/* Results List */}
    //   <div className="space-y-6">
    //     {filteredResults.map((r, idx) => (
    //       <div
    //         key={idx}
    //         className="border rounded-lg shadow-sm bg-white p-6 transition hover:shadow-md"
    //       >
    //         <div className="flex justify-between flex-wrap gap-4">
    //           <div>
    //             <p className="text-lg font-medium text-gray-900">{r.name}</p>
    //             <p className="text-sm text-gray-500">{r.email}</p>
    //             <p className="text-sm text-gray-400">ID: {r.userId}</p>
    //           </div>
    //           <div className="text-sm text-gray-700 space-y-1 text-right">
    //             <p>
    //               <strong>Score:</strong> {r.score}
    //             </p>
    //             <p>
    //               <strong>Status:</strong> {r.passed ? "Passed" : "Failed"}
    //             </p>
    //             <p>
    //               <strong>Submitted:</strong>{" "}
    //               {new Date(r.date?.toDate?.() ?? r.date).toLocaleString()}
    //             </p>
    //           </div>
    //         </div>
    //         {/* Cheating Info */}
    //         <div className="mt-4 text-sm bg-gray-50 rounded-md p-4 space-y-1">
    //           <p>
    //             <strong>Exited Fullscreen:</strong>{" "}
    //             {r.exitedFullscreen ? "Yes" : "No"}
    //           </p>
    //           <p>
    //             <strong>Tab Switch Count:</strong> {r.tabSwitchCount}
    //           </p>
    //           {r.tabSwitchLogs?.length > 0 && (
    //             <details className="mt-2">
    //               <summary className="text-blue-600 cursor-pointer">
    //                 View tab switch logs
    //               </summary>
    //               <ul className="list-disc ml-5 mt-1 text-gray-600">
    //                 {r.tabSwitchLogs.map((log, i) => (
    //                   <li key={i}>
    //                     {log.type} at {new Date(log.time).toLocaleString()}
    //                   </li>
    //                 ))}
    //               </ul>
    //             </details>
    //           )}
    //         </div>
    //         {/* Code Toggle */}
    //         <div className="mt-4">
    //           <button
    //             onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
    //             className="text-indigo-600 hover:underline focus:outline-none cursor-pointer"
    //           >
    //             {openIndex === idx ? "Hide Code" : "View Code"}
    //           </button>
    //           {openIndex === idx && (
    //             <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
    //               {r.code}
    //             </pre>
    //           )}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>


    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Exam Analysis</h1>
                <p className="text-gray-600 mt-1">Comprehensive results for: <span className="font-semibold">{examName}</span></p>
              </div>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avg.toFixed(1)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Median Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.median}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Mode Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.mode}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-lg p-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{result.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Students', icon: '👥' },
                { key: 'passed', label: 'Passed', icon: '✅' },
                { key: 'failed', label: 'Failed', icon: '❌' },
                { key: 'cheating', label: 'High Risk', icon: '⚠️' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    selectedFilter === filter.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          {filteredResults.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            filteredResults.map((r, idx) => {
              const cheatingRisk = getCheatingRisk(r.exitedFullscreen, r.tabSwitchCount);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {r.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{r.name}</h3>
                        <p className="text-gray-600">{r.email}</p>
                        <p className="text-sm text-gray-500">ID: {r.userId}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end space-y-2 mt-4 md:mt-0">
                      <div className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(r.score)}`}>
                        Score: {r.score}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(r.passed)}`}>
                        {r.passed ? '✅ Passed' : '❌ Failed'}
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-gray-700">Submission Time</span>
                      </div>
                      <p className="text-gray-900">
                        {new Date(r.date?.toDate?.() ?? r.date).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="font-semibold text-gray-700">Cheating Risk</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cheatingRisk.color}`}>
                        {cheatingRisk.level}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-semibold text-gray-700">Tab Switches</span>
                      </div>
                      <p className="text-gray-900">{r.tabSwitchCount} times</p>
                    </div>
                  </div>

                  {/* Security Details */}
                  <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Security Monitoring
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-red-700">Fullscreen Exited:</span>
                        <span className={`font-medium ${r.exitedFullscreen ? 'text-red-600' : 'text-green-600'}`}>
                          {r.exitedFullscreen ? 'Yes ⚠️' : 'No ✅'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-700">Tab Switch Count:</span>
                        <span className={`font-medium ${r.tabSwitchCount > 5 ? 'text-red-600' : 'text-green-600'}`}>
                          {r.tabSwitchCount} {r.tabSwitchCount > 5 ? '⚠️' : '✅'}
                        </span>
                      </div>
                    </div>
                    
                    {r.tabSwitchLogs?.length > 0 && (
                      <details className="mt-3">
                        <summary className="text-red-700 cursor-pointer hover:text-red-800 font-medium">
                          View detailed logs ({r.tabSwitchLogs.length} events)
                        </summary>
                        <div className="mt-2 bg-white rounded-lg p-3 border border-red-200">
                          <ul className="space-y-1">
                            {r.tabSwitchLogs.map((log, i) => (
                              <li key={i} className="flex justify-between text-sm">
                                <span className="font-medium text-red-700">{log.type}</span>
                                <span className="text-gray-600">{new Date(log.time).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    )}
                  </div>

                  {/* Code Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      <svg className={`w-5 h-5 transform transition-transform ${openIndex === idx ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{openIndex === idx ? 'Hide Code' : 'View Submitted Code'}</span>
                    </button>
                    
                    {openIndex === idx && (
                      <div className="mt-4 bg-gray-900 rounded-xl p-4 overflow-x-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-gray-400 text-sm">Submitted Code</span>
                        </div>
                        <pre className="text-green-400 text-sm font-mono leading-relaxed overflow-x-auto">
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


