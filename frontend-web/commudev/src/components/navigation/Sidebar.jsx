// src/components/navigation/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserSearch from '../common/UserSearch';
import Avatar from '../common/Avatar';
import useProfile from '../../hooks/useProfile';
import '../../styles/components/sidebar.css';

const Sidebar = () => {
  // Use profile hook to get the current user data
  const { profile, loading } = useProfile();
  const [profilePicture, setProfilePicture] = useState(null);
  
  // API URL
  const API_URL = 'http://localhost:8080';
  
  useEffect(() => {
    // When profile is loaded, update the profile picture
    if (profile?.profilePicture) {
      setProfilePicture(`${API_URL}${profile.profilePicture}`);
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

  // Mock friend data
  const friends = [
    { id: 1, name: "Harry", isOnline: false },
    { id: 2, name: "Keanu", isOnline: true },
    { id: 3, name: "Ariana", isOnline: true },
    { id: 4, name: "Justin", isOnline: true },
    { id: 5, name: "Carl", isOnline: false },
    { id: 6, name: "James", isOnline: true },
    { id: 7, name: "Sophie", isOnline: false },
    { id: 8, name: "Emma", isOnline: true }
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
        <h3>PEOPLE YOU MAY KNOW</h3>
        <div className="scrollable-friends-list">
          {friends.map((friend, index) => (
            <div key={index} className="friend-item">
              <div className="avatar">
                <div className={`status-indicator ${friend.isOnline ? "online" : ""}`}></div>
              </div>
              <span>{friend.name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;