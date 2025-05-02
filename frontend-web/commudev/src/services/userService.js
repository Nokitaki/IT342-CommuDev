import API_URL from '../config/apiConfig.js';

/**
 * Fetch all users from the system
 * @returns {Promise<Array>} Promise with array of users
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Fetch users with pagination
 * @param {number} page - Page number (starting from 0)
 * @param {number} size - Number of users per page
 * @returns {Promise<Object>} Promise with paginated users data
 */
export const getPaginatedUsers = async (page = 0, size = 10) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/users/paginated?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching paginated users:', error);
    return { content: [], totalElements: 0, totalPages: 0 }; // Return empty data on error
  }
};


// Add this to your existing userService.js file

/**
 * Get user details by ID
 * @param {string|number} userId - User ID to fetch details for
 * @returns {Promise<Object>} User details
 */
export const getUserById = async (userId) => {
  try {
    // First try the authenticated endpoint for complete data
    const token = localStorage.getItem('token');
    if (token) {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log("Fetched full user profile:", userData);
        return userData;
      }
    }
    
    // Fallback: Try the public profile endpoint
    const profileResponse = await fetch(`${API_URL}/users/profiles/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log("Fetched public profile:", profileData);
      return profileData;
    }
    
    // Last resort: Use all users endpoint
    const allUsers = await getAllUsers();
    const user = allUsers.find(u => u.id == userId);
    if (user) {
      console.log("Found user in all users list:", user);
      return user;
    }
    
    throw new Error('User not found');
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

/**
 * Get user details by username
 * @param {string} username - Username to fetch details for
 * @returns {Promise<Object>} User details
 */
export const getUserByUsername = async (username) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/profiles/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user details for ${username}:`, error);
    
    // Fallback: Try to find the user in the list of all users
    try {
      const allUsers = await getAllUsers();
      const user = allUsers.find(u => u.username === username);
      if (user) {
        return user;
      }
    } catch (err) {
      console.error('Error in fallback fetch:', err);
    }
    
    // Return a default user object to prevent UI errors
    return {
      username: username,
      firstname: '',
      lastname: '',
      profilePicture: null
    };
  }
};