"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; // Import Firebase auth
import { exams } from "../../../../utils/firefunction";
import styles from './ExamPage.module.css'; // Import the CSS module

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

  // Authentication check
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

  // Session validation
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
        setExamData(await exams(examId));
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

  return (
    <div className={styles.examContainer}>
      <div className={styles.header}>
        <h1>Exam: {examData?.title}</h1>
        <button className={styles.submitButton}>Submit</button>
      </div>

      <div className={styles.mainContent}>
        {/* Problem Description Section */}
        <div className={styles.problemDescription}>
          <h3>Problem</h3>
          <p>{examData?.description}</p>

          <h4>Input:</h4>
          <p>{examData?.input}</p>

          <h4>Output:</h4>
          <p>{examData?.output}</p>

          <h4>Examples:</h4>
          {examData?.examples?.map((example, index) => (
            <div key={index}>
              <p><strong>Input:</strong> {example.input}</p>
              <p><strong>Output:</strong> {example.output}</p>
            </div>
          ))}
        </div>

        {/* Code Editor Section */}
        <div className={styles.codeEditorContainer}>
          <div className={styles.codeEditor}>
            <h3>Python Code</h3>
            <textarea
              className={styles.textarea}
              id="python-code"
              placeholder="Write your Python code here"
              defaultValue={examData?.pythonTemplate || "def reverse_words(s: str) -> str:\n    return ' '.join(s.split()[::-1])"}
              rows={10}
              cols={60}
            />
          </div>

          <div className={styles.codeEditor}>
            <h3>Java Code</h3>
            <textarea
              className={styles.textarea}
              id="java-code"
              placeholder="Write your Java code here"
              defaultValue={examData?.javaTemplate || "public class Solution {\n    public static String reverseWords(String s) {\n        String[] words = s.split(\" \");\n        StringBuilder result = new StringBuilder();\n        for (int i = words.length - 1; i >= 0; i--) {\n            result.append(words[i]).append(\" \");\n        }\n        return result.toString().trim();\n    }\n}"}
              rows={10}
              cols={60}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
