// src/routes/index.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NewsfeedPage from '../pages/newsfeed/NewsfeedPage';
import ResourcesPage from '../pages/resources/ResourcesPage';
import MessagesPage from '../pages/messages/MessagesPage';
import { isLoggedIn } from '../services/authService';

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public route - redirects to newsfeed if already logged in
const PublicRoute = ({ children }) => {
  if (isLoggedIn()) {
    // Redirect to newsfeed if already authenticated
    return <Navigate to="/newsfeed" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/newsfeed" 
          element={
            <ProtectedRoute>
              <NewsfeedPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/resources" 
          element={
            <ProtectedRoute>
              <ResourcesPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;