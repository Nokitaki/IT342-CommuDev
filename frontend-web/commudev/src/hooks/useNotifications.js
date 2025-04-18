// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { 
  getAllNotifications, 
  getUnreadNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead,
  deleteNotification
} from '../services/notificationService';

/**
 * Hook for managing notifications
 * @returns {Object} Notifications state and methods
 */
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread notifications
  const fetchUnreadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getUnreadNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching unread notifications:', err);
      setError('Failed to load unread notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
      return count;
    } catch (err) {
      console.error('Error fetching unread count:', err);
      return 0;
    }
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.notificationId === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      // Update unread count
      fetchUnreadCount();
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
      return false;
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      
      // Update local state - mark all notifications as read
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Update unread count - set to 0 since all are read
      setUnreadCount(0);
      
      // Force a refresh of the notifications
      refreshNotifications();
      
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read');
      return false;
    }
  };

  // Delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      
      // Remove from local state
      setNotifications(prev => 
        prev.filter(notification => notification.notificationId !== notificationId)
      );
      
      // Update unread count if the deleted notification was unread
      fetchUnreadCount();
      
      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
      return false;
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    setLastRefresh(Date.now());
  };

  // Initial load
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Set up polling for new notifications (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchNotifications, fetchUnreadCount, lastRefresh]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadNotifications,
    fetchUnreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    refreshNotifications
  };
};

export default useNotifications;