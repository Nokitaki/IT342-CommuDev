// src/components/notifications/NotificationItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { formatTimeAgo } from '../../utils/dateUtils';
import useNotifications from '../../hooks/useNotifications';
import '../../styles/components/notificationItem.css';
import API_URL from '../../config/apiConfig';

const NotificationItem = ({ notification, onClose }) => {
  const navigate = useNavigate();
  const { handleMarkAsRead, handleDeleteNotification } = useNotifications();
  

  
  const handleClick = async () => {
    // Mark notification as read
    await handleMarkAsRead(notification.notificationId);
    
    // Close the dropdown if provided
    if (onClose) {
      onClose();
    }
    
    // Navigate based on notification type
    if (notification.notificationType === 'COMMENT' && notification.relatedPostId) {
      navigate(`/post/${notification.relatedPostId}`, { 
        state: { 
          fromNotification: true,
          highlightCommentId: notification.relatedCommentId
        } 
      });
    } else if (notification.notificationType === 'LIKE' && notification.relatedPostId) {
      navigate(`/post/${notification.relatedPostId}`, { 
        state: { 
          fromNotification: true
        } 
      });
    }
  };
  
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    
    await handleDeleteNotification(notification.notificationId);
    
    // No need to close dropdown here since the item will be removed from the list
  };
  
  // Get actor's profile picture
  const getActorProfilePicture = () => {
    if (notification.actor && notification.actor.profilePicture) {
      return notification.actor.profilePicture.startsWith('http') 
        ? notification.actor.profilePicture 
        : `${API_URL}${notification.actor.profilePicture}`;
    }
    return '../../../public/assets/images/profile/default-avatar.png';
  };
  
  // Get icon based on notification type
  const getNotificationIcon = () => {
    switch (notification.notificationType) {
      case 'COMMENT':
        return (
          <div className="notification-icon comment-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </div>
        );
      case 'LIKE':
        return (
          <div className="notification-icon like-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="notification-icon default-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div 
      className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
      onClick={handleClick}
    >
      <Avatar 
        src={getActorProfilePicture()} 
        alt={notification.actor?.username || "User"} 
        size="small"
      />
      
      <div className="notification-content">
        <div className="notification-text">{notification.notificationText}</div>
        <div className="notification-time">{formatTimeAgo(notification.createdAt)}</div>
      </div>
      
      {getNotificationIcon()}
      
      <button 
        className="delete-notification-button"
        onClick={handleDelete}
        aria-label="Delete notification"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      </button>
    </div>
  );
};

export default NotificationItem;