// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../services/authService';

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
      const data = await getUserProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const updatedProfile = await updateUserProfile(profileData);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePicture = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const updatedProfile = await uploadProfilePicture(file);
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

  return {
    profile,
    loading,
    error,
    success,
    fetchProfile,
    updateProfile,
    updatePicture
  };
};

export default useProfile;