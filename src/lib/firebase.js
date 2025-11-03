// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtZPaNDCeRMPwwWhAidcGVNbn8zQKEffI",
  authDomain: "x-space-a2903.firebaseapp.com",
  projectId: "x-space-a2903",
  storageBucket: "x-space-a2903.firebasestorage.app",
  messagingSenderId: "185640180245",
  appId: "1:185640180245:web:7f811667fa666cce688c1c",
  measurementId: "G-YVMJ1JJE0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
