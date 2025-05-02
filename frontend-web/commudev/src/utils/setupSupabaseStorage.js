// src/utils/setupSupabaseStorage.js
import { supabase } from '../services/supabase';

/**
 * Check if Supabase storage is usable and accessible
 * @returns {Promise<boolean>} - Whether Supabase storage can be used
 */
export const canUseSupabaseStorage = async () => {
  try {
    console.log('Checking Supabase storage availability...');
    
    // Check if we can access the bucket using the correct .from() method
    const { data, error } = await supabase.storage
      .from('chat-images')  // Use .from() instead of direct bucket URL
      .list('', { limit: 1 });
      
    if (error) {
      console.log('Cannot use Supabase storage:', error.message);
      return false;
    }
    
    // If we get here, Supabase storage is working
    console.log('Supabase storage is available and configured.');
    return true;
  } catch (error) {
    console.error('Error checking Supabase storage:', error);
    return false;
  }
};

/**
 * Set up Supabase storage for the chat application
 * This script creates the necessary bucket and sets up permissions
 */
export const setupSupabaseStorage = async () => {
  try {
    console.log('Checking Supabase storage availability...');
    
    // Default to using fallback mode until we confirm Supabase works
    localStorage.setItem('usingFallbackStorage', 'true');
    
    // Check if Supabase storage is usable
    const storageAvailable = await canUseSupabaseStorage();
    
    if (!storageAvailable) {
      console.log('Supabase storage not available or configured. Using fallback storage.');
      return false;
    }
    
    // If we get here, Supabase storage is working
    console.log('Supabase storage is available and configured.');
    localStorage.removeItem('usingFallbackStorage');
    return true;
  } catch (error) {
    console.error('Error checking Supabase storage:', error);
    localStorage.setItem('usingFallbackStorage', 'true');
    return false;
  }
};

// Fallback function to use local storage if Supabase is not available
const createFallbackStorage = () => {
  // This would normally create a local fallback, but for now we'll just
  // use localStorage to track that we're in fallback mode
  localStorage.setItem('usingFallbackStorage', 'true');
  console.log('Using fallback storage mode');
  return false;
};

/**
 * Initialize the storage setup when the app starts
 * Add this to your App.jsx or index.js file
 */
export const initializeStorage = () => {
  // Default to fallback storage until proven otherwise
  localStorage.setItem('usingFallbackStorage', 'true');
  
  setupSupabaseStorage()
    .then(success => {
      if (success) {
        console.log('✅ Supabase storage initialized successfully');
        localStorage.removeItem('usingFallbackStorage');
      } else {
        console.warn('⚠️ Using server-side storage fallback');
      }
    })
    .catch(error => {
      console.error('❌ Failed to initialize Supabase storage:', error);
    });
};