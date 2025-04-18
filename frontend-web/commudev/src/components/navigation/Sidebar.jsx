// src/components/navigation/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserSearch from '../common/UserSearch';
import Avatar from '../common/Avatar';
import UserList from '../common/UserList';
import useProfile from '../../hooks/useProfile';
import { getAllUsers } from '../../services/userService';
import '../../styles/components/sidebar.css';

const Sidebar = () => {
  // Use profile hook to get the current user data
  const { profile, loading } = useProfile();
  const [profilePicture, setProfilePicture] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // API URL
  const API_URL = 'http://localhost:8080';
  
  useEffect(() => {
    // When profile is loaded, update the profile picture
    if (profile?.profilePicture) {
      setProfilePicture(`${API_URL}${profile.profilePicture}`);
    }
  }, [profile]);

  // Fetch all users for "People You May Know" section
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const userData = await getAllUsers();
        
        // Filter out the current user
        const filteredUsers = userData.filter(user => 
          profile && user.id !== profile.id
        );
        
        // Limit to 8 users for display
        setUsers(filteredUsers.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (profile) {
      fetchUsers();
    }
  }, [profile]);

  // Get user full name
  const getFullName = () => {
    if (profile) {
      if (profile.firstname && profile.lastname) {
        return `${profile.firstname} ${profile.lastname}`;
      } else if (profile.firstname) {
        return profile.firstname;
      } else if (profile.username) {
        return profile.username;
      }
    }
    return 'Loading...';
  };

  // Mock community data
  const communities = [
    { icon: '🏛️', name: 'Municipal Community' },
    { icon: '🎨', name: 'Barangay Community' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/newsfeed" className="logo-container">
          <img 
            src="/src/assets/images/logo.png" 
            alt="CommuDev Logo" 
            className="logo-image" 
          />
        </Link>
        <UserSearch />
      </div>

      <Link to="/profile" className="profile-sidebar-link">
        <div className="profile-sidebar">
          <Avatar 
            src={profilePicture || '/src/assets/images/profile/default-avatar.png'} 
            alt={getFullName()} 
            size="medium"
          />
          <div className="profile-info">
            <h4>{loading ? "Loading..." : getFullName()}</h4>
          </div>
        </div>
      </Link>

      <div className="community-section">
        <h3>YOUR COMMUNITY</h3>
        {communities.map((community, index) => (
          <div key={index} className="community-item">
            <span className="community-icon">{community.icon} </span>
            <span>{community.name}</span>
          </div>
        ))}
      </div>

      <div className="friends-section">
        <div className="friends-header">
          <h3>PEOPLE YOU MAY KNOW</h3>
          <Link to="/users" className="see-all-link">See All</Link>
        </div>
        <div className="scrollable-friends-list">
          <UserList 
            users={users}
            loading={loadingUsers}
            emptyMessage="No other users found."
            loadingMessage="Loading users..."
            maxHeight={300}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;