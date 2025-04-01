// src/components/newsfeed/NotificationItem.jsx
import React from 'react';
import Avatar from '../common/Avatar';
import '../../styles/components/notification.css';

const NotificationItem = ({ notification }) => {
  return (
    <div className="notification-item">
      <div className="notification-header">
      <Avatar 
        src={notification.image ? `/src/assets/images/profile/${notification.image}` : '/src/assets/images/profile/default-avatar.png'} 
        alt={`${notification.user}'s profile`} 
        size="small" 
      />
        <div className="notification-info">
          <span className="notification-username">{notification.user}</span>
          <span className="notification-time">{notification.time}</span>
        </div>
      </div>
      <p className="notification-message">{notification.message}</p>
    </div>
  );
};

export default NotificationItem;