// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  login,
  register,
  getUserData,
  storeUserData,
  clearUserData,
  isLoggedIn
} from '../services/authService';

const useAuth = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in and fetch their data
    if (isLoggedIn()) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await getUserData();
      setUserData(data);
      
      if (data?.profilePicture) {
        setProfilePicture(`http://localhost:8080${data.profilePicture}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      // If unauthorized, log user out
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const handleLogin = async (formData, callback) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const userData = await login(formData.username, formData.password);
      setUserData(userData);
      
      if (userData?.profilePicture) {
        setProfilePicture(`http://localhost:8080${userData.profilePicture}`);
      }
      
      storeUserData(userData);
      setSuccessMessage('Login successful!');
      
      if (callback) {
        callback(userData);
      } else {
        // Default: navigate to newsfeed after successful login
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

  const handleRegister = async (formData, callback) => {
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

  const handleLogout = () => {
    clearUserData();
    setUserData(null);
    setProfilePicture(null);
    navigate('/login');
  };

  return {
    userData,
    profilePicture,
    loading,
    error,
    successMessage,
    handleLogin,
    handleRegister,
    handleLogout,
    setError,
    setSuccessMessage,
    fetchUserData
  };
};

export default useAuth;