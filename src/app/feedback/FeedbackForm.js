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
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-bold">Leave your Feedback</h2>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <Star
                fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                className="h-8 w-8 text-yellow-400"
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        ></textarea>
        <button
          type="submit"
          className="w-full rounded-lg bg-gray-900 p-2 text-white hover:bg-gray-600"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
