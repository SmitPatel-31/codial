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

  
  const toDate = (value) => (value?.seconds ? new Date(value.seconds * 1000) : new Date(value));

  const formatDate = (value) => {
    const dateObj = toDate(value);
    return Number.isNaN(dateObj.getTime()) ? "Invalid date" : dateObj.toLocaleString();
  };
  
  const getExamStatus = (startDate, endDate) => {
    const start = toDate(startDate);
    const end = toDate(endDate);
    const now = new Date();
    if (now < start) {
      return { status: 'upcoming', color: 'bg-amber-500/15 text-amber-100 border border-amber-500/40', text: 'Upcoming' };
    } else if (now >= start && now <= end) {
      return { status: 'active', color: 'bg-emerald-500/15 text-emerald-100 border border-emerald-500/40', text: 'Active' };
    } else {
      return { status: 'completed', color: 'bg-slate-500/20 text-slate-100 border border-slate-600/50', text: 'Completed' };
    }
  };
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(109,40,217,0.2),transparent_36%)]"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
              Admin / Exams
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white">All exams</h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage schedules, monitor participants, and open exam details.
            </p>
          </div>
          <div className="hidden rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300 shadow-lg shadow-slate-950/30 md:block">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Snapshot</div>
            <div className="mt-1 font-semibold text-white">{exams.length} total exams</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total exams</p>
            <div className="mt-2 text-3xl font-bold text-white">{exams.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total students</p>
            <div className="mt-2 text-3xl font-bold text-emerald-300">
              {exams.reduce((total, exam) => total + (exam.joined?.length || 0), 0)}
            </div>
          </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active exams</p>
              <div className="mt-2 text-3xl font-bold text-amber-200">
                {exams.filter((exam) => {
                  const now = new Date();
                return now >= toDate(exam.date) && now <= toDate(exam.endDate);
              }).length}
              </div>
            </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-slate-950/30">
          {exams.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800">
                <svg className="h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">No exams found</h3>
              <p className="text-slate-400">There are no exams to display at the moment.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead className="bg-slate-900/60">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                        Exam name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                        Schedule
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                        Participants
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {exams.map((exam, index) => {
                      const examStatus = getExamStatus(exam.date, exam.endDate);
                      return (
                        <tr key={index} className="hover:bg-slate-900/70 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-bold text-white">
                                {exam.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{exam.name}</div>
                                <div className="text-sm text-slate-500">ID: {exam.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            <div className="font-medium">Start: {formatDate(exam.date)}</div>
                            <div className="text-slate-500">End: {formatDate(exam.endDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${examStatus.color}`}>
                              {examStatus.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                              </div>
                              <div className="ml-3 text-sm font-medium text-white">
                                {exam.joined?.length || 0} students
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-white shadow-lg shadow-indigo-900/40 transition hover:translate-y-[-1px] hover:from-indigo-600 hover:to-indigo-700"
                              onClick={() => router.push(`/admin/${exam.id}/exam-data/${exam.name}`)}
                            >
                              <span>View details</span>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 p-4 md:hidden">
                {exams.map((exam, index) => {
                  const examStatus = getExamStatus(exam.date, exam.endDate);
                  return (
                    <div key={index} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/30">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-bold text-white">
                            {exam.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{exam.name}</h3>
                            <p className="text-sm text-slate-500">ID: {exam.id}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${examStatus.color}`}>
                          {examStatus.text}
                        </span>
                      </div>

                      <div className="mb-4 space-y-2 text-sm text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Start:</span>
                          <span>{formatDate(exam.date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">End:</span>
                          <span>{formatDate(exam.endDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Participants:</span>
                          <span>{exam.joined?.length || 0} students</span>
                        </div>
                      </div>

                      <button
                        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-white shadow-lg shadow-indigo-900/40 transition hover:translate-y-[-1px] hover:from-indigo-600 hover:to-indigo-700"
                        onClick={() => router.push(`/admin/${exam.id}/exam-data/${exam.name}`)}
                      >
                        <span>View details</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamList;
