// In firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // <-- Add this
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  //... your keys
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // <-- Add this
export const db = getFirestore(app);
export const storage = getStorage(app);