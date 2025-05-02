// src/services/imageService.js
import { supabase } from './supabase';
import API_URL from '../config/apiConfig';

/**
 * Upload an image for messaging
 * Tries Supabase first if available, falls back to server upload
 * 
 * @param {File} file - The image file to upload
 * @param {string} conversationId - ID of the conversation
 * @param {string} senderId - ID of the sender
 * @returns {Promise<string>} - Promise that resolves with the image URL
 */
export const uploadMessageImage = async (file, conversationId, senderId) => {
    try {
      // Check if we're in fallback mode
      const usingFallback = localStorage.getItem('usingFallbackStorage') === 'true';
      
      if (usingFallback) {
        // Use server upload directly if in fallback mode
        console.log('Using server-side upload (fallback mode)');
        return await uploadMessageImageToServer(file, conversationId);
      }
      
      // Try Supabase upload first
      try {
        console.log('Attempting Supabase upload...');
        
        // Create a unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `messages/${conversationId}/${senderId}/${fileName}`;
        
        // Upload the file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('chat-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });
        
        if (error) {
          throw error;
        }
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('chat-images')
          .getPublicUrl(filePath);
        
        return publicUrlData.publicUrl;
      } catch (supabaseError) {
        console.warn('Supabase upload failed, switching to server upload:', supabaseError);
        
        // Set fallback mode for future uploads
        localStorage.setItem('usingFallbackStorage', 'true');
        
        // Fall back to server upload
        return await uploadMessageImageToServer(file, conversationId);
      }
    } catch (error) {
      console.error('Error in image upload:', error);
      // Final fallback - always try server upload
      return await uploadMessageImageToServer(file, conversationId);
    }
  };

/**
 * Upload an image to the backend server
 * @param {File} file - The image file to upload  
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise<string>} - Promise that resolves with the image URL
 */
export const uploadMessageImageToServer = async (file, conversationId) => {
    try {
      console.log('Attempting server-side upload...');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);
      
      // Use API endpoint for image upload
      const response = await fetch(`${API_URL}/api/messages/image-upload`, {
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
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading message image to server:', error);
      throw error;
    }
  };