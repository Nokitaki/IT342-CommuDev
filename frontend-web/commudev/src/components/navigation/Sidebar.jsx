// src/components/navigation/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserSearch from '../common/UserSearch';
import Avatar from '../common/Avatar';
import PeopleYouMayKnow from '../newsfeed/PeopleYouMayKnow';
//import { getUserData } from '../../services/authService';
import '../../styles/components/sidebar.css';

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // COMMENTED: Real API call for user data
        /*
        const data = await getUserData();
        setUserData(data);
        
        if (data?.profilePicture) {
          setProfilePicture(`http://localhost:8080${data.profilePicture}`);
        }
        */
        
        // Mock user data
        const mockData = {
          id: 1,
          username: 'testuser',
          firstname: 'John',
          lastname: 'Doe',
          profilePicture: null
        };
        setUserData(mockData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
            alt={userData ? `${userData.firstname} ${userData.lastname}` : "Profile"} 
            size="medium"
          />
          <div className="profile-info">
            <h4>
              {userData
                ? `${userData.firstname} ${userData.lastname}`
                : "Loading..."}
            </h4>
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