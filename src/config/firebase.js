// FIREBASE SETUP FOR TECHNO-LUMIVANA
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVZgNyG3moBt1HaetQ8RTqCf47ROwpU1U",
  authDomain: "lumivana-c0488.firebaseapp.com",
  projectId: "lumivana-c0488",
  storageBucket: "lumivana-c0488.firebasestorage.app",
  messagingSenderId: "593132826538",
  appId: "1:593132826538:web:28a0840c2c41d0860dc5d3",
  measurementId: "G-FTWR6Y7LNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Database (for commissions)
export const db = getFirestore(app);

// Storage (for images)
export const storage = getStorage(app);
export const auth = getAuth(app);