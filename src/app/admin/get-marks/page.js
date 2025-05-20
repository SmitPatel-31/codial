// pages/exams/index.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExams } from "../../../../utils/firefunction";
const ExamList = () => {
  const [exams, setExams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExams();
       console.log("Fetched Exams:", data);
      setExams(data);
    };
    fetchData();
  }, []);

  
  const formatDate = (dateObj) => {
    if (!(dateObj instanceof Date)) return "Invalid date";
    return dateObj.toLocaleString(); // Or use toLocaleDateString() for just date
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Exams</h1>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Start Date</th>
            <th className="border px-4 py-2">End Date</th>
            <th className="border px-4 py-2">Joined Count</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{exam.name}</td>
              <td className="border px-4 py-2">{formatDate(exam.date)}</td>
              <td className="border px-4 py-2">{formatDate(exam.endDate)}</td>
              <td className="border px-4 py-2">{exam.joined?.length || 0}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-2 py-1 rounded cursor-pointer transition transform active:scale-95"
                  onClick={() => router.push(`/admin/${exam.id}/exam-data/${exam.name}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
          {exams.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No exams found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExamList;
