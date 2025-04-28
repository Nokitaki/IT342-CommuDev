// src/utils/assetUtils.js
import API_URL from '../config/apiConfig';
import ASSETS_URL from '../config/assetConfig';

// Helper function to get profile picture with fallback
export const getProfilePicture = (user) => {
  if (user?.profilePicture) {
    return user.profilePicture.startsWith('http') 
      ? user.profilePicture 
      : `${API_URL}${user.profilePicture}`;
  }
  return `${ASSETS_URL}/assets/images/profile/default-avatar.png`;
};

// Helper function to get cover photo with fallback
export const getCoverPhoto = (user) => {
  if (user?.coverPhoto) {
    return user.coverPhoto.startsWith('http') 
      ? user.coverPhoto 
      : `${API_URL}${user.coverPhoto}`;
  }
  return `${ASSETS_URL}/assets/images/profile/coverphoto.jpg`;
};

// Helper function for general static assets
export const getAssetUrl = (path) => {
  return `${ASSETS_URL}${path}`;
};