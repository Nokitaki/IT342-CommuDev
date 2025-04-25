// src/components/newsfeed/PeopleYouMayKnow.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import { sendFriendRequest } from '../../services/friendService';
import { getAllUsers, getUserById } from '../../services/userService';
import { checkFriendStatus } from '../../services/friendService'; // Import the friend status check function
import UserProfileModal from '../modals/UserProfileModal';
import '../../styles/components/peopleYouMayKnow.css';

const PeopleYouMayKnow = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailedUser, setDetailedUser] = useState(null);
  const [requestSent, setRequestSent] = useState({});
  
  // API URL for images
  const API_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        
        // Filter out current user
        let filteredUsers = allUsers.filter(user => profile && user.id !== profile.id);
        
        // Check which users are already friends and filter them out
        const nonFriendUsers = [];
        const pendingRequests = {};
        
        for (const user of filteredUsers) {
          try {
            // Check if this user is already a friend
            const friendStatus = await checkFriendStatus(user.id);
            
            // If there's a pending friend request, track it
            if (friendStatus.pendingRequest) {
              pendingRequests[user.id] = true;
            }
            
            // If they're not a friend, add them to our list
            if (!friendStatus.isFriend) {
              nonFriendUsers.push(user);
            }
          } catch (error) {
            console.log(`Error checking friend status for user ${user.id}:`, error);
            // Include user by default if we can't determine friend status
            nonFriendUsers.push(user);
          }
          
          // If we have found 3 non-friend users, stop checking
          if (nonFriendUsers.length >= 3) {
            break;
          }
        }
        
        // Update the requestSent state with any pending requests
        setRequestSent(pendingRequests);
        
        // Set the list of non-friend users (limited to 3 for display)
        setUsers(nonFriendUsers.slice(0, 3));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchUsers();
    }
  }, [profile]);

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
    return '/src/assets/images/profile/default-avatar.png';
  };

  // Open modal with selected user
  const handleUserClick = async (user) => {
    try {
      // First try to get detailed data from user profile endpoint
      console.log("Fetching detailed profile for user ID:", user.id);
      
      // Try to get detailed user data with custom API call
      const detailedUserData = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      
      if (detailedUserData.ok) {
        const userData = await detailedUserData.json();
        console.log("✅ Fetched detailed user data:", userData);
        
        // Set the detailed user data for the modal
        setDetailedUser(userData);
        setIsModalOpen(true);
        return;
      }
      
      // If first attempt fails, try the getUserById service
      const fallbackUserData = await getUserById(user.id);
      console.log("⚠️ Using fallback user data:", fallbackUserData);
      
      // Merge the original user data with fallback data to ensure we have all fields
      const mergedData = { ...user, ...fallbackUserData };
      
      // Set the merged data for the modal
      setDetailedUser(mergedData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("❌ Error fetching detailed user data:", error);
      // Fallback to using the basic user data we already have
      console.log("Using basic user data as fallback:", user);
      setDetailedUser(user);
      setIsModalOpen(true);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    // We no longer automatically update the requestSent state here
    // Only update if a request was explicitly sent in the modal
    
    setIsModalOpen(false);
    setDetailedUser(null);
  };

  // Send friend request
  const handleSendFriendRequest = async (userId, e) => {
    // Stop event propagation to prevent opening the modal
    if (e) e.stopPropagation();
    
    try {
      console.log('Sending friend request to:', userId);
      
      // Attempt to use the service
      await sendFriendRequest(userId);
      
      // Update local state to show request sent
      setRequestSent(prev => ({
        ...prev,
        [userId]: true
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to send friend request:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="people-suggestions">
        <div className="suggestions-header">
          <h3>People You May Know</h3>
          <Link to="/users" className="see-all-link">See All</Link>
        </div>
        <div className="suggestions-loading">Loading...</div>
      </div>
    );
  }

  // If there are no users to display after filtering
  if (users.length === 0) {
    return (
      <div className="people-suggestions">
        <div className="suggestions-header">
          <h3>People You May Know</h3>
          <Link to="/users" className="see-all-link">See All</Link>
        </div>
        <div className="suggestions-empty">No suggestions available</div>
      </div>
    );
  }

  return (
    <div className="people-suggestions">
      <div className="suggestions-header">
        <h3>People You May Know</h3>
        <Link to="/users" className="see-all-link">See All</Link>
      </div>
      <div className="suggestions-list">
        {users.map(user => (
          <div 
            key={user.id} 
            className="suggestion-item"
            onClick={() => handleUserClick(user)}
          >
            <img 
              src={getProfilePicture(user)} 
              alt={`${getUserName(user)}'s profile`}
              className="suggestion-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/src/assets/images/profile/default-avatar.png';
              }}
            />
            <span className="suggestion-name">{getUserName(user)}</span>
            <button 
              className={`suggestion-add-btn ${requestSent[user.id] ? 'sent' : ''}`} 
              onClick={(e) => {
                if (!requestSent[user.id]) {
                  handleSendFriendRequest(user.id, e);
                }
              }}
              disabled={requestSent[user.id]}
            >
              {requestSent[user.id] ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 11V5a1 1 0 0 1 2 0v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H6a1 1 0 0 1 0-2h6z"/>
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* User Profile Modal - Using the detailed user data */}
      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        user={detailedUser}
        onFriendRequestSent={(userId) => {
          // Update our local state when a request is sent from the modal
          setRequestSent(prev => ({
            ...prev,
            [userId]: true
          }));
        }}
      />
    </div>
  );
};

export default PeopleYouMayKnow;