// src/components/friends/FriendsSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';

const FriendsSidebar = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // API URL for images
  const API_URL = 'http://localhost:8080';
  
  useEffect(() => {
    // Mock fetch friends - will be replaced with actual API call later
    const fetchFriends = async () => {
      try {
        setLoading(true);
        
        // This is a placeholder. In the future, you'll fetch real friend data
        // from your backend API
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, we'll just set empty array since friend functionality
        // will be implemented later
        setFriends([]);
        
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFriends();
  }, []);
  
  return (
    <div className="friends-section">
      <div className="friends-header">
        <h3>FRIENDS</h3>
        <Link to="/friends" className="see-all-link">See All</Link>
      </div>
      
      <div className="scrollable-friends-list">
        {loading ? (
          <div className="friends-loading">Loading friends...</div>
        ) : friends.length > 0 ? (
          friends.map(friend => (
            <Link 
              to={`/profiles/${friend.username}`} 
              key={friend.id} 
              className="friend-item"
            >
              <Avatar
                src={friend.profilePicture ? 
                  `${API_URL}${friend.profilePicture}` : 
                  '/src/assets/images/profile/default-avatar.png'
                }
                alt={`${friend.firstname || ''} ${friend.lastname || ''}`}
                size="small"
                showStatus={true}
                isOnline={friend.isOnline || false}
              />
              <span className="friend-name">
                {friend.firstname || friend.username}
              </span>
            </Link>
          ))
        ) : (
          <div className="no-friends-message">No friends added yet</div>
        )}
      </div>
    </div>
  );
};

export default FriendsSidebar;