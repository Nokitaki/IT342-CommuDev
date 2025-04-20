// src/services/userService.js

const API_URL = 'http://localhost:8080';

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
    // Try first with the all users endpoint since it's public
    const allUsers = await getAllUsers();
    const user = allUsers.find(u => u.id == userId); // Use loose equality for string/number conversion
    
    if (user) {
      return user;
    }
    
    // If not found in the public list, try with authentication if available
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          return userData;
        } else {
          console.log(`Failed to fetch user with status: ${response.status}`);
          // If we get a 404, try one more approach with the /all endpoint
          if (response.status === 404) {
            // Refresh the all users list and try again (they might have been added recently)
            const refreshedUsers = await getAllUsers();
            const refreshedUser = refreshedUsers.find(u => u.id == userId);
            if (refreshedUser) return refreshedUser;
          }
        }
      } catch (err) {
        console.log('User fetch with token failed:', err);
      }
    }
    
    throw new Error('User not found');
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};