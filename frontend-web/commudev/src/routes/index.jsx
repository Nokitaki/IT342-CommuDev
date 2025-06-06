// src/routes/index.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NewsfeedPage from '../pages/newsfeed/NewsfeedPage';
import ResourcesPage from '../pages/resources/ResourcesPage';
import MessagesPage from '../pages/messages/MessagesPage';
import ProfilePage from '../pages/profile/ProfilePage';
import PublicProfilePage from '../pages/profile/PublicProfilePage';
import NotificationsPage from '../components/notifications/NotificationsPage';
import PostPage from '../pages/post/PostPage';
import AllUsersPage from '../pages/users/AllUsersPage';
import FriendsPage from '../pages/friends/FriendsPage';
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
        
        {/* Public profile page - accessible to anyone */}
        <Route path="/profiles/:username" element={<PublicProfilePage />} />
        
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

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* New route for Friends page */}
        <Route 
          path="/friends" 
          element={
            <ProtectedRoute>
              <FriendsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Route for All Users page */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <AllUsersPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Notification routes */}
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Individual post route */}
        <Route 
          path="/post/:postId" 
          element={
            <ProtectedRoute>
              <PostPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes