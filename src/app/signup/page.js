"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app, auth, db } from "../firebase";
import { motion } from "framer-motion";


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nuId, setNuId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState(null);  // New email error state
  const [name, setName] = useState("");
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
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(109,40,217,0.2),transparent_36%)]"
        aria-hidden="true"
      />

      <div className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-indigo-200">
            Join the workspace
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Register with your Northeastern email to access exams and dashboards.
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-7 shadow-2xl shadow-indigo-900/30 backdrop-blur"
        >
          <div className="text-left">
            <label className="text-sm font-semibold text-slate-200">NU ID</label>
            <input
              type="text"
              placeholder="Enter your NU ID"
              value={nuId}
              onChange={(e) => setNuId(e.target.value)}
              pattern="[0-9]{9}"
              maxLength="9"
              minLength="9"
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
              required
            />
          </div>
          <div className="text-left">
            <label className="text-sm font-semibold text-slate-200">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
              required
            />
          </div>
          <div className="text-left">
            <label className="text-sm font-semibold text-slate-200">Email</label>
            <input
              type="email"
              placeholder="you@northeastern.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern=".*@northeastern\.edu$"
              title="Please enter a valid @northeastern.edu email address"
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
              required
            />
            {emailError && <p className="text-sm text-amber-300">{emailError}</p>}
          </div>
          <div className="text-left">
            <label className="text-sm font-semibold text-slate-200">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
              required
            />
          </div>
          <div className="text-left">
            <label className="text-sm font-semibold text-slate-200">Confirm password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.01] hover:from-indigo-600 hover:via-purple-600 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Sign up
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && (
            <p className="text-sm text-emerald-300">Account created successfully! Redirecting...</p>
          )}
        </form>

        <div className="mt-4 text-center text-sm text-slate-400">
          <span>Already have an account? </span>
          <a href="/login" className="font-semibold text-indigo-200 hover:text-indigo-100">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
