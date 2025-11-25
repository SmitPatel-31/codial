"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language";
import { scala } from "@codemirror/legacy-modes/mode/clike";
import { basicDark } from "@uiw/codemirror-theme-basic";
import { createCodingTest } from "../../../../utils/firefunction";

const fieldClass =
  "w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/60 outline-none transition";

const cardClass =
  "rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-slate-950/30 backdrop-blur";

const getDefaultCodingTest = () => ({
  date: "",
  endDate: "",
  name: "",
});

const getDefaultExam = () => ({
  examName: "",
  title: "",
  description: "",
  input: "",
  output: "",
  constraints: ["", "", "", ""],
  examples: [
    { input: "", output: "" },
    { input: "", output: "" },
  ],
  problemId: "",
  javaTemplate: "",
  pythonTemplate: "",
  scalaTemplate: "",
  maxPoints: "",
  timeLimit: "",
  memoryLimit: "",
});

const CodingTestForm = () => {
  const [codingTest, setCodingTest] = useState(getDefaultCodingTest());
  const [exam, setExam] = useState(getDefaultExam());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodingTestChange = (event) => {
    setCodingTest({ ...codingTest, [event.target.name]: event.target.value });
  };

  const handleExamChange = (event) => {
    setExam({ ...exam, [event.target.name]: event.target.value });
  };

  const handleConstraintChange = (index, value) => {
    const nextConstraints = [...exam.constraints];
    nextConstraints[index] = value;
    setExam({ ...exam, constraints: nextConstraints });
  };

  const handleExampleChange = (index, field, value) => {
    const nextExamples = [...exam.examples];
    nextExamples[index] = { ...nextExamples[index], [field]: value };
    setExam({ ...exam, examples: nextExamples });
  };

  const normalizeTemplate = (value) =>
    value ? value.replace(/\r?\n/g, "\n") : "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const normalizedExam = {
      ...exam,
      examName: exam.examName || codingTest.name,
      javaTemplate: normalizeTemplate(exam.javaTemplate),
      pythonTemplate: normalizeTemplate(exam.pythonTemplate),
      scalaTemplate: normalizeTemplate(exam.scalaTemplate),
    };

    try {
      await createCodingTest(normalizedExam, codingTest);
      setCodingTest(getDefaultCodingTest());
      setExam(getDefaultExam());
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.15),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.12),transparent_32%)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-indigo-200">
              Admin / Assessments
            </p>
            <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">
              Build a coding test
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-300">
              Set the schedule, define the problem, and drop in starter code
              templates without leaving this page.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-sm text-slate-200 shadow-2xl shadow-indigo-900/30 sm:flex sm:flex-col sm:items-start">
            <p className="mb-1 text-xs uppercase tracking-[0.24em] text-indigo-200">
              Live preview
            </p>
            <div className="text-lg font-semibold text-white">
              {codingTest.name || "Untitled test"}
            </div>
            <p className="text-slate-400">
              {codingTest.date
                ? "Scheduled"
                : "Set dates and constraints below"}
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Schedule */}
          <section className={cardClass}>
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                  01 - Schedule
                </p>
                <h2 className="text-xl font-semibold text-white">
                  Test timing & name
                </h2>
                <p className="text-sm text-slate-400">
                  Keep candidates aligned with clear start and end windows.
                </p>
              </div>
              <div className="hidden rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 md:inline-flex">
                Auto-saves to draft
              </div>
            </div>
            <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Test name
                </label>
                <input
                  name="name"
                  value={codingTest.name}
                  onChange={handleCodingTestChange}
                  placeholder="e.g. Algorithms midterm - Fall cohort"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Start date & time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={codingTest.date}
                  onChange={handleCodingTestChange}
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  End date & time
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={codingTest.endDate}
                  onChange={handleCodingTestChange}
                  className={fieldClass}
                  required
                />
              </div>
            </div>
          </section>

          {/* Problem */}
          <section className={cardClass}>
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                  02 - Problem
                </p>
                <h2 className="text-xl font-semibold text-white">
                  Describe the challenge
                </h2>
                <p className="text-sm text-slate-400">
                  Clear framing helps candidates focus on what matters.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-xl bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-100 md:flex">
                <span className="h-2 w-2 rounded-full bg-indigo-300" />
                Required fields
              </div>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Problem title
                </label>
                <input
                  name="title"
                  value={exam.title}
                  onChange={handleExamChange}
                  placeholder="e.g. Two Sum with streaming input"
                  className={fieldClass}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Problem description
                  </label>
                  <textarea
                    name="description"
                    value={exam.description}
                    onChange={handleExamChange}
                    placeholder="Outline the task, expectations, and any domain notes candidates should know."
                    rows={4}
                    className={`${fieldClass} min-h-[140px]`}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Input description
                  </label>
                  <textarea
                    name="input"
                    value={exam.input}
                    onChange={handleExamChange}
                    placeholder="Explain the input format and constraints for each parameter."
                    rows={4}
                    className={`${fieldClass} min-h-[130px]`}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Output description
                  </label>
                  <textarea
                    name="output"
                    value={exam.output}
                    onChange={handleExamChange}
                    placeholder="Explain the expected output format and edge conditions."
                    rows={4}
                    className={`${fieldClass} min-h-[130px]`}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Problem ID
                  </label>
                  <input
                    name="problemId"
                    value={exam.problemId}
                    onChange={handleExamChange}
                    placeholder="e.g. PROB_001"
                    className={fieldClass}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Internal exam name
                  </label>
                  <input
                    name="examName"
                    value={exam.examName}
                    onChange={handleExamChange}
                    placeholder="Optional label visible to admins only"
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Constraints & Examples */}
          <section className={cardClass}>
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                  03 - Constraints & examples
                </p>
                <h2 className="text-xl font-semibold text-white">
                  Guardrails and sample cases
                </h2>
                <p className="text-sm text-slate-400">
                  Define the bounds and show candidates how their code is graded.
                </p>
              </div>
              <div className="hidden rounded-xl bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-100 md:block">
                Be specific & realistic
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                {exam.constraints.map((constraint, index) => (
                  <div key={index}>
                    <label className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-200">
                      <span>{`Constraint ${index + 1}`}</span>
                      <span className="text-xs font-medium text-slate-500">
                        Optional
                      </span>
                    </label>
                    <input
                      value={constraint}
                      onChange={(event) =>
                        handleConstraintChange(index, event.target.value)
                      }
                      placeholder="e.g. 1 <= n <= 10^5"
                      className={fieldClass}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {exam.examples.map((example, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-inner shadow-black/20"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-100">
                          {index + 1}
                        </span>
                        Example {index + 1}
                      </div>
                      <span className="text-xs text-slate-500">
                        Shown in problem statement
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Input
                        </label>
                        <textarea
                          value={example.input}
                          onChange={(event) =>
                            handleExampleChange(
                              index,
                              "input",
                              event.target.value,
                            )
                          }
                          placeholder="Sample input"
                          rows={3}
                          className={`${fieldClass} font-mono text-sm`}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Output
                        </label>
                        <textarea
                          value={example.output}
                          onChange={(event) =>
                            handleExampleChange(
                              index,
                              "output",
                              event.target.value,
                            )
                          }
                          placeholder="Expected output"
                          rows={3}
                          className={`${fieldClass} font-mono text-sm`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Templates */}
          <section className={cardClass}>
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                  04 - Starter code
                </p>
                <h2 className="text-xl font-semibold text-white">
                  Language templates
                </h2>
                <p className="text-sm text-slate-400">
                  Provide minimal scaffolding so candidates focus on the
                  algorithm, not boilerplate.
                </p>
              </div>
              <div className="hidden rounded-xl bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-100 md:block">
                Rendered in dark editor
              </div>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-white">
                      Java template
                    </label>
                    <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-100">
                      Java
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-800">
                    <CodeMirror
                      value={exam.javaTemplate}
                      height="200px"
                      extensions={[java()]}
                      theme={basicDark}
                      onChange={(value) =>
                        setExam((prev) => ({ ...prev, javaTemplate: value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-white">
                      Python template
                    </label>
                    <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-100">
                      Python
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-800">
                    <CodeMirror
                      value={exam.pythonTemplate}
                      height="200px"
                      extensions={[python()]}
                      theme={basicDark}
                      onChange={(value) =>
                        setExam((prev) => ({ ...prev, pythonTemplate: value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-white">
                    Scala template
                  </label>
                  <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                    Scala
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <CodeMirror
                    value={exam.scalaTemplate}
                    height="200px"
                    extensions={[StreamLanguage.define(scala)]}
                    theme={basicDark}
                    onChange={(value) =>
                      setExam((prev) => ({ ...prev, scalaTemplate: value }))
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Limits */}
          <section className={cardClass}>
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
                  05 - Limits & scoring
                </p>
                <h2 className="text-xl font-semibold text-white">
                  Keep runs predictable
                </h2>
                <p className="text-sm text-slate-400">
                  Define score weightings and runtime resource limits.
                </p>
              </div>
              <div className="hidden rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-100 md:block">
                Impacts grading
              </div>
            </div>

            <div className="grid gap-4 px-6 py-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Max points
                </label>
                <input
                  name="maxPoints"
                  type="number"
                  value={exam.maxPoints}
                  onChange={handleExamChange}
                  placeholder="100"
                  className={fieldClass}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Determines final weighting for the test.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Time limit
                </label>
                <input
                  name="timeLimit"
                  value={exam.timeLimit}
                  onChange={handleExamChange}
                  placeholder="e.g. 2 seconds"
                  className={fieldClass}
                />
                <p className="mt-2 text-xs text-slate-500">
                  The maximum execution time per test case.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Memory limit
                </label>
                <input
                  name="memoryLimit"
                  value={exam.memoryLimit}
                  onChange={handleExamChange}
                  placeholder="e.g. 256 MB"
                  className={fieldClass}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Ensures solutions are efficient and production-ready.
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col items-end gap-3 pb-6">
            <div className="text-sm text-slate-400">
              Templates are saved with normalized line endings for reliable
              grading.
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-900/40 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isSubmitting
                  ? "cursor-not-allowed opacity-60"
                  : "hover:from-indigo-600 hover:via-purple-600 hover:to-sky-500"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-transparent" />
                  Creating test...
                </>
              ) : (
                <>
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  Publish coding test
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CodingTestForm;
