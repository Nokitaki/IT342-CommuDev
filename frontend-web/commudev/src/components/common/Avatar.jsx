// src/components/common/Avatar.jsx
import React from 'react';
import '../../styles/components/avatar.css';

// Default avatar image
import defaultAvatar from '../../assets/images/profile/default-avatar.png';

const Avatar = ({ 
  src, 
  alt = "User Avatar", 
  size = "medium", 
  isOnline, 
  showStatus = false,
  className = "",
  onClick
}) => {
  const sizeClasses = {
    small: "avatar-small",
    medium: "avatar-medium",
    large: "avatar-large"
  };
  
  return (
    <div 
      className={`avatar-container ${className}`} 
      onClick={onClick}
    >
      <div className={`avatar ${sizeClasses[size] || 'avatar-medium'}`}>
        <img 
          src={src || defaultAvatar} 
          alt={alt} 
          className="avatar-image" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
        />
        {showStatus && (
          <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
        )}
      </div>
    </div>
  );
};

export default Avatar;