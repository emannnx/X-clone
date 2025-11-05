import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAtZPaNDCeRMPwwWhAidcGVNbn8zQKEffI",
  authDomain: "x-space-a2903.firebaseapp.com",
  projectId: "x-space-a2903",
  storageBucket: "x-space-a2903.firebasestorage.app",
  messagingSenderId: "185640180245",
  appId: "1:185640180245:web:7f811667fa666cce688c1c",
  measurementId: "G-YVMJ1JJE0W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .then(() => {
    console.log("Firebase persistence enabled");
  })
  .catch((err) => {
    console.log("Firebase persistence error:", err);
  });

export { app, auth, db, storage, analytics };