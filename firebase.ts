// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHfRs2XoRCURbz2TZHldBPj10-Nh7J4cA",
  authDomain: "daily-expense-4e81d.firebaseapp.com",
  projectId: "daily-expense-4e81d",
  storageBucket: "daily-expense-4e81d.appspot.com",
  messagingSenderId: "187199869123",
  appId: "1:187199869123:web:9003fcf4f3f9d98d681276",
  measurementId: "G-KVYT1FDRXX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (typeof window !== "undefined" && (await isSupported())) {
  const analytics = getAnalytics(app);
}

export { db };
