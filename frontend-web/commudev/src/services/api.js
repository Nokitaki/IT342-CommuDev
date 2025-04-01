// src/services/api.js

/**
 * Get API configuration with auth headers if available
 * @returns {Object} axios config object
 */
export const getApiConfig = () => {
    const userId = localStorage.getItem('userId');
    
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (userId) {
      config.headers['Authorization'] = `Bearer ${userId}`;
    }
    
    return config;
  };
  
  /**
   * Handle API errors consistently
   * @param {Error} error - Error object from axios
   * @returns {Object} Formatted error object
   */
  export const handleApiError = (error) => {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with a status code outside of 2xx
      message = error.response.data?.message || 
                `Error ${error.response.status}: ${error.response.statusText}`;
                
      // Authentication errors
      if (error.response.status === 401 || error.response.status === 403) {
        return { 
          message: 'Your session has expired. Please login again.',
          isAuthError: true 
        };
      }
    } else if (error.request) {
      // The request was made but no response was received
      message = 'No response from server. Please check your connection.';
    }
    
    return {
      message,
      isAuthError: false,
      originalError: error
    };
  };