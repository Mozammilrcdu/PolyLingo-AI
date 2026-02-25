// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: "polylingo-f2822.firebaseapp.com",
  projectId: "polylingo-f2822",
  storageBucket: "polylingo-f2822.firebasestorage.app",
  messagingSenderId: "990089454110",
  appId: "1:990089454110:web:9f5281b89050eab34a840f",
  measurementId: "G-1ZGNQMMNMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
