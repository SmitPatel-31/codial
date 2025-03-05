// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export { app, auth,db };