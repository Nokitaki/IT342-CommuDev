
import API_URL from '../config/apiConfig.js';

import { uploadUserImage } from '../utils/profileStorageUtils';


const AUTH_URL = `${API_URL}/auth`;
const USERS_URL = `${API_URL}/users`;

/**
 * Login user
 * @param {string} email Email or username
 * @param {string} password Password
 * @returns {Promise} Promise with user data and token
 */
// Update the login function in authService.js
export const login = async (email, password) => {
  try {
    // First clear any existing tokens
    localStorage.removeItem('token');
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email, 
        password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    
    // Debug the response
    console.log('Login response:', data);
    
    // Store JWT token
    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('Token stored in localStorage');
      
      // Set expiration time (default to 1 hour if not provided)
      const expiresIn = data.expiresIn || 3600;
      const expirationTime = new Date().getTime() + expiresIn * 1000;
      localStorage.setItem('expirationTime', expirationTime);
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

    return await response.json();
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
    console.log('Getting profile with token:', token ? token.substring(0, 10) + '...' : 'No token');
    
    if (!token) {
      throw new Error('Authentication token missing');
    }
    
    const response = await fetch(`${USERS_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log('Profile response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Profile error response:', errorText);
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

    // Simplify the data we're sending
    // Only include basic text fields first to test
    const simplifiedData = {
      firstname: profileData.firstname || undefined,
      lastname: profileData.lastname || undefined,
      biography: profileData.biography || undefined
    };

    console.log('Sending simplified profile update:', simplifiedData);

    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(simplifiedData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Profile update error response:', errorText);
      throw new Error(`Server error (${response.status}): ${errorText.substring(0, 100)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Upload profile picture
 * @param {File|FormData} file Profile picture file or FormData with fillocalhost:8080e
 * @returns {Promise} Promise with updated user profile   
 */
export const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    let fileObj;
    
    // Handle both FormData objects and File objects
    if (file instanceof FormData) {
      fileObj = file.get('file');
    } else {
      fileObj = file;
    }
    
    // Get the current user profile to get the user ID
    const profile = await getUserProfile();
    const userId = profile.id;
    
    // Upload to Supabase first - ensure we use profile-images bucket
    let supabaseUrl = null;
    try {
      // Use the specific function for profile pictures
      supabaseUrl = await uploadProfileImageToSupabase(fileObj, userId);
      console.log('Profile picture uploaded to Supabase:', supabaseUrl);
      
      // Update the backend with the Supabase URL
      const response = await fetch(`${API_URL}/users/me/external-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: supabaseUrl })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Supabase upload failed:', error);
    }
    
    // If Supabase upload failed or updating the URL failed, fall back to server upload
    const formData = new FormData();
    formData.append('file', fileObj);
    
    const response = await fetch(`${API_URL}/users/me/picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
 * Upload cover photo
 * @param {File|FormData} file Cover photo file or FormData with file
 * @returns {Promise} Promise with updated user profile
 */
export const uploadCoverPhoto = async (file) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    let fileObj;
    
    // Handle both FormData objects and File objects
    if (file instanceof FormData) {
      fileObj = file.get('file');
    } else {
      fileObj = file;
    }
    
    // Get the current user profile to get the user ID
    const profile = await getUserProfile();
    const userId = profile.id;
    
    // Try to upload to Supabase first
    try {
      await uploadUserImage(fileObj, userId, 'cover');
      console.log('Cover photo uploaded to Supabase');
    } catch (error) {
      console.error('Supabase upload failed:', error);
    }
    
    // Always do the server upload for now
    const formData = new FormData();
    formData.append('file', fileObj);
    
    const response = await fetch(`${API_URL}/users/me/cover`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
};



export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  console.log('Auth Status Check:');
  console.log('- Token exists:', !!token);
  console.log('- User ID:', userId);
  
  // Check if token is expired
  if (token) {
    try {
      // Simple validation by checking for token format (not decoding)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('- Token format is invalid');
        return false;
      }
      console.log('- Token format looks valid');
      return true;
    } catch (e) {
      console.log('- Token validation error:', e);
      return false;
    }
  }
  return false;
};


// Add to authService.js
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found in localStorage');
    return false;
  }
  
  if (isTokenExpired()) {
    console.warn('Token is expired');
    clearAuthData();
    return false;
  }
  
  console.log('Auth check passed - token exists and not expired');
  return true;
};