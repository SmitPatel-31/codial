"use client";
import React from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(109,40,217,0.2),transparent_36%)]"
        aria-hidden="true"
      />

      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-900/40">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-indigo-200">
                Admin
              </p>
              <h1 className="text-xl font-bold text-white">Control center</h1>
            </div>
          </div>
          <div className="text-sm text-slate-300">Welcome</div>
        </div>
      </nav>

      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col items-center justify-center px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-black text-white sm:text-5xl">Admin dashboard</h2>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            Choose an action to manage exams and questions.
          </p>
        </div>

        <div className="mt-12 grid w-full gap-6 md:grid-cols-2">
          <button
            className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-left shadow-xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-indigo-400/40"
            onClick={() => handleNavigation("/admin/get-marks")}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-900/40">
              <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">Get marks</h3>
            <p className="mt-2 text-sm text-slate-400">
              View and manage student marks, grades, and exam insights.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-indigo-200 transition group-hover:translate-x-1">
              <span className="font-semibold">Access now</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>

          <button
            className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-left shadow-xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-purple-400/40"
            onClick={() => handleNavigation("/admin/set-question")}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-900/40">
              <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">Set questions</h3>
            <p className="mt-2 text-sm text-slate-400">
              Create coding tests, configure templates, and publish schedules.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-purple-200 transition group-hover:translate-x-1">
              <span className="font-semibold">Access now</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
