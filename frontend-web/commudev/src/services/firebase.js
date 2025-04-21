// src/services/firebase.js
// Centralized Firebase configuration to ensure proper initialization

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIKlu3Pv6ywf3iPzlQ8Dx0dLq3FhM-4aU",
  authDomain: "commudev-26875.firebaseapp.com",
  databaseURL: "https://commudev-26875-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "commudev-26875",
  storageBucket: "commudev-26875.appspot.com",
  messagingSenderId: "497152523487",
  appId: "1:497152523487:web:0c35bc99d8d47458ecfd6a",
  measurementId: "G-12TGZG3GKK"
};

// Initialize Firebase
let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Initialize Firestore
const firestore = getFirestore(firebaseApp);
console.log("Firestore initialized:", !!firestore);

// Initialize Realtime Database
const realtimeDB = getDatabase(firebaseApp);
console.log("Realtime Database initialized:", !!realtimeDB);

// Initialize Authentication
const auth = getAuth(firebaseApp);
console.log("Firebase Auth initialized:", !!auth);

// Export initialized services
export { firebaseApp, firestore, realtimeDB, auth };