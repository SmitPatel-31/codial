"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export default function Home() {
  const [loading, setLoading] = useState(true);  // For managing loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        router.push("/dashboard"); 
      } else {
        setIsLoggedIn(false);
        setLoading(false);
        router.push("/login");
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [router]);

  // Show loading state while checking auth status
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show login screen if the user is not logged in
  
}
