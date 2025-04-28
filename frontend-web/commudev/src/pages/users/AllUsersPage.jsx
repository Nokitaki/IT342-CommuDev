// src/pages/users/AllUsersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { getAllUsers } from '../../services/userService';
import { checkFriendStatus, sendFriendRequest } from '../../services/friendService';
import UserProfileModal from '../../components/modals/UserProfileModal';
import useProfile from '../../hooks/useProfile';
import '../../styles/components/allUsers.css';
import API_URL from '../../config/apiConfig';


const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [friendStatuses, setFriendStatuses] = useState({});
  const [requestSent, setRequestSent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { profile } = useProfile();
  


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = await getAllUsers();
        
        // Filter out current user
        const otherUsers = userData.filter(user => profile && user.id !== profile.id);
        setUsers(otherUsers);
        
        // Check friend status for each user
        const statuses = {};
        for (const user of otherUsers) {
          try {
            const status = await checkFriendStatus(user.id);
            statuses[user.id] = status.isFriend;
          } catch (err) {
            console.error(`Error checking friend status for user ${user.id}:`, err);
            statuses[user.id] = false;
          }
        }
        
        setFriendStatuses(statuses);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchUsers();
    }
  }, [profile]);

  // Filter users when search term or friend statuses change
  useEffect(() => {
    if (!users) return;
    
    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase();
      const username = (user.username || '').toLowerCase();
      
      // Match search term
      const matchesSearch = fullName.includes(searchLower) || username.includes(searchLower);
      
      return matchesSearch;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, friendStatuses]);

  // Get user's full name
  const getFullName = (user) => {
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.firstname) {
      return user.firstname;
    }
    return user.username;
  };

  // Get user's profile picture
  const getProfilePicture = (user) => {
    if (user.profilePicture) {
      return `${API_URL}${user.profilePicture}`;
    }
    return '../../../public/assets/images/profile/default-avatar.png';
  };
  
  // Open user profile modal
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  // Close user profile modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  
  // Send friend request
  const handleSendFriendRequest = async (userId) => {
    try {
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

  return (
    <MainLayout>
      <div className="all-users-container">
        <div className="all-users-header">
          <h1>Community Members</h1>
          <div className="users-search">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="users-search-input"
            />
            <svg className="users-search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="users-loading">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="users-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="reload-button">
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-users-found">
            {searchTerm ? 
              `No users matching "${searchTerm}" found.` : 
              'No users found in the system.'}
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-card">
                <div 
                  className="user-card-content"
                  onClick={() => handleViewProfile(user)}
                >
                  <div className="user-card-avatar">
                    <Avatar
                      src={getProfilePicture(user)}
                      alt={getFullName(user)}
                      size="large"
                    />
                  </div>
                  <div className="user-card-info">
                    <h3 className="user-card-name">{getFullName(user)}</h3>
                    <p className="user-card-username">@{user.username}</p>
                    {user.biography && (
                      <p className="user-card-bio">{user.biography}</p>
                    )}
                  </div>
                </div>
                <div className="user-card-actions">
                  <Link to={`/profiles/${user.username}`} className="view-profile-btn">
                    View Profile
                  </Link>
                  
                  {/* Show appropriate action button based on friend status */}
                  {friendStatuses[user.id] ? (
                    <span className="already-friends-badge">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                      </svg>
                      Friends
                    </span>
                  ) : requestSent[user.id] ? (
                    <span className="request-sent-badge">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                      </svg>
                      Request Sent
                    </span>
                  ) : (
                    <Button 
                      variant="primary"
                      onClick={() => handleSendFriendRequest(user.id)}
                      className="add-friend-btn"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 11V5a1 1 0 0 1 2 0v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H6a1 1 0 0 1 0-2h6z"/>
                      </svg>
                      Add Friend
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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

export default AllUsersPage;