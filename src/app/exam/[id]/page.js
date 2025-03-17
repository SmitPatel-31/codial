"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { exams } from "../../../../utils/firefunction";
import styles from './ExamPage.module.css';
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { basicDark } from "@uiw/codemirror-theme-basic";
import { hover } from "framer-motion";

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

  if (isValidSession === null || !user) {
    return <div>Loading...</div>;
  }

  if (!isValidSession) {
    return null;
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(e.target.value === "python" ? examData?.pythonTemplate || "" : examData?.javaTemplate || "");
  };

  const handleRunCode = () => {
    console.log(`Running ${language} code:`);
    console.log(code);
  };

  return (
    <div className={styles.examContainer}>
      <div className={styles.header}>
  <h1 className={styles.examTitle}>📝 Exam: {examData?.title}</h1>
</div>


      <div className={styles.contentWrapper}>
        {/* Problem Description Section */}
        <div className={styles.problemDescription}>
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
          <div className={styles.languageSelector}>
            <label htmlFor="language" className={styles.languageLabel}>Select Language:</label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className={styles.languageDropdown}
            >
              <option value="python">🐍 Python</option>
              <option value="java">☕ Java</option>
            </select>
          </div>

          <CodeMirror
            value={code.replace(/\\n/g, "\n")}
            height="calc(100vh - 200px)"
            extensions={[language === "python" ? python() : java()]}
            theme={basicDark}
            onChange={(value) => setCode(value)}
            basicSetup={{
              indentOnInput: true,
              tabSize: 4,
              bracketMatching: true,
              autoCloseBrackets: true,
            }}
          />
          <div className={styles.buttonGroup}>
            <button className={styles.runButton} onClick={handleRunCode}>Run</button>
            <button className={`bg-red-600 ${styles.submitButton} hover:bg-red-700`}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
