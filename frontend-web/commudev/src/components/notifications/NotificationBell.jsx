// src/components/notifications/NotificationBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import useNotifications from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';
import '../../styles/components/notificationBell.css';

const NotificationBell = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const bellRef = useRef(null);
  
  // Fetch unread count when component mounts
  useEffect(() => {
    fetchUnreadCount();
    
    // Set up interval to check for new notifications
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchUnreadCount]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  return (
    <div className="notification-bell-container" ref={bellRef}>
      <button className="notification-bell-button" onClick={toggleDropdown}>
        <svg className="notification-bell-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>
      
      {dropdownOpen && <NotificationDropdown onClose={() => setDropdownOpen(false)} />}
    </div>
  );
};

export default NotificationBell;