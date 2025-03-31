const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore, collection, addDoc } = require("firebase/firestore");


const firebaseConfig = {
  apiKey: "AIzaSyCkjBAPj9uZpT7zHr9ZD36MwjblMlslEa8",
  authDomain: "codial-3131.firebaseapp.com",
  projectId: "codial-3131",
  storageBucket: "codial-3131.firebasestorage.app",
  messagingSenderId: "128796495819",
  appId: "1:128796495819:web:84b5b993da1ffa105df04e",
  measurementId: "G-32E063SE4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



const problem = {
    constraints: [
      "1 ≤ |s| ≤ 10^6",
      "Only ASCII printable characters (excluding tabs, newlines)",
      "No leading/trailing spaces",
      "Words are space-separated"
    ],
    description: "A single string s (1 ≤ |s| ≤ 10^6), where |s| represents the length of s. s contains only printable ASCII characters and has at least one non-space character. Words in s are separated by a single space (no leading or trailing spaces). The task is to remove all duplicate words in the string while preserving the order of their first occurrence.",
    examples: [
      {
        input: "the cat in the hat is in the bag",
        output: "the cat in hat is bag"
      },
      {
        input: "hello world hello world",
        output: "hello world"
      }
    ],
    id: "dHkn3M1LgXoU0hxwG1ua",
    input: "A single string s (1 ≤ |s| ≤ 10^6), where |s| represents the length of s. s contains only printable ASCII characters and has at least one non-space character. Words in s are separated by a single space (no leading or trailing spaces). The task is to remove all duplicate words in the string while preserving the order of their first occurrence.",
    javaTemplate: "public class Solution {\n public static String removeDuplicates(String s) {\n // Your code here\n String[] words = s.split(\" \");\n Set<String> seen = new HashSet<>();\n StringBuilder result = new StringBuilder();\n for (String word : words) {\n if (!seen.contains(word)) {\n result.append(word).append(\" \");\n seen.add(word);\n }\n }\n return result.toString().trim();\n }\n}",
    maxPoints: 50,
    memoryLimit: "256 MB",
    output: "Return a string where all duplicate words are removed, and the words appear in their original order of first occurrence.",
    problemId: "remove_duplicates",
    pythonTemplate: "import sys\n\nclass Solution:\n def removeDuplicates(self, s: str) -> str:\n words = s.split()\n seen = set()\n result = []\n for word in words:\n if word not in seen:\n result.append(word)\n seen.add(word)\n return ' '.join(result)\n\n# Simulate LeetCode's automatic function call\nif __name__ == \"__main__\":\n s = sys.stdin.read().strip() # Read input from Judge0 (stdin)\n sol = Solution()\n print(sol.removeDuplicates(s)) # Print output so Judge0 captures it\n",
    timeLimit: "1 second",
    title: "Remove Duplicates from Sentence"
  };


  const examRef = collection(db, 'exam');
  addDoc(examRef, problem)
    .then(docRef => {
      console.log('Problem added with ID: ', docRef.id);
    })
    .catch(error => {
      console.error('Error adding problem: ', error);
    });