// src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/navigation/Sidebar';
import NavigationBar from '../components/navigation/NavigationBar';
import '../styles/layouts/mainLayout.css';

const MainLayout = ({ children, rightSidebar }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <NavigationBar />
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