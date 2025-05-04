// src/utils/profileStorageUtils.js
import { supabase } from '../services/supabase';
import API_URL from '../config/apiConfig';

/**
 * Upload a profile picture using Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} userId - ID of the user
 * @returns {Promise<string>} - Promise that resolves with the image URL
 */
export const uploadProfileImageToSupabase = async (file, userId) => {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `users/${userId}/profile/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading profile image to Supabase:', error);
    throw error;
  }
};

/**
 * Upload a cover photo using Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} userId - ID of the user
 * @returns {Promise<string>} - Promise that resolves with the image URL
 */
export const uploadCoverPhotoToSupabase = async (file, userId) => {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `users/${userId}/cover/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading cover photo to Supabase:', error);
    throw error;
  }
};

/**
 * Upload an image to either Supabase or server with fallback mechanism
 * @param {File} file - The image file to upload
 * @param {string} userId - ID of the user
 * @param {string} type - Type of image ('profile' or 'cover')
 * @returns {Promise<string>} - Promise that resolves with the image URL
 */
/**
 * Upload a user image to Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} userId - ID of the user
 * @param {string} type - Type of image ('profile' or 'cover')
 * @returns {Promise<string>} - Promise that resolves with the image URL
 */
export const uploadUserImage = async (file, userId, type) => {
    try {
      console.log(`Uploading ${type} image for user ${userId}`);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `users/${userId}/${type}/${fileName}`;
      
      // Upload the file to the chat-images bucket
      const { data, error } = await supabase.storage
        .from('chat-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (error) {
        console.error(`Error uploading ${type} image:`, error);
        throw error;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('chat-images')
        .getPublicUrl(filePath);
      
      console.log(`${type} image uploaded successfully:`, publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error(`Error in uploadUserImage (${type}):`, error);
      throw error;
    }
  };

/**
 * Upload an image to the backend server
 * @param {File} file - The image file to upload
 * @param {string} type - Type of image ('profile' or 'cover')
 * @returns {Promise<string>} - Promise that resolves with the image URL
 */
export const uploadUserImageToServer = async (file, type) => {
  try {
    console.log(`Attempting server-side upload for ${type}...`);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Use the appropriate API endpoint
    const endpoint = type === 'profile' ? 'picture' : 'cover';
    const response = await fetch(`${API_URL}/users/me/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type here, browser will set it with correct boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the appropriate URL from the server response
    return type === 'profile' ? data.profilePicture : data.coverPhoto;
  } catch (error) {
    console.error(`Error uploading ${type} image to server:`, error);
    throw error;
  }
};