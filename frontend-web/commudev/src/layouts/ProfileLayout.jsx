// src/layouts/ProfileLayout.jsx
import React from 'react';
import NavigationBar from '../components/navigation/NavigationBar';
import Sidebar from '../components/navigation/Sidebar';
import '../styles/layouts/profileLayout.css';

const ProfileLayout = ({ children, rightSidebar }) => {
  return (
    <div className="profile-layout">
      {/* Left sidebar */}
      <div className="profile-layout__sidebar">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="profile-layout__main">
        <NavigationBar />
        <div className="profile-layout__content">
          {children}
        </div>
      </div>
      
      {/* Right sidebar */}
      {rightSidebar && (
        <div className="profile-layout__right-sidebar">
          {rightSidebar}
        </div>
      )}
    </div>
  );
};

export default ProfileLayout;
