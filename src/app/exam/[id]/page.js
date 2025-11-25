"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { exams, submitExamResult } from "../../../../utils/firefunction";
import styles from './ExamPage.module.css';
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { basicDark } from "@uiw/codemirror-theme-basic";
import { linter } from "@codemirror/lint";
import { submitCode } from './submit';
import { StreamLanguage } from '@codemirror/language';
import { scala } from '@codemirror/legacy-modes/mode/clike';
import Split from "react-split";
import { ToastContainer, toast } from 'react-toastify';

/**
 * Very basic pattern-based Scala linter in JS
 * Only checks for simple issues in raw code text
 */
const scalaLinter2 = linter(async (view) => {
  const errors = [];
  const code = view.state.doc.toString();
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const lineInfo = view.state.doc.line(lineNumber);

    // Avoid use of `var`
    if (/^\s*var\s/.test(line)) {
      errors.push({
        from: lineInfo.from,
        to: lineInfo.to,
        severity: "warning",
        message: "Avoid using 'var'. Prefer 'val'."
      });
    }

    // Function name starts with uppercase
    const defMatch = line.match(/def\s+([A-Z][a-zA-Z0-9_]*)\s*\(/);
    if (defMatch) {
      errors.push({
        from: lineInfo.from,
        to: lineInfo.to,
        severity: "warning",
        message: `Method '${defMatch[1]}' should start with a lowercase letter.`
      });
    }

    // Missing closing parenthesis in `for` loop
    if (/for\s*\([^)]+$/.test(line)) {
      errors.push({
        from: lineInfo.from,
        to: lineInfo.to,
        severity: "error",
        message: "Possible missing closing parenthesis in 'for' loop."
      });
    }

    // Thread.sleep usage
    if (line.includes("Thread.sleep")) {
      errors.push({
        from: lineInfo.from,
        to: lineInfo.to,
        severity: "warning",
        message: "Avoid using Thread.sleep - it's usually bad practice."
      });
    }

    // Unmatched quotes
    const quoteCount = (line.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      errors.push({
        from: lineInfo.from,
        to: lineInfo.to,
        severity: "error",
        message: "Unmatched quote detected."
      });
    }
  });

  return errors;
});



