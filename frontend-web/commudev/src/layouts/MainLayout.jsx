// src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/navigation/Sidebar';
import NavigationBar from '../components/navigation/NavigationBar';
import NotificationBell from '../components/notifications/NotificationBell';
import '../styles/layouts/mainLayout.css';

const MainLayout = ({ children, rightSidebar, sidebar }) => {
  return (
    <div className="main-layout">
      {/* Use custom sidebar if provided, otherwise use default Sidebar */}
      {sidebar || <Sidebar />}
      
      <div className="main-content">
        <div className="top-navigation-bar">
          <NavigationBar />
          <div className="top-nav-actions">
            <NotificationBell />
            {/* Add other top nav actions here if needed */}
          </div>
        </div>
        <div className="content-container">
          {children}
        </div>
      </div>
      
      {rightSidebar && (
        <div className="right-sidebar">
          {rightSidebar}
        </div>
      )}
    </div>
  );
};

export default MainLayout;