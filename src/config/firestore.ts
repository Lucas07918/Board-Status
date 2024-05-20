// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMMRColf7gCfks6I_MFhKwvQ52L0o-W_8",
  authDomain: "boardstatus-e6db8.firebaseapp.com",
  projectId: "boardstatus-e6db8",
  storageBucket: "boardstatus-e6db8.appspot.com",
  messagingSenderId: "931850797904",
  appId: "1:931850797904:web:10da9926b36d1c04772255"
};

console.log("Initializing Firebase app...");
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app);

console.log("Initializing Firestore...");
export const db = getFirestore(app);
console.log("Firestore initialized:", db);
