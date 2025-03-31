// src/utils/validation.js

/**
 * Validates login form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} An object with isValid boolean and error message
 */
export const validateLoginForm = (formData) => {
    if (!formData.username) {
      return { isValid: false, error: 'Username is required.' };
    }
    
    if (!formData.password) {
      return { isValid: false, error: 'Password is required.' };
    }
    
    if (formData.password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long.' };
    }
    
    return { isValid: true, error: '' };
  };
  
  /**
   * Validates register form data
   * @param {Object} formData - The form data to validate
   * @returns {Object} An object with isValid boolean and error message
   */
  export const validateRegisterForm = (formData) => {
    if (!formData.username) {
      return { isValid: false, error: 'Username is required.' };
    }
    
    if (!formData.password) {
      return { isValid: false, error: 'Password is required.' };
    }
    
    if (formData.password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long.' };
    }
    
    if (!formData.firstname) {
      return { isValid: false, error: 'First name is required.' };
    }
    
    if (!formData.lastname) {
      return { isValid: false, error: 'Last name is required.' };
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      return { isValid: false, error: 'Please enter a valid email address.' };
    }
    
    if (formData.age && (isNaN(formData.age) || formData.age < 0)) {
      return { isValid: false, error: 'Please enter a valid age.' };
    }
    
    return { isValid: true, error: '' };
  };