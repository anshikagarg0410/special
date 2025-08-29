// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSydLqB2zqgGERAVsgQmkK5EIgtKL-K5KFb4",
  authDomain: "our-special-place-dd10d.firebaseapp.com",
  projectId: "our-special-place-dd10d",
  storageBucket: "our-special-place-dd10d.firebasestorage.app",
  messagingSenderId: "1046114355775",
  appId: "1:1046114355775:web:4aa02db0510bd96320468a",
  measurementId: "G-9660GVEC6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);