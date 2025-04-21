// src/services/authService.js
import { 
  registerWithEmailAndPassword, 
  signInWithEmail, 
  signOutUser,
  getCurrentUser,
  auth
} from './firebaseAuth';

const API_URL = 'http://localhost:8080';
const AUTH_URL = `${API_URL}/auth`;
const USERS_URL = `${API_URL}/users`;

/**
 * Login user
 * @param {string} email Email or username
 * @param {string} password Password
 * @returns {Promise} Promise with user data and token
 */
export const login = async (email, password) => {
  try {
    // First try to authenticate with Firebase
    let firebaseUser;
    try {
      // Extract email from the response or use the provided email
      const userEmail = email.includes('@') ? email : `${email}@example.com`;
      console.log("Signing in to Firebase with:", userEmail);
      
      const userCredential = await signInWithEmail(userEmail, password);
      firebaseUser = userCredential.user;
      console.log("Firebase sign-in successful:", firebaseUser.uid);
    } catch (firebaseError) {
      console.error("Firebase auth error:", firebaseError);
      // If the user doesn't exist in Firebase, create them
      if (firebaseError.code === 'auth/user-not-found') {
        console.log("Creating new Firebase user");
        try {
          const emailToUse = email.includes('@') ? email : `${email}@example.com`;
          const userCredential = await registerWithEmailAndPassword(emailToUse, password);
          console.log("Firebase user creation successful:", userCredential.user.uid);
          firebaseUser = userCredential;
        } catch (createError) {
          console.error("Failed to create Firebase user:", createError);
        }
      }
      // Continue with backend auth even if Firebase auth fails
    }

    // Now authenticate with your backend
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email, // This can be either email or username in your backend
        password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    
    // Store JWT token
    localStorage.setItem('token', data.token);
    
    // Store expiration time
    const expirationTime = new Date().getTime() + data.expiresIn * 1000;
    localStorage.setItem('expirationTime', expirationTime);
    
    // Extract and store user ID if available
    if (data.userId) {
      localStorage.setItem('userId', data.userId.toString());
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData User registration data
 * @returns {Promise} Promise with registration status
 */
export const register = async (userData) => {
  try {
    // Register with your backend
    const response = await fetch(`${AUTH_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const backendResponse = await response.json();
    
    // Register with Firebase
    try {
      // Make sure we have an email to use with Firebase
      const emailToUse = userData.email || `${userData.username}@example.com`;
      
      const userCredential = await registerWithEmailAndPassword(emailToUse, userData.password);
      console.log("Firebase registration successful:", userCredential.user.uid);
    } catch (firebaseError) {
      console.error("Firebase registration error:", firebaseError);
      // Continue anyway since backend registration succeeded
    }

    return backendResponse;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// The remaining functions are unchanged

/**
 * Verify user email with code
 * @param {string} email User email
 * @param {string} verificationCode Verification code
 * @returns {Promise} Promise with verification status
 */
export const verifyUser = async (email, verificationCode) => {
  try {
    const response = await fetch(`${AUTH_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        verificationCode
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};

/**
 * Resend verification code
 * @param {string} email User email
 * @returns {Promise} Promise with resend status
 */
export const resendVerificationCode = async (email) => {
  try {
    const response = await fetch(`${AUTH_URL}/resend?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to resend verification code');
    }

    return await response.json();
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

/**
 * Get current user profile data
 * @returns {Promise} Promise with user profile data
 */
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${USERS_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData Updated profile data
 * @returns {Promise} Promise with updated user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to update your profile');
    }

    const response = await fetch('http://localhost:8080/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Upload profile picture
 * @param {File|FormData} file Profile picture file or FormData with file
 * @returns {Promise} Promise with updated user profile
 */
export const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem('token');
    let formData;
    
    // Handle both FormData objects and File objects
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('file', file);
    }
    
    const response = await fetch(`${USERS_URL}/me/picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type here, browser will set it with correct boundary
      },
      credentials: 'include',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      throw new Error('Failed to upload profile picture');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

/**
 * Upload cover photo
 * @param {File|FormData} file Cover photo file or FormData with file
 * @returns {Promise} Promise with updated user profile
 */
export const uploadCoverPhoto = async (file) => {
  try {
    const token = localStorage.getItem('token');
    let formData;
    
    // Handle both FormData objects and File objects
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append('file', file);
    }
    
    const response = await fetch(`${USERS_URL}/me/cover`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type here, browser will set it with correct boundary
      },
      credentials: 'include',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      throw new Error('Failed to upload cover photo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading cover photo:', error);
    throw error;
  }
};

/**
 * Remove profile picture
 * @returns {Promise} Promise with updated user profile
 */
export const removeProfilePicture = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${USERS_URL}/me/picture`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove profile picture');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing profile picture:', error);
    throw error;
  }
};

/**
 * Get public profile by username
 * @param {string} username Username to fetch
 * @returns {Promise} Promise with public profile data
 */
export const getPublicProfile = async (username) => {
  try {
    const response = await fetch(`${USERS_URL}/profiles/${username}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch public profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching public profile:', error);
    throw error;
  }
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  const expirationTime = localStorage.getItem('expirationTime');
  
  if (!token || !expirationTime) {
    return false;
  }
  
  // Check if token is expired
  return new Date().getTime() < expirationTime;
};

/**
 * Log out user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationTime');
  
  // Also sign out from Firebase
  signOutUser().catch(error => {
    console.error("Firebase signout error:", error);
  });
};