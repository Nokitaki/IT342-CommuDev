// src/pages/RegisterPage.jsx
import React, { useEffect } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Register | CommuDev';
  }, []);

  return (
    <AuthLayout 
      title="Create Account"
      subtitle="Sign up to get started"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;