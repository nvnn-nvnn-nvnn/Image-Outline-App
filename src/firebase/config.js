// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';  // ADD THIS
import { getFirestore } from 'firebase/firestore';  // ADD THIS

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKvy1Q0RXWL78YpFF9Txjq9AXT_HPxMlk",
  authDomain: "strokify-image-outline-app.firebaseapp.com",
  projectId: "strokify-image-outline-app",
  storageBucket: "strokify-image-outline-app.firebasestorage.app",
  messagingSenderId: "794886992901",
  appId: "1:794886992901:web:db966a8542cda991f4586c",
  measurementId: "G-7M38XYZ4WK"
};

// Initialize Firebase
console.log("Initializing Firebase with config:", firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app);

const analytics = getAnalytics(app);
export const auth = getAuth(app);
console.log("Firebase auth initialized:", auth);

export const googleProvider = new GoogleAuthProvider();
console.log("Google provider created:", googleProvider);

export const db = getFirestore(app);
console.log("Firestore initialized:", db);