// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user';

/**
 * Login user
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise} Promise with user data
 */
export const login = async (username, password) => {
  try {
    // COMMENTED: Real API call
    /* 
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });
    return response.data;
    */
    
    // Mock successful login for frontend development
    console.log('Mock login with:', username, password);
    return {
      id: 1,
      username: username,
      firstname: 'John',
      lastname: 'Doe',
      profilePicture: null
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid username or password.');
  }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise with registration status
 */
export const register = async (userData) => {
  try {
    // COMMENTED: Real API call
    /*
    const response = await axios.post(`${API_URL}/add`, {
      ...userData,
      age: userData.age ? parseInt(userData.age) : null
    });
    return response.data;
    */
    
    // Mock successful registration for frontend development
    console.log('Mock registration with data:', userData);
    return {
      success: true,
      message: 'Registration successful'
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('An error occurred during registration.');
  }
};

/**
 * Get user data by ID
 * @returns {Promise} Promise with user data
 */
export const getUserData = async () => {
  try {
    // COMMENTED: Real API call
    /*
    const userId = localStorage.getItem('userId');
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
    */
    
    // Return mock user data
    return {
      id: 1,
      username: 'testuser',
      firstname: 'John',
      lastname: 'Doe',
      profilePicture: null
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Store user session data
 * @param {Object} userData - User data to store
 */
export const storeUserData = (userData) => {
  localStorage.setItem('userId', userData.id.toString());
  localStorage.setItem('username', userData.username);
};

/**
 * Clear user session data
 */
export const clearUserData = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
  // COMMENTED: Real implementation
  // return !!localStorage.getItem('userId');
  
  // For testing: always return true to simulate logged in state
  return true;
};