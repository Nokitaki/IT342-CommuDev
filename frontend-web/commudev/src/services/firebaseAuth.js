// src/services/firebaseAuth.js
// Refactored to use the centralized Firebase configuration

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Import the centralized auth instance
import { auth } from './firebase';

// Register a new user with email and password
export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Return the entire userCredential, not just user
    return userCredential;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// For signInWithEmail
export const signInWithEmail = async (email, password) => {
  console.log("Starting Firebase sign-in process");
  console.log("Auth object exists:", !!auth);
  
  try {
    console.log("Attempting Firebase signInWithEmailAndPassword");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    console.log("SignInWithEmailAndPassword returned:", userCredential);
    console.log("User object exists:", !!userCredential?.user);
    
    if (userCredential && userCredential.user) {
      console.log("User object properties:", Object.keys(userCredential.user));
      console.log("User UID:", userCredential.user.uid);
      return userCredential.user;
    } else {
      console.error("Firebase returned empty user credential");
      throw new Error("Authentication failed: empty user credential");
    }
  } catch (error) {
    console.error("Firebase sign-in error:", error.code, error.message);
    throw error;
  }
};

// Sign out the current user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Get the current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };