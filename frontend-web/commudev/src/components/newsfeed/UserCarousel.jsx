// src/components/newsfeed/UserCarousel.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import useProfile from '../../hooks/useProfile';
import { getAllUsers } from '../../services/userService';
import '../../styles/components/userCarousel.css';

const UserCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const usersPerPage = 7;

  // API URL for images
  const API_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        
        // Filter out current user if needed
        const filteredUsers = profile ? 
          allUsers.filter(user => user.id !== profile.id) : 
          allUsers;
          
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [profile]);

  const nextPage = () => {
    if (currentIndex + usersPerPage < users.length) {
      setCurrentIndex(currentIndex + usersPerPage);
    } else {
      // Loop back to the beginning
      setCurrentIndex(0);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - usersPerPage);
    } else {
      // Loop to the end
      setCurrentIndex(Math.max(0, Math.floor(users.length / usersPerPage) * usersPerPage));
    }
  };

  // Get user display name
  const getUserName = (user) => {
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.firstname) {
      return user.firstname;
    } else {
      return user.username;
    }
  };

  // Get user profile picture
  const getProfilePicture = (user) => {
    if (user.profilePicture) {
      return `${API_URL}${user.profilePicture}`;
    }
    return '/src/assets/images/profile/default-avatar.png';
  };

  // Slice users for current page view
  const visibleUsers = users.slice(currentIndex, currentIndex + usersPerPage);

  if (loading) {
    return (
      <div className="user-carousel">
        <div className="user-carousel-loading">Loading users...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return null; // Hide carousel if no users
  }

  return (
    <div className="user-carousel">
      <button 
        className="carousel-nav-button prev" 
        onClick={prevPage}
        aria-label="Previous users"
        disabled={users.length <= usersPerPage}
      >
        &lt;
      </button>
      
      <div className="user-avatars">
        {visibleUsers.map((user) => (
          <Link 
            to={`/profiles/${user.username}`} 
            key={user.id} 
            className="user-avatar-item"
          >
            <Avatar 
              src={getProfilePicture(user)}
              alt={getUserName(user)}
              showStatus={true}
              isOnline={false} // We don't have online status info yet
              size="medium"
            />
            <span className="user-name">{getUserName(user)}</span>
          </Link>
        ))}
      </div>
      
      <button 
        className="carousel-nav-button next" 
        onClick={nextPage}
        aria-label="Next users"
        disabled={users.length <= usersPerPage}
      >
        &gt;
      </button>
    </div>
  );
};

export default UserCarousel;