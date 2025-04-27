// src/components/common/UserList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import '../../styles/components/userList.css';
import API_URL from '../../config/apiConfig';


const UserList = ({ 
  users, 
  loading, 
  emptyMessage = 'No users found.',
  loadingMessage = 'Loading users...',
  showStatus = false,
  maxHeight = 300
}) => {


  // Get user display name
  const getUserDisplayName = (user) => {
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.firstname) {
      return user.firstname;
    } else {
      return user.username;
    }
  };

  // Check if the user has a valid profile picture
  const getProfilePicture = (user) => {
    if (user.profilePicture) {
      return user.profilePicture.startsWith('http') 
        ? user.profilePicture 
        : `${API_URL}${user.profilePicture}`;
    }
    return '/src/assets/images/profile/default-avatar.png';
  };

  if (loading) {
    return <div className="user-list-loading">{loadingMessage}</div>;
  }

  if (!users || users.length === 0) {
    return <div className="user-list-empty">{emptyMessage}</div>;
  }

  return (
    <div className="user-list" style={{ maxHeight: `${maxHeight}px` }}>
      {users.map((user) => (
        <Link
          to={`/profiles/${user.username}`}
          key={user.id}
          className="user-list-item"
        >
          <Avatar
            src={getProfilePicture(user)}
            alt={getUserDisplayName(user)}
            size="small"
            showStatus={showStatus}
            isOnline={false} // We don't have online status info yet
          />
          <span className="user-list-name">
            {getUserDisplayName(user)}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default UserList;