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
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
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