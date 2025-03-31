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
    // Return mock data for frontend development
    // REMOVED: API call to backend
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
      lastname: 'Doe'
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Invalid username or password.');
  }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise with registration status
 */
export const register = async (userData) => {
  try {
    // Return mock data for frontend development
    // REMOVED: API call to backend
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
    throw new Error(error.response?.data?.message || 'An error occurred during registration.');
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
  return !!localStorage.getItem('userId');
};