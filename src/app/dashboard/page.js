"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getUserData, getExams,handleStartExam } from "../../../utils/firefunction";
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Top Header */}
      <div className="w-full flex justify-between p-4 bg-gray-800 text-white fixed top-0 left-0 z-10">
        <h2 className="text-lg font-semibold flex items-center">Welcome, {userData.name || "User"}!</h2>
        <button
          onClick={handleSignOut}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-20 w-full max-w-3xl px-4 pb-4 overflow-y-auto no-scrollbar">
        <h2 className="text-2xl font-semibold mb-5">Your Exams</h2>

        {examData ? (
          <div className="space-y-4">
            {/* Current Exams with Start Button */}
            <ExamSection
              title="Current"
              exams={examData.filter((exam) => {
                const currentTime = new Date();
                return exam.date <= currentTime && currentTime <= exam.endDate;
              })}
              renderAction={(exam) => (
                <button
                  onClick={() => handleStartExam(exam, userData,router)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Start
                </button>
              )}
            />

            {/* Upcoming Exams */}
            <ExamSection
              title="Upcoming"
              exams={examData.filter((exam) => exam.date > new Date())}
            />

            {/* Previous Exams */}
            <ExamSection
              title="Previous"
              exams={examData.filter((exam) => exam.endDate < new Date())}
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
