// src/components/friends/FriendsSidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import useFriends from '../../hooks/useFriends';
import '../../styles/components/friendsSidebar.css';
import API_URL from '../../config/apiConfig';

const FriendsSidebar = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'requests'
  
  // Use our custom hook for managing friends
  const { 
    friends, 
    pendingRequests, 
    loading, 
    error,
    handleAcceptRequest,
    handleRejectRequest
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
  
  return (
    <div className="friends-section">
      <div className="friends-header">
        <h3>FRIENDS</h3>
        <Link to="/friends" className="see-all-link">See All</Link>
      </div>
      
      {/* Tab navigation */}
      <div className="friends-tabs">
        <button 
          className={`friends-tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends
        </button>
        <button 
          className={`friends-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests
          {pendingRequests && pendingRequests.length > 0 && (
            <span className="request-count">{pendingRequests.length}</span>
          )}
        </button>
      </div>
      
      <div className="scrollable-friends-list">
        {loading ? (
          <div className="friends-loading">Loading...</div>
        ) : error ? (
          <div className="friends-error">{error}</div>
        ) : activeTab === 'friends' ? (
          // Friends list
          friends.length > 0 ? (
            friends.map(friend => (
              <Link 
                to={`/profiles/${friend.username}`} 
                key={friend.id} 
                className="friend-item"
              >
                <Avatar
                  src={getProfilePicture(friend)}
                  alt={getUserName(friend)}
                  size="small"
                  showStatus={true}
                  isOnline={friend.isOnline || false}
                />
                <span className="friend-name">
                  {getUserName(friend)}
                </span>
              </Link>
            ))
          ) : (
            <div className="no-friends-message">No friends added yet</div>
          )
        ) : (
          // Friend requests list
          pendingRequests && pendingRequests.length > 0 ? (
            pendingRequests.map(request => (
              <div key={request.id} className="friend-request-item">
                <div className="friend-request-user">
                  <Avatar
                    src={getProfilePicture(request.sender)}
                    alt={getUserName(request.sender)}
                    size="small"
                  />
                  <span className="friend-request-name">
                    {getUserName(request.sender)}
                  </span>
                </div>
                <div className="friend-request-actions">
                  <button 
                    className="accept-request-btn"
                    onClick={() => handleAcceptRequest(request.id)}
                    title="Accept friend request"
                  >
                    ✓
                  </button>
                  <button 
                    className="reject-request-btn"
                    onClick={() => handleRejectRequest(request.id)}
                    title="Reject friend request"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-requests-message">No pending friend requests</div>
          )
        )}
      </div>
    </div>
  );
};

export default FriendsSidebar;