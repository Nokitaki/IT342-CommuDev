// src/components/modals/NewMessageModal.jsx
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { getAllUsers } from '../../services/userService';
import useProfile from '../../hooks/useProfile';
import '../../styles/components/newMessageModal.css';

const NewMessageModal = ({ isOpen, onClose, onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const { profile } = useProfile();
  
  // API URL for images
  const API_URL = 'http://localhost:8080';

  // Fetch all users when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        
        // Filter out current user
        const filteredUsers = allUsers.filter(user => 
          profile && user.id !== profile.id
        );
        
        setUsers(filteredUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [isOpen, profile]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase();
    const username = (user.username || '').toLowerCase();
    
    return fullName.includes(searchLower) || username.includes(searchLower);
  });

  // Get user's full name
  const getUserName = (user) => {
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.firstname) {
      return user.firstname;
    }
    return user.username;
  };

  // Get user's profile picture with fallback
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/src/assets/images/profile/default-avatar.png';
    
    return avatarPath.startsWith('http') 
      ? avatarPath 
      : `${API_URL}${avatarPath}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="new-message-modal">
        <div className="new-message-header">
          <h2>New Message</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="search-user-container">
          <div className="search-user-input-container">
            <Search size={18} className="search-user-icon" />
            <input
              type="text"
              className="search-user-input"
              placeholder="Search for a user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="users-list-container">
          {loading ? (
            <div className="users-loading">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="users-error">
              <p>{error}</p>
              <button 
                className="retry-button"
                onClick={() => setLoading(true)}
              >
                Retry
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="no-users-found">
              {searchTerm ? 
                `No users matching "${searchTerm}" found.` : 
                'No users found.'
              }
            </div>
          ) : (
            <div className="users-list">
              {filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  className="user-list-item"
                  onClick={() => {
                    console.log('Selected user:', user);
                    onSelectUser(user);
                  }}
                >
                  <img 
                    src={getAvatarUrl(user.profilePicture)}
                    alt={getUserName(user)}
                    className="user-list-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/src/assets/images/profile/default-avatar.png';
                    }}
                  />
                  <div className="user-list-details">
                    <h3 className="user-list-name">{getUserName(user)}</h3>
                    <p className="user-list-username">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;