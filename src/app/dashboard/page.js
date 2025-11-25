"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getUserData, getExams, handleStartExam } from "../../../utils/firefunction";
import ExamSection from "./examSection";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setUserData(await getUserData(user.uid));
        setExamData(await getExams());
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const normalizeDate = (value) => (value?.seconds ? new Date(value.seconds * 1000) : new Date(value));

  const now = new Date();
  const exams = examData || [];
  const currentExams = exams.filter((exam) => {
    const start = normalizeDate(exam.date);
    const end = normalizeDate(exam.endDate);
    return start <= now && now <= end;
  });
  const upcomingExams = exams.filter((exam) => normalizeDate(exam.date) > now);
  const previousExams = exams.filter((exam) => normalizeDate(exam.endDate) < now);

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(109,40,217,0.2),transparent_36%)]"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-indigo-200">
              Dashboard
            </p>
            <h2 className="text-xl font-bold text-white">
              Welcome, {userData?.name || "User"}!
            </h2>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/40 transition hover:-translate-y-[1px] hover:border-indigo-400/40 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-300">{currentExams.length}</span>
              <span className="text-sm text-slate-400">in progress</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Upcoming</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-200">{upcomingExams.length}</span>
              <span className="text-sm text-slate-400">scheduled</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Completed</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-200">{previousExams.length}</span>
              <span className="text-sm text-slate-400">past exams</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                Your exams
              </p>
              <h3 className="text-2xl font-semibold text-white">Stay on track</h3>
              <p className="text-sm text-slate-400">
                Launch current sessions or browse your schedule at a glance.
              </p>
            </div>
          </div>

          {loading && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-400">
              Loading exams...
            </div>
          )}

          {!loading && (
            <div className="space-y-8">
              <ExamSection
                title="Current"
                exams={currentExams}
                renderAction={(exam) => (
                  <button
                    onClick={() => handleStartExam(exam, userData, router)}
                    className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:translate-y-[-1px] hover:from-emerald-600 hover:to-sky-500"
                  >
                    Start now
                  </button>
                )}
              />

              <ExamSection title="Upcoming" exams={upcomingExams} />
              <ExamSection title="Previous" exams={previousExams} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
