import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your specific Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_bDfjuMTDnN8uNzkRghQJobG9CQ1l4DQ",
  authDomain: "pocketmoney-4df59.firebaseapp.com",
  projectId: "pocketmoney-4df59",
  storageBucket: "pocketmoney-4df59.firebasestorage.app",
  messagingSenderId: "729693702700",
  appId: "1:729693702700:web:aa5fe51d4990d4ae73df89",
  measurementId: "G-YRCB8JKV6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app); 
export const auth = getAuth(app);
export const db = getFirestore(app);

// This ID is used to separate your data in the database
export const appId = "pocketmoney-app-v1";