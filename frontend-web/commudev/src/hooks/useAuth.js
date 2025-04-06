// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  login, 
  register, 
  logout, 
  isLoggedIn, 
  verifyUser, 
  resendVerificationCode 
} from '../services/authService';

const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  
  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(isLoggedIn());
    };
    
    // Initial check
    checkAuthStatus();
    
    // Set up event listener for changes in localStorage
    window.addEventListener('storage', checkAuthStatus);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);
  
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await login(credentials.username, credentials.password);
      
      setIsAuthenticated(true);
      setSuccess('Login successful!');
      
      // Redirect to newsfeed
      setTimeout(() => {
        navigate('/newsfeed');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      
      // Check if the error indicates verification needed
      if (err.message && err.message.includes('not verified')) {
        setNeedsVerification(true);
        setPendingVerificationEmail(credentials.username);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await register(userData);
      
      setSuccess('Registration successful! Please check your email for verification.');
      setNeedsVerification(true);
      setPendingVerificationEmail(userData.email);
      
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerify = async (email, code) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await verifyUser(email, code);
      
      setSuccess('Account verified successfully! You can now login.');
      setNeedsVerification(false);
      setPendingVerificationEmail('');
      
      return true;
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = async (email) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await resendVerificationCode(email);
      
      setSuccess('Verification code has been sent to your email.');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to resend verification code.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/login');
  };
  
  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);
  
  return {
    loading,
    error,
    success,
    isAuthenticated,
    needsVerification,
    pendingVerificationEmail,
    handleLogin,
    handleRegister,
    handleVerify,
    handleResendCode,
    handleLogout,
    setError,
    setSuccess
  };
};

export default useAuth;