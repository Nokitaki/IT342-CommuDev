// src/components/newsfeed/PeopleYouMayKnow.jsx
import React, { useState, useEffect } from 'react';
import useProfile from '../../hooks/useProfile';
import { getAllUsers } from '../../services/userService';
import UserProfileModal from '../modals/UserProfileModal';
import '../../styles/components/peopleYouMayKnow.css';

const PeopleYouMayKnow = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // API URL for images
  const API_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        
        // Filter out current user and limit to 3 users for display
        const filteredUsers = allUsers
          .filter(user => profile && user.id !== profile.id)
          .slice(0, 3);
          
        setUsers(filteredUsers);
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
      return `${API_URL}${user.profilePicture}`;
    }
    return '/src/assets/images/profile/default-avatar.png';
  };

  // Open modal with selected user
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="people-suggestions">
        <h3>PEOPLE YOU MAY KNOW</h3>
        <div className="suggestions-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="people-suggestions">
      <div className="suggestions-header">
        <h3>PEOPLE YOU MAY KNOW</h3>
        <button className="see-all-link">See All</button>
      </div>
      <div className="suggestions-list">
        {users.length > 0 ? (
          users.map(user => (
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
              <button className="suggestion-add-btn" onClick={(e) => {
                e.stopPropagation(); 
                console.log('Add button clicked for:', user.id);
                alert(`Friend request sent to ${getUserName(user)}`);
              }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 11V5a1 1 0 0 1 2 0v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H6a1 1 0 0 1 0-2h6z"/>
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="suggestions-empty">No users found</div>
        )}
      </div>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        user={selectedUser} 
      />
    </div>
  );
};

export default PeopleYouMayKnow;