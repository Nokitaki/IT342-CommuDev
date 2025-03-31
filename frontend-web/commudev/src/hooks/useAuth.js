// src/hooks/useAuth.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, storeUserData, clearUserData } from '../services/authService';
import { validateLoginForm, validateRegisterForm } from '../utils/validation';

const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handle login submission
   * @param {Object} formData - Login form data
   * @param {Function} callback - Optional callback after success
   */
  const handleLogin = async (formData, callback) => {
    // Validate form data
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const userData = await login(formData.username, formData.password);
      storeUserData(userData);
      setSuccessMessage('Login successful!');
      
      if (callback) {
        callback(userData);
      } else {
        // Default behavior: navigate to newsfeed after 1 second
        setTimeout(() => {
          navigate('/newsfeed');
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle registration submission
   * @param {Object} formData - Registration form data
   * @param {Function} callback - Optional callback after success
   */
  const handleRegister = async (formData, callback) => {
    // Validate form data
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await register(formData);
      setSuccessMessage('Registration successful! Please login.');
      
      if (callback) {
        callback();
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    clearUserData();
    navigate('/login');
  };

  return {
    loading,
    error,
    successMessage,
    handleLogin,
    handleRegister,
    handleLogout,
    setError,
    setSuccessMessage
  };
};

export default useAuth;