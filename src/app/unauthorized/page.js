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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md text-center">
        <div className="mx-auto mb-6 w-16 h-16 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="w-16 h-16 mx-auto"
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
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;