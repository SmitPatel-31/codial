"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app, auth,db } from "../firebase";
import { motion } from "framer-motion";


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nuId, setNuId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState(null);  // New email error state
  const [name , setName] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setEmailError(null);  // Reset email error on form submission

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        nuId: nuId,
        uid: user.uid,
        name: name,
      });

      setSuccess(true);
      router.push("/login"); // Redirect to signin page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Create your account</h2>
      <form onSubmit={handleSignup} className="space-y-5">
        <div className="text-left">
          <label className="text-sm font-semibold text-gray-700">NU ID</label>
          <input
            type="text"
            placeholder="Enter your NU ID"
            value={nuId}
            onChange={(e) => setNuId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="text-left">
          <label className="text-sm font-semibold text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="text-left">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>} {/* Display email error */}
        </div>
        <div className="text-left">
          <label className="text-sm font-semibold text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="text-left">
          <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition font-semibold text-lg"
        >
          Sign up
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm mt-2">Account created successfully! Redirecting...</p>
        )}
      </form>

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;