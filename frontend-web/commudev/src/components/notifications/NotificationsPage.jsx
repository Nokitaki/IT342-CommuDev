// src/pages/notifications/NotificationsPage.jsx
import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import NotificationItem from '../../components/notifications/NotificationItem';
import Button from '../../components/common/Button';
import useNotifications from '../../hooks/useNotifications';
import '../../styles/components/notifications.css';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    fetchUnreadNotifications,
    handleDeleteAllNotifications
  } = useNotifications();

  // Fetch notifications based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      fetchNotifications();
    } else {
      fetchUnreadNotifications();
    }
  }, [activeTab, fetchNotifications, fetchUnreadNotifications]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDeleteAll = async () => {
    await handleDeleteAllNotifications();
    // Refresh notifications after deleting all
    if (activeTab === 'all') {
      fetchNotifications();
    } else {
      // If we're on unread tab, there will be no notifications after deleting all
      fetchUnreadNotifications();
    }
  };

  return (
    <MainLayout>
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <Button 
            variant="primary" 
            onClick={handleDeleteAll}
            disabled={loading || notifications.length === 0}
          >
            Delete notifications
          </Button>
        </div>

        <div className="notifications-tabs">
          <div
            className={`notifications-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All
          </div>
          <div
            className={`notifications-tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => handleTabChange('unread')}
          >
            Unread
          </div>
        </div>

        <div className="notifications-content">
          {loading ? (
            <div className="notifications-loading">
              <div className="loading-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="notifications-error">
              <p>{error}</p>
              <Button
                variant="secondary"
                onClick={() => activeTab === 'all' ? fetchNotifications() : fetchUnreadNotifications()}
              >
                Try again
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notifications-empty">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              <p>{activeTab === 'all' ? 'No notifications yet' : 'No unread notifications'}</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.notificationId}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;