"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

const UnauthorizedPage = () => {
  const router = useRouter();
  const [isValidAccess, setIsValidAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return; // Prevent double execution
    hasChecked.current = true;

    const wasRedirected = sessionStorage.getItem('unauthorizedRedirect');
    console.log('wasRedirected:', wasRedirected);
    
    if (wasRedirected === 'true') {
      sessionStorage.removeItem('unauthorizedRedirect');
      setIsValidAccess(true);
    } else {
      router.push("/");
      return;
    }
    
    setLoading(false);
  }, [router]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isValidAccess) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(248,113,113,0.18),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(109,40,217,0.2),transparent_36%)]"
        aria-hidden="true"
      />
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-2xl shadow-red-900/30 backdrop-blur">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="h-10 w-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11c.552 0 1-.448 1-1V7a1 1 0 10-2 0v3c0 .552.448 1 1 1z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 8v6a7 7 0 0014 0V8a7 7 0 00-14 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-white">Access denied</h1>
        <p className="mt-3 text-sm text-slate-400">
          You do not have permission to access this page. If you believe this is an error, please contact an administrator.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.01] hover:from-indigo-600 hover:via-purple-600 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Go home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
