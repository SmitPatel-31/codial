"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const examData = searchParams.get("examData");
  const user = searchParams.get("user");

  useEffect(() => {
    console.log("Received exam data:", { examData, user });
  }, [examData, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ rating, comment });
    alert("Thank you for your feedback!");
    setRating(0);
    setHoverRating(0);
    setComment("");
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(109,40,217,0.2),transparent_36%)]"
        aria-hidden="true"
      />
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-lg flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-indigo-900/30 backdrop-blur"
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
            Feedback
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Share your experience</h2>
          <p className="mt-2 text-sm text-slate-400">Tell us how the exam experience felt.</p>
        </div>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition hover:scale-105"
            >
              <Star
                fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                className="h-8 w-8 text-amber-300"
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What worked well? What could be better?"
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
          rows={4}
          required
        ></textarea>
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.01] hover:from-indigo-600 hover:via-purple-600 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Submit feedback
        </button>
      </form>
    </div>
  );
}
