// src/layouts/MessageLayout.jsx
import React from 'react';
import MainLayout from './MainLayout';
import '../styles/layouts/messagesLayout.css';

const MessageLayout = ({ leftSidebar, children, rightSidebar }) => {
  // Use the MainLayout as the base and add message-specific styling
  return (
    <MainLayout
      // Override the sidebar with our custom message sidebar
      sidebar={
        <div className="message-layout__left-sidebar">
          {leftSidebar}
        </div>
      }
      // Add the main message content
      children={
        <div className="message-layout__content">
          {children}
        </div>
      }
      // Use the rightSidebar if provided
      rightSidebar={
        rightSidebar && (
          <div className="message-layout__right-sidebar">
            {rightSidebar}
          </div>
        )
      }
    />
  );
};

export default MessageLayout;