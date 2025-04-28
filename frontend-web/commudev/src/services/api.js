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


  export const safeFetch = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        ...options,
        headers: {
          ...options.headers
        }
      });
      return response;
    } catch (error) {
      console.error(`Network error accessing ${url}:`, error);
      // Return a fake response object that can be handled consistently
      return {
        ok: false,
        status: 0,
        statusText: 'Network Error',
        json: async () => ({ error: 'Network Error - Server unreachable' })
      };
    }
  };





  export const testBackendConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/public/health`, { 
        method: 'GET',
        mode: 'cors'
      });
      
      if (response.ok) {
        console.log('✅ Backend connection successful');
        return true;
      } else {
        console.error('❌ Backend returned error:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Cannot connect to backend:', error);
      return false;
    }
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


  export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? {
      'Authorization': `Bearer ${token}`
    } : {};
  };


  // Add to api.js or create it if needed
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('expirationTime');
  console.log('Auth data cleared');
};

export const isTokenExpired = () => {
  const expTime = localStorage.getItem('expirationTime');
  if (!expTime) return true;
  return new Date().getTime() > parseInt(expTime, 10);
};