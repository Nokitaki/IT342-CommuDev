// src/pages/LoginPage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  const location = useLocation();
  
  // Check if we were redirected from registration with a username
  const redirectedUsername = location.state?.username;
  
  useEffect(() => {
    // Set page title
    document.title = 'Login | CommuDev';
  }, []);

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Login to your account"
    >
      <LoginForm initialUsername={redirectedUsername} />
    </AuthLayout>
  );
};

export default LoginPage;