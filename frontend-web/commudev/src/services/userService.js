// src/services/userService.js
import axios from 'axios';
import { getAuthHeader } from '../utils/authUtils';

const API_URL = 'http://localhost:8080';

/**
 * Get the current user's profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

/**
 * Update the current user's profile
 * @param {Object} profileData Profile data to update
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/users/me`, profileData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

/**
 * Upload a profile picture
 * @param {File} file Image file to upload
 * @returns {Promise<Object>} Updated user profile with new picture path
 */
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/users/me/picture`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload profile picture');
  }
};

/**
 * Get a user's public profile by username
 * @param {string} username Username to fetch
 * @returns {Promise<Object>} Public profile data
 */
export const getPublicUserProfile = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/users/profiles/${username}`, {
      headers: getAuthHeader() // Include auth header if available for more data access
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching public profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};