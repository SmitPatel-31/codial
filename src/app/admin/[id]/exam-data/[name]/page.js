"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getStudentExamResult } from "../../../../../../utils/firefunction";
const calculateStats = (scores) => {
  if (scores.length === 0) return { avg: 0, mean: 0, median: 0, mode: 0 };

  const sum = scores.reduce((acc, val) => acc + val, 0);
  const avg = sum / scores.length;

  // Mean is same as avg here

  // Median
  const sorted = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];

  // Mode
  const freq = {};
  scores.forEach(score => {
    freq[score] = (freq[score] || 0) + 1;
  });

  let mode = scores[0];
  let maxFreq = 1;
  for (const [score, count] of Object.entries(freq)) {
    if (count > maxFreq) {
      maxFreq = count;
      mode = Number(score);
    }
  }

  return { avg, median, mode };
};

const ExamAnalysis = () => {
  const pathname = usePathname();
  const [result, setResult] = useState([]);
  const [stats, setStats] = useState({ avg: 0, median: 0, mode: 0 });
  const parts = pathname.split("/");
  const examId = parts[2];
  const examName = parts[4];
  useEffect(() => {
   
    const fetchData = async () => {
      const data = await getStudentExamResult(examId);
      setResult(data);

      const scores = data.map(entry => entry.score);
      const calculatedStats = calculateStats(scores);
      setStats(calculatedStats);
    };

    fetchData();
  }, [pathname]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exam Analysis</h1>

      <h3 className="text-lg font-semibold mb-2">
        Exam Name: {examName}
      </h3>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Statistics</h2>
        <p>Average: {stats.avg.toFixed(2)}</p>
        <p>Median: {stats.median}</p>
        <p>Mode: {stats.mode}</p>
      </div>

      <h2 className="text-lg font-semibold mb-2">Student Results</h2>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Score</th>
            <th className="border px-4 py-2">Passed</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {result.map((r, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{r.name}</td>
              <td className="border px-4 py-2">{r.email}</td>
              <td className="border px-4 py-2">{r.score}</td>
              <td className="border px-4 py-2">{r.passed}</td>
              <td className="border px-4 py-2">
                {new Date(r.date?.toDate?.() ?? r.date).toLocaleString()}
              </td>
            </tr>
          ))}
          {result.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExamAnalysis;
