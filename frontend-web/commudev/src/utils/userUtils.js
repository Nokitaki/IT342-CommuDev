// src/utils/userUtils.js

/**
 * Normalize user ID to ensure consistent format (string)
 * @param {any} id - User ID to normalize
 * @returns {string|null} - Normalized user ID or null if invalid
 */
export const normalizeUserId = (id) => {
  if (id === null || id === undefined) return null;
  return id.toString();
};

/**
 * Get user display name from user object
 * @param {Object} user - User object with firstname, lastname, username props
 * @returns {string} - Formatted user display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'User';
  
  if (user.firstname && user.lastname) {
    return `${user.firstname} ${user.lastname}`;
  } else if (user.firstname) {
    return user.firstname;
  } else if (user.username) {
    return user.username;
  }
  
  return 'User';
};

/**
 * Get the current user ID from various sources
 * @param {Object} profile - User profile object
 * @returns {string|null} - User ID or null if not available
 */
export const getCurrentUserId = (profile) => {
  // Try from profile
  if (profile?.id) {
    return normalizeUserId(profile.id);
  }
  
  // Try from localStorage
  const localStorageId = localStorage.getItem('userId');
  if (localStorageId) {
    return normalizeUserId(localStorageId);
  }
  
  // Try from Firebase Auth
  const firebaseUser = auth?.currentUser;
  if (firebaseUser?.uid) {
    return firebaseUser.uid;
  }
  
  return null;
};