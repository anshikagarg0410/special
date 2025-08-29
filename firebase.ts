// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- PASTE YOUR FIREBASE CONFIG KEYS BELOW ---
// Replace the placeholder values with the actual keys you copied from the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyDLqB2zqgGERAVsgOmkK5EIgtkL-K5KFb4",
  authDomain: "our-special-place-dd10d.firebaseapp.com",
  projectId: "our-special-place-dd10d",
  storageBucket: "our-special-place-dd10d.firebasestorage.app",
  messagingSenderId: "1046114355775",
  appId: "1:1046114355775:web:4aa02db0510bd96320468a",
  measurementId: "G-9660GVEC6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
// This is your database for storing text data like notes and photo captions.
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
// This is where you will store your image files.
export const storage = getStorage(app);