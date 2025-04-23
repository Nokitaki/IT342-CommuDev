// src/components/notifications/NotificationDropdown.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useNotifications from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import '../../styles/components/notificationDropdown.css';

const NotificationDropdown = ({ onClose }) => {
  const { 
    notifications, 
    loading, 
    error, 
    fetchNotifications, 
    handleDeleteAllNotifications 
  } = useNotifications();
  
  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  const onDeleteAllNotifications = async () => {
    await handleDeleteAllNotifications();
  };
  
  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <h3>Notifications</h3>
        <button 
          className="delete-all-button" 
          onClick={onDeleteAllNotifications}
        >
          Delete notifications
        </button>
      </div>
      
      <div className="notification-dropdown-content">
        {loading ? (
          <div className="notification-loading">Loading notifications...</div>
        ) : error ? (
          <div className="notification-error">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">No notifications yet</div>
        ) : (
          <div className="notification-list">
            {notifications.map(notification => (
              <NotificationItem 
                key={notification.notificationId} 
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="notification-dropdown-footer">
        <Link to="/notifications" className="see-all-link" onClick={onClose}>
          See all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;