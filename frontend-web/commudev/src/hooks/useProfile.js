// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfilePicture,
  uploadCoverPhoto,
  removeProfilePicture
} from '../services/authService';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try logging in again.');
        // Redirect to login if we get an auth error
        if (err.message === 'Failed to fetch profile') {
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setLoading(false);
      setError('An unexpected error occurred');
    }
  };

  const updatePicture = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Handle both FormData objects and File objects
      let formData;
      if (file instanceof FormData) {
        formData = file;
      } else {
        formData = new FormData();
        formData.append('file', file);
      }
      
      const updatedProfile = await uploadProfilePicture(formData);
      setProfile(updatedProfile);
      setSuccess('Profile picture updated successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to upload picture');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCoverPhoto = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Handle both FormData objects and File objects
      let formData;
      if (file instanceof FormData) {
        formData = file;
      } else {
        formData = new FormData();
        formData.append('file', file);
      }
      
      const updatedProfile = await uploadCoverPhoto(formData);
      setProfile(updatedProfile);
      setSuccess('Cover photo updated successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to upload cover photo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePicture = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const updatedProfile = await removeProfilePicture();
      setProfile(updatedProfile);
      setSuccess('Profile picture removed successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to remove profile picture');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const freshData = await getUserProfile();
      setProfile(freshData);
      return true;
    } catch (err) {
      console.error('Failed to refresh profile:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);


  const updateProfile = async (profileData) => {
  try {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Clean empty values to prevent overwrites with empty strings
    const cleanProfileData = Object.fromEntries(
      Object.entries(profileData).filter(([_, value]) => 
        value !== '' && value !== null && value !== undefined
      )
    );
    
    console.log('Cleaned profile data for update:', cleanProfileData);
    
    const updatedProfile = await updateUserProfile(cleanProfileData);
    setProfile(updatedProfile);
    setSuccess('Profile updated successfully!');
    return true;
  } catch (err) {
    console.error('Failed to update profile:', err);
    setError(err.message || 'Failed to update profile');
    return false;
  } finally {
    setLoading(false);
  }
};

  return {
    profile,
    loading,
    error,
    success,
    fetchProfile,
    refreshProfile,
    updateProfile,
    updatePicture,
    updateCoverPhoto,
    deletePicture,
    setError,
    setSuccess
  };
};

export default useProfile;