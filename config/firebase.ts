import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpN8kn-UlB40EYcr5Zi4hXCwIK7XS2txU",
  authDomain: "career-code-154e7.firebaseapp.com",
  projectId: "career-code-154e7",
  storageBucket: "career-code-154e7.firebasestorage.app",
  messagingSenderId: "1066678699849",
  appId: "1:1066678699849:web:16702babe00b30bb827c98",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);