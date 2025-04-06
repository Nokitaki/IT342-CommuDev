// src/services/authService.js

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

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

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
    const response = await fetch(`${USERS_URL}/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Upload profile picture
 * @param {File} file Profile picture file
 * @returns {Promise} Promise with updated user profile
 */
export const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${USERS_URL}/me/picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading profile picture:', error);
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
};