const scalaLinter = linter(async (view) => {
  const code = view.state.doc.toString();
  const errors = [];

  const res = await fetch("/api/lintScala", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  const result = await res.json();

  if (!result.success && result.errors.length > 0) {
    for (let err of result.errors) {
      const lineInfo = view.state.doc.line(err.line + 1);
      errors.push({
        from: lineInfo.from,
        to: lineInfo.to,
        severity: "error",
        message: err.message,
      });
    }
  }

  return errors;
});




async function loadPyodide() {
  return new Promise((resolve, reject) => {
    if (window.pyodide) {
      resolve(window.pyodide);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.0/full/pyodide.js";
    script.onload = async () => {
      try {
        window.pyodide = await window.loadPyodide();
        resolve(window.pyodide);
      } catch (error) {
        reject(error);
      }
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}




const pythonLinter = linter(async (view) => {
  await loadPyodide(); // Ensure Pyodide is loaded
  const errors = [];
  const code = view.state.doc.toString();

  try {
    window.pyodide.runPython(`compile(${JSON.stringify(code)}, '<stdin>', 'exec')`);
  } catch (e) {
    const match = e.message.match(/line (\d+)/);
    if (match) {
      let line = parseInt(match[1]) - 1; // Convert to zero-based index
      const totalLines = view.state.doc.lines; // Get total number of lines in CodeMirror

      // Ensure the line number is within the document range
      if (line < 0) line = 0;
      if (line >= totalLines) line = totalLines - 1;

      errors.push({
        from: view.state.doc.line(line).from,
        to: view.state.doc.line(line).to,
        severity: "error",
        message: e.message,
      });
    }
  }

  return errors;
});




const ExamPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = searchParams.get("session");
  const pathname = usePathname();
  const examId = pathname.split("/").pop();
  const [user, setUser] = useState(null);
  const [isValidSession, setIsValidSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [examData, setExamData] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [showCompiler, setShowCompiler] = useState(false);
  const [passed, setPassed] = useState(0);
  const [failed, setFailed] = useState(0);
  const [total, setTotal] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compilerOutput, setCompilerOutput] = useState(null);
  const [errorOutput, setErrorOutput] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const [exitedFullscreen, setExitedFullscreen] = useState(false);
  
const [tabSwitchLogs, setTabSwitchLogs] = useState([]);


  useEffect(() => {
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
    const fetchData = async () => {
      const sessionParam = new URLSearchParams(window.location.search).get("session");
      const allowedExamId = sessionStorage.getItem("allowedExamId");
      const sessionId = sessionStorage.getItem("sessionKey");
      setUserData(JSON.parse(sessionStorage.getItem("userData")));
      sessionStorage.removeItem("userData");

      if (!allowedExamId || !sessionId || !sessionParam) {
        router.push("/dashboard");
        return;
      }

      if (allowedExamId === examId && sessionId === sessionParam) {
        setIsValidSession(true);
        const data = await exams(examId);
        setExamData(data);
        setCode(data?.pythonTemplate || "");
        setTimeout(() => {
          sessionStorage.removeItem("allowedExamId");
          sessionStorage.removeItem("sessionKey");
        }, 0);
      } else {
        router.push("/dashboard");
      }
    };
    fetchData();
  }, [examId, session, router]);



  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the tab
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          setTabSwitchLogs(prev => [...prev, { type: 'hidden', time: Date.now() }]);
          return newCount;
        });
      } else {
          setTabSwitchLogs(prev => [...prev, { type: 'visible', time: Date.now()}]);

        toast.error('Tab switched Detected', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    };


    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // window.addEventListener("blur", handleWindowBlur);
    // window.addEventListener("focus", handleWindowFocus);

    // Cleanup function
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // window.removeEventListener("blur", handleWindowBlur);
      // window.removeEventListener("focus", handleWindowFocus);
      console.log("Tab switch detection cleanup completed");
    };
  }, []);

  
  useEffect(() => {
    if (tabSwitchCount >= 3) {
      toast.error('Now Exam will close automatically', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [tabSwitchCount])

useEffect(() => {
  const onFullscreenChange = () => {
    const isFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;

    if (!isFullscreen) {
      setExitedFullscreen(true);
    }
  };

  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange); // Safari
  document.addEventListener('msfullscreenchange', onFullscreenChange); // IE11

  return () => {
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    document.removeEventListener('msfullscreenchange', onFullscreenChange);
  };
}, []);

useEffect(() => {
  if (exitedFullscreen) {

    toast.error('You Exited from Full Screen Mode', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setTabSwitchLogs(prev => [...prev, { type: 'Full Screen Exit', time: Date.now()}]);

  }
}, [exitedFullscreen]);



  if (isValidSession === null || !user) {
    return <div>Loading...</div>;
  }

  if (!isValidSession) {
    return null;
  }
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (e.target.value === "python") {
      setCode(examData?.pythonTemplate || "");
    } else if (e.target.value === "java") {
      setCode(examData?.javaTemplate || "");
    } else {
      setCode(examData?.scalaTemplate || "");
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    const result = await submitCode(code.replace(/\\n/g, "\n"), language, examData);
    console.log("Submission Result:", result);
    setResult(result);
    setPassed(result.passed);
    setFailed(result.total - result.passed);
    setCompilerOutput(result.compilerOutput);
    setErrorOutput(result.errorOutput);
    setTotal(result.total);
    setShowCompiler(true);
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitCode(code.replace(/\\n/g, "\n"), language, examData);
    console.log("Submission Result:", result);
    // in idle case exitedFullscreen must be false;
    const cheatingLogs = {
      tabSwitchCount:tabSwitchCount,
      tabSwitchLogs: tabSwitchLogs,
      exitedFullscreen:exitedFullscreen
    }
    await submitExamResult(result, user, examData,cheatingLogs);
    const queryParams = new URLSearchParams({
      examData: examData,
      user: user,
    }).toString();
    router.push(`/feedback?${queryParams}`);

    // router.push("/dashboard");

  }

  return (
    <div className={styles.examContainer}>

      <div className={styles.header}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
            Live exam
          </p>
          <h1 className={styles.examTitle}>{examData?.title}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-100">
            Session secure
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1">
            {userData?.name || "Candidate"}
          </span>
        </div>
      </div>
      <ToastContainer />

      <div className={styles.contentWrapper}>
        {/* Problem Description Section */}
        <Split
          className={styles.splitContainer}
          sizes={[45, 55]}
          minSize={300}
          gutterSize={6}
        >
          <div className={`${styles.problemDescription} ${styles.hideScrollbar}`}>
            <h2 className={styles.sectionTitle}>Problem</h2>
            <p className={styles.problemText}>{examData?.description}</p>

            <h3 className={styles.sectionTitle}>Input</h3>
            <p className={styles.problemText}>{examData?.input}</p>

            <h3 className={styles.sectionTitle}>Output</h3>
            <p className={styles.problemText}>{examData?.output}</p>

            <h3 className={styles.sectionTitle}>Examples</h3>
            {examData?.examples?.map((example, index) => (
              <div key={index} className={styles.exampleBox}>
                <h4>Input:</h4>
                <pre className={styles.ioBox}>{example?.input}</pre>

                <h4>Output:</h4>
                <pre className={styles.ioBox}>{example?.output}</pre>
              </div>
            ))}
          </div>

          {/* Code Editor Section */}
          <div className={styles.codeEditorContainer}>
            <div style={{ height: "100%" }}>
              <div className={styles.languageSelector}>
                <label htmlFor="language" className={styles.languageLabel}>Select Language:</label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className={styles.languageDropdown}
                >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="scala">Scala</option>
                </select>
              </div>
              <div style={{ height: "calc(100% - 100px)" }} >
                <CodeMirror
                  value={code.replace(/\\n/g, "\n")}
                  height="100%"
                  extensions={[
                    language === "python"
                      ? [python(), pythonLinter]
                      : language === "java"
                        ? [java()]
                        : [StreamLanguage.define(scala), scalaLinter],
                  ]}
                  editable={!isRunning}
                  theme={basicDark}
                  onChange={(value) => setCode(value)}
                  basicSetup={{
                    indentOnInput: true,
                    tabSize: 4,
                    bracketMatching: true,
                    autoCloseBrackets: true,
                  }}
                />
              </div>

              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.runButton} ${isRunning ? styles.disabled : ""}`}
                  onClick={handleRunCode}
                  disabled={isRunning}
                >
                  {isRunning ? <span className={styles.loader} /> : "Run"}
                </button>
                <button
                  className={`${styles.submitButton} ${isSubmitting ? styles.disabled : ""}`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span className={styles.loader} /> : "Submit"}
                </button>
              </div>
            </div>

            <div >
              {showCompiler && (
                <div className={styles.resultContainer}>
                  <div className={styles.resultHeader}>
                    <button
                      className={styles.closeButton}
                      onClick={() => setShowCompiler(false)}
                    >
                      Close
                    </button>
                  </div>

                  <div className={`${styles.resultBody} bg-slate-900`}>
                    {compilerOutput?.length > 0 && (
                      <div className="m-5 rounded-xl border border-slate-800 bg-slate-800 p-4 text-white shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Compiler output</h2>
                        <pre className="whitespace-pre-wrap text-sm text-slate-200">
                          {compilerOutput.join("\n")}
                        </pre>
                      </div>
                    )}

                    {errorOutput?.length > 0 && (
                      <div className="m-5 rounded-xl border border-slate-800 bg-slate-800 p-4 text-white shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Error output</h2>
                        <pre className="whitespace-pre-wrap text-sm text-slate-200">
                          {errorOutput.join("\n")}
                        </pre>
                      </div>
                    )}

                    <div className="mx-5 mb-5 rounded-xl border border-slate-800 bg-slate-900 p-4 text-center text-white shadow-md">
                      <h2 className="text-lg font-semibold mb-4">Submission results</h2>
                      <div className="flex justify-center space-x-4">
                        <div className="flex flex-col items-center rounded-lg bg-emerald-500/20 px-4 py-2">
                          <p className="text-xl font-bold text-emerald-200">{passed}</p>
                          <p className="text-sm text-emerald-100">Passed</p>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-rose-500/20 px-4 py-2">
                          <p className="text-xl font-bold text-rose-200">{failed}</p>
                          <p className="text-sm text-rose-100">Failed</p>
                        </div>
                      </div>
                      <p className="mt-4 text-slate-300">Total test cases: {total}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>



          </div>
        </Split>
      </div>
    </div>
  );
};

export default ExamPage;
