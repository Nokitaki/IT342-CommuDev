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
    console.log("STARTING SUPABASE UPLOAD for user:", userId);
    console.log("File:", file.name, file.size, "bytes", file.type);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `profile_${Date.now()}.${fileExt}`;
      const filePath = `users/${userId}/profile/${fileName}`;
      
      console.log("Uploading to path:", filePath);
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("SUPABASE UPLOAD ERROR:", error);
        return null; // Return null instead of throwing to continue with server upload
      }
      
      console.log("SUPABASE UPLOAD SUCCESS:", data);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      console.log("SUPABASE URL:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("SUPABASE UPLOAD EXCEPTION:", error);
      return null; // Return null instead of throwing to continue with server upload
    }
  };

/**
 * Upload a cover photo using Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} userId - ID of the user
 * @returns {Promise<string>} - Promise that resolves with the image URL
 */
export const uploadCoverPhotoToSupabase = async (file, userId) => {
    console.log("STARTING SUPABASE COVER PHOTO UPLOAD for user:", userId);
    console.log("File:", file.name, file.size, "bytes", file.type);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `cover_${Date.now()}.${fileExt}`;
      const filePath = `users/${userId}/cover/${fileName}`;
      
      console.log("Uploading cover to path:", filePath);
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("SUPABASE COVER UPLOAD ERROR:", error);
        return null; // Return null instead of throwing to continue with server upload
      }
      
      console.log("SUPABASE COVER UPLOAD SUCCESS:", data);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      console.log("SUPABASE COVER URL:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("SUPABASE COVER UPLOAD EXCEPTION:", error);
      return null; // Return null instead of throwing to continue with server upload
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
      
      // Use profile-images bucket for profile/cover photos
      const { data, error } = await supabase.storage
        .from('profile-images') // Change from chat-images to profile-images
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (error) {
        console.error(`Error uploading ${type} image:`, error);
        throw error;
      }
      
      // Get the public URL from profile-images bucket
      const { data: publicUrlData } = supabase.storage
        .from('profile-images') // Change from chat-images to profile-images
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