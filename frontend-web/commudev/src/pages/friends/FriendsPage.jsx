// src/pages/friends/FriendsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import UserProfileModal from '../../components/modals/UserProfileModal';
import useFriends from '../../hooks/useFriends';
import { getUserById } from '../../services/userService';
import '../../styles/pages/friendsPage.css';
import API_URL from '../../config/apiConfig';


const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'requests'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const { 
    friends = [], 
    pendingRequests = [], 
    loading, 
    error, 
    handleAcceptRequest, 
    handleRejectRequest,
    handleRemoveFriend,
    refreshFriendsData
  } = useFriends();
  

  
  // Get user's full name
  const getUserName = (user) => {
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.firstname) {
      return user.firstname;
    } else {
      return user.username;
    }
  };
  
  // Get user's profile picture
  const getProfilePicture = (user) => {
    if (user.profilePicture) {
      return user.profilePicture.startsWith('http') 
        ? user.profilePicture 
        : `${API_URL}${user.profilePicture}`;
    }
    return '../../../public/assets/images/profile/default-avatar.png';
  };
  
  // Filter friends or requests based on search term
  const filterUsers = (users) => {
    if (!searchTerm) return users;
    
    return users.filter(user => {
      const fullName = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase();
      const username = (user.username || '').toLowerCase();
      
      return fullName.includes(searchTerm.toLowerCase()) || 
             username.includes(searchTerm.toLowerCase());
    });
  };
  
  // Handle viewing a user's profile
  const handleViewProfile = async (user) => {
    try {
      // Try to get more detailed user data first
      const detailedUser = await getUserById(user.id);
      setSelectedUser(detailedUser || user);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Fallback to basic user data
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };
  
  // Handle accepting a friend request
  const onAcceptRequest = async (requestId) => {
    const success = await handleAcceptRequest(requestId);
    if (success) {
      refreshFriendsData();
    }
  };
  
  // Handle rejecting a friend request
  const onRejectRequest = async (requestId) => {
    const success = await handleRejectRequest(requestId);
    if (success) {
      refreshFriendsData();
    }
  };
  
  // Handle removing a friend
  const onRemoveFriend = async (friendId) => {
    if (window.confirm("Are you sure you want to remove this friend?")) {
      const success = await handleRemoveFriend(friendId);
      if (success) {
        refreshFriendsData();
      }
    }
  };
  
  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  
  // Render content based on active tab and loading state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="friends-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="friends-error">
          <p>{error}</p>
          <Button 
            variant="primary" 
            onClick={refreshFriendsData}
          >
            Try Again
          </Button>
        </div>
      );
    }
    
    if (activeTab === 'friends') {
      const filteredFriends = filterUsers(friends);
      
      if (filteredFriends.length === 0) {
        return (
          <div className="friends-empty">
            <div className="empty-friends-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#9e9e9e">
                <path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"/>
              </svg>
            </div>
            <h3>No friends found</h3>
            {searchTerm ? (
              <p>No friends match your search criteria.</p>
            ) : (
              <>
                <p>You haven't added any friends yet.</p>
                <p>Try checking the "People You May Know" section.</p>
              </>
            )}
          </div>
        );
      }
      
      return (
        <div className="friends-grid">
          {filteredFriends.map(friend => (
            <div key={friend.id} className="friend-card">
              <div 
                className="friend-card-content"
                onClick={() => handleViewProfile(friend)}
              >
                <div className="friend-avatar">
                  <Avatar 
                    src={getProfilePicture(friend)}
                    alt={getUserName(friend)}
                    size="large"
                    showStatus={true}
                    isOnline={friend.isOnline || false}
                  />
                </div>
                <div className="friend-info">
                  <h3 className="friend-name">{getUserName(friend)}</h3>
                  <p className="friend-username">@{friend.username}</p>
                  {friend.biography && (
                    <p className="friend-bio">{friend.biography}</p>
                  )}
                </div>
              </div>
              <div className="friend-actions">
                <Link to={`/profiles/${friend.username}`} className="view-profile-btn">
                  View Profile
                </Link>
                <button 
                  className="remove-friend-btn"
                  onClick={() => onRemoveFriend(friend.id)}
                >
                  Remove Friend
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    } else { // Requests tab
      if (pendingRequests.length === 0) {
        return (
          <div className="friends-empty">
            <div className="empty-requests-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#9e9e9e">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <h3>No pending friend requests</h3>
            <p>When someone sends you a friend request, it will appear here.</p>
          </div>
        );
      }
      
      const filteredRequests = filterUsers(pendingRequests.map(request => request.sender));
      
      if (filteredRequests.length === 0 && searchTerm) {
        return (
          <div className="friends-empty">
            <h3>No requests match your search</h3>
            <p>Try a different search term or clear the search.</p>
          </div>
        );
      }
      
      return (
        <div className="requests-list">
          {pendingRequests
            .filter(request => {
              const sender = request.sender;
              if (!searchTerm) return true;
              
              const fullName = `${sender.firstname || ''} ${sender.lastname || ''}`.toLowerCase();
              const username = (sender.username || '').toLowerCase();
              
              return fullName.includes(searchTerm.toLowerCase()) || 
                    username.includes(searchTerm.toLowerCase());
            })
            .map(request => (
              <div key={request.id} className="request-item">
                <div 
                  className="request-user-info"
                  onClick={() => handleViewProfile(request.sender)}
                >
                  <Avatar 
                    src={getProfilePicture(request.sender)}
                    alt={getUserName(request.sender)}
                    size="medium"
                  />
                  <div className="request-user-details">
                    <h3 className="request-user-name">{getUserName(request.sender)}</h3>
                    <p className="request-user-username">@{request.sender.username}</p>
                    <p className="request-time">
                      Sent {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="request-actions">
                  <button 
                    className="accept-request-button"
                    onClick={() => onAcceptRequest(request.id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="reject-request-button"
                    onClick={() => onRejectRequest(request.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
        </div>
      );
    }
  };
  
  return (
    <MainLayout>
      <div className="friends-page">
        <div className="friends-header">
          <h1>Friends</h1>
          <div className="friends-search">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="friends-search-input"
            />
            <svg className="friends-search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            {searchTerm && (
              <button 
                className="friends-search-clear" 
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        <div className="friends-tabs">
        <button 
  className={`friends-tab ${activeTab === 'friends' ? 'active' : ''}`}
  onClick={() => setActiveTab('friends')}
>
  Friends
  <span className="tab-count">{friends?.length || 0}</span>
</button>
<button 
  className={`friends-tab ${activeTab === 'requests' ? 'active' : ''}`}
  onClick={() => setActiveTab('requests')}
>
  Friend Requests
  {pendingRequests?.length > 0 && (
    <span className="tab-count">{pendingRequests.length}</span>
  )}
</button>
        </div>
        
        <div className="friends-content">
          {renderContent()}
        </div>
      </div>
      
      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        user={selectedUser} 
      />
    </MainLayout>
  );
};

export default FriendsPage;