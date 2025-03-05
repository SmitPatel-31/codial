"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check the authentication status of the user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is not logged in
        router.push("/login"); // Redirect to sign-in page
      }
      setLoading(false); // Once the check is done, stop loading
    });

    // Clean up the listener when component is unmounted
    return () => unsubscribe();
  }, [router]);

  // Show loading state while checking auth status
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, they are already redirected, so we can return null here
  if (!isAuthenticated) {
    return null; // No need to render the dashboard if the user is not authenticated
  }

  // Render the dashboard for authenticated users
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-5">Dashboard</h1>
      <button
        onClick={handleSignOut}
        className=" bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition font-semibold text-lg"
      >
        Sign Out
      </button>
    </div>
  );
};

const handleSignOut = async () => {
  try {
    await signOut(auth); // Sign out the user
    router.push("/login"); // Redirect to the Sign In page
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export default DashboardPage;
