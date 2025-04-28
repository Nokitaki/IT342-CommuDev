// src/components/common/ProfileLink.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import '../../styles/components/profileLink.css';

const ProfileLink = ({ user, showAvatar = true, className = '' }) => {
  if (!user) return null;
  
  return (
    <Link 
      to={`/profiles/${user.username}`} 
      className={`profile-link ${className}`}
    >
      {showAvatar && (
        <Avatar 
          src={user.profilePicture || '/src/assets/images/profile/default-avatar.png'} 
          alt={`${user.firstname} ${user.lastname}`} 
          size="small" 
        />
      )}
      <span className="profile-link-name">
        {user.firstname} {user.lastname}
      </span>
    </Link>
  );
};

export default ProfileLink;