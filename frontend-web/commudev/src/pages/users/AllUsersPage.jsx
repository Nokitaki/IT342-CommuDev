// src/pages/users/AllUsersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Avatar from '../../components/common/Avatar';
import { getAllUsers } from '../../services/userService';
import '../../styles/components/allUsers.css';

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // API URL for images
  const API_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = await getAllUsers();
        setUsers(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase();
    const username = (user.username || '').toLowerCase();
    
    return fullName.includes(searchLower) || username.includes(searchLower);
  });

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
    return '/src/assets/images/profile/default-avatar.png';
  };

  return (
    <MainLayout>
      <div className="all-users-container">
        <div className="all-users-header">
          <h1>All Community Members</h1>
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
              <Link 
                to={`/profiles/${user.username}`} 
                key={user.id} 
                className="user-card"
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AllUsersPage;