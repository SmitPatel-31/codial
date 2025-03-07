"use client";

import { useRouter, usePathname,useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; // Import Firebase auth
import { useSearchParams } from 'next/navigation'

const ExamPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
 
  const session = searchParams.get('session') 
  const pathname = usePathname(); // Get the current URL path
  const examId = pathname.split("/").pop(); // Extract exam ID
  const [user, setUser] = useState(null);

  useEffect(() => {
   
    // Check authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Ensure session is available before running the logic
    const sessionParam = new URLSearchParams(window.location.search).get("session");

    const allowedExamId = sessionStorage.getItem("allowedExamId");
    const sessionId = sessionStorage.getItem("sessionKey");

    // Early return if either session or allowedExamId is not set
    // if (!allowedExamId || !sessionId || !sessionParam) {
    //   return;
    // }

    console.log("Allowed Exam ID:", allowedExamId);
    console.log("Exam ID:", examId);
    console.log("Session ID:", sessionId);
    console.log("Session Param:", sessionParam);

    if (allowedExamId === examId && sessionId === sessionParam) {
      // Session is valid, remove session data
      sessionStorage.removeItem("allowedExamId");
      sessionStorage.removeItem("sessionKey");
    } else {
      // Session is invalid, redirect to dashboard
      alert("You are not authorized to access this exam!");
      router.push("/dashboard");
    }
  }, [examId, session, router]); // Only run when examId, session or router changes


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="exam-container">
      <h1>Exam {examId}</h1>
      <p>Welcome to the exam page.</p>
      {/* Your exam content here */}
    </div>
  );
};

export default ExamPage;
