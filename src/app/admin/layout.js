"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserData } from "../../../utils/firefunction"; 

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }
      try {
        const userData = await getUserData(firebaseUser.uid);
        
        if (userData?.admin === true) {
          setIsAdmin(true);
        } else {
          // Set flag before redirecting to unauthorized
          sessionStorage.setItem('unauthorizedRedirect', 'true');
          router.push("/unauthorized");
        }
      } catch (err) {
        console.error("Error checking admin role:", err);
        // Set flag before redirecting to unauthorized
        sessionStorage.setItem('unauthorizedRedirect', 'true');
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return null;
  return <>{children}</>;
}