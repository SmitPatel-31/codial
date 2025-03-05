"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getUserData, getExams } from "../../../utils/firefunction";
import ExamSection from "./examSection";
const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Store user data
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [examData, setExamData] = useState(null);
  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      if (user) {
        setUser(user); // Set user data
        console.log(user);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Prevent rendering if user is not authenticated
  }

  return (
<div className="flex flex-col items-center min-h-screen">
      {/* Top Header with User Info */}
      <div className="w-full flex justify-between p-4 bg-gray-800 text-white fixed top-0 left-0 z-10">
        <h2 className="text-lg font-semibold" style={{display: "flex", alignItems: "center"}}>Welcome, {userData.name || "User"}!</h2>
        <button
          onClick={handleSignOut}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-20 w-full max-w-3xl px-4 pb-4 overflow-y-auto no-scrollbar">
        <h2 className="text-2xl font-semibold" style={{ marginBottom: "20px" }}>Your Exams</h2>

        {examData ? (
          <div className="space-y-4">
            {/* Current Exams */}
            <ExamSection
              title="Current"
              exams={examData.filter((exam) => {
                const currentTime = new Date(); // Get the current time
                return exam.date <= currentTime && currentTime <= exam.endDate;
              })}
            />

            {/* Upcoming Exams */}
            <ExamSection
              title="Upcoming"
              exams={examData.filter((exam) => {
                const currentTime = new Date();
                return exam.date > currentTime;
              })}
            />

            {/* Previous Exams */}
            <ExamSection
              title="Previous"
              exams={examData.filter((exam) => {
                const currentTime = new Date();
                return exam.endDate < currentTime;
              })}
            />
          </div>
        ) : (
          <p>Loading exams...</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;