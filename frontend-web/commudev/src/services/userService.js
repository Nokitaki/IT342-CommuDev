// src/services/userService.js

const API_URL = 'http://localhost:8080';

/**
 * Fetch all users from the system
 * @returns {Promise<Array>} Promise with array of users
 */
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/users/all`, {
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
    console.error('Error fetching users:', error);
    return []; // Return empty array on error to prevent UI disruption
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