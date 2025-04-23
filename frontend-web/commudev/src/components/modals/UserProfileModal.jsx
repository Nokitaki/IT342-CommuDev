// src/components/modals/UserProfileModal.jsx
import React from 'react';
import Button from '../common/Button';
import '../../styles/components/userProfileModal.css';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  // Debugging: Log the user object to inspect properties
  console.log("User object in modal:", user);

  // API URL for images
  const API_URL = 'http://localhost:8080';

  // Get user's profile picture with fallback
  const getProfilePicture = () => {
    if (user.profilePicture) {
      return `${API_URL}${user.profilePicture}`;
    }
    return '/src/assets/images/profile/default-avatar.png';
  };

  // Get user's cover photo with fallback
  const getCoverPhoto = () => {
    if (user.coverPhoto) {
      return `${API_URL}${user.coverPhoto}`;
    }
    return '/src/assets/images/profile/coverphoto.jpg';
  };

  // Get user's full name
  const getFullName = () => {
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.firstname) {
      return user.firstname;
    }
    return user.username;
  };

  // Format join date
  const formatJoinDate = () => {
    if (!user.createdAt) return 'Recently joined';
    
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Get employment status display text
  const getEmploymentStatusText = () => {
    if (!user.employmentStatus) return null;
    
    const statusMap = {
      'EMPLOYED_FULL_TIME': '👨‍💼 Employed Full-Time',
      'EMPLOYED_PART_TIME': '👨‍💼 Employed Part-Time',
      'SELF_EMPLOYED': '🚀 Self-Employed',
      'UNEMPLOYED': '🔍 Looking for Opportunities',
      'STUDENT': '🎓 Student',
      'RETIRED': '🏖️ Retired',
      'HOMEMAKER': '🏠 Homemaker',
      'UNABLE_TO_WORK': '🙏 Unable to Work',
      'PREFER_NOT_TO_SAY': '🤐 Prefer Not to Say'
    };
    
    return statusMap[user.employmentStatus] || user.employmentStatus.replace(/_/g, ' ');
  };

  // Get country display with emoji
  const getCountryDisplay = () => {
    if (!user.country) return null;
    
    const countryEmojis = {
      'US': '🇺🇸 United States',
      'CA': '🇨🇦 Canada',
      'UK': '🇬🇧 United Kingdom',
      'AU': '🇦🇺 Australia',
      'PH': '🇵🇭 Philippines',
      'IN': '🇮🇳 India',
      'JP': '🇯🇵 Japan',
      'CN': '🇨🇳 China',
      'BR': '🇧🇷 Brazil',
      'DE': '🇩🇪 Germany',
      'FR': '🇫🇷 France',
      'IT': '🇮🇹 Italy',
      'ES': '🇪🇸 Spain',
      'RU': '🇷🇺 Russia',
      'MX': '🇲🇽 Mexico'
    };
    
    return countryEmojis[user.country] || `🌎 ${user.country}`;
  };

  // Handle add friend button click
  const handleAddFriend = () => {
    // Implement friendship functionality here
    console.log('Adding friend:', user.id);
    // Show some feedback to the user
    alert(`Friend request sent to ${getFullName()}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        {/* Cover Photo with gradient overlay */}
        <div className="user-profile-cover">
          <div className="cover-gradient-overlay"></div>
          <img 
            src={getCoverPhoto()} 
            alt="Cover" 
            className="user-profile-cover-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/images/profile/coverphoto.jpg';
            }}
          />
          <button className="close-modal-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Profile Info */}
        <div className="user-profile-info">
          <div className="user-profile-avatar-container">
            <div className="avatar-border-effect"></div>
            <img 
              src={getProfilePicture()} 
              alt={getFullName()} 
              className="user-profile-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/src/assets/images/profile/default-avatar.png';
              }}
            />
          </div>

          <div className="user-profile-details">
            <div className="profile-header-section">
              <h2 className="user-profile-name">{getFullName()}</h2>
              <div className="profile-status-badge">
                {user.employmentStatus === 'STUDENT' ? 
                  <span className="status-student">Student</span> : 
                  <span className="status-active">Active</span>}
              </div>
            </div>
            <p className="user-profile-username">@{user.username}</p>

            {/* About Section - Now the main focus */}
            <div className="user-profile-tab-content">
              <div className="user-profile-about">
                {user.biography && (
                  <div className="user-profile-bio">
                    <div className="bio-header">
                      <span className="bio-icon">✨</span>
                      <h3>About Me</h3>
                    </div>
                    <p>{user.biography}</p>
                  </div>
                )}
                
                <div className="user-profile-details-grid">
                  {/* Debug info to see what's available */}
                  {/* Console log moved to the top of the component */}

                  {/* Employment Status - forced to display for debugging */}
                  <div className="user-profile-detail-item">
                    <div className="detail-icon-container employment">
                      <span className="detail-icon">💼</span>
                    </div>
                    <div className="detail-content">
                      <h4>Employment</h4>
                      <p>{getEmploymentStatusText() || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {/* Country/Location - forced to display for debugging */}
                  <div className="user-profile-detail-item">
                    <div className="detail-icon-container location">
                      <span className="detail-icon">📍</span>
                    </div>
                    <div className="detail-content">
                      <h4>Location</h4>
                      <p>{getCountryDisplay() || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {/* Birthday - forced to display for debugging */}
                  <div className="user-profile-detail-item">
                    <div className="detail-icon-container birthday">
                      <span className="detail-icon">🎂</span>
                    </div>
                    <div className="detail-content">
                      <h4>Birthday</h4>
                      <p>{user.dateOfBirth || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {/* Join Date - always displayed */}
                  <div className="user-profile-detail-item">
                    <div className="detail-icon-container joined">
                      <span className="detail-icon">📆</span>
                    </div>
                    <div className="detail-content">
                      <h4>Joined</h4>
                      <p>{formatJoinDate()} 🎉</p>
                    </div>
                  </div>
                  
                  {/* Profile Visibility - forced to display for debugging */}
                  <div className="user-profile-detail-item">
                    <div className="detail-icon-container privacy">
                      <span className="detail-icon">🔒</span>
                    </div>
                    <div className="detail-content">
                      <h4>Profile</h4>
                      <p>{user.profileVisibility === 'PUBLIC' ? 'Public Profile' : 
                          user.profileVisibility === 'FRIENDS' ? 'Friends Only' : 
                          user.profileVisibility || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="user-profile-actions">
              <Button 
                variant="primary" 
                className="add-friend-button"
                onClick={handleAddFriend}
              >
                <span className="add-friend-icon">+</span>
                Add Friend
              </Button>
              
              <Button 
                variant="secondary" 
                className="message-button"
                onClick={() => {
                  console.log('Messaging:', user.id);
                  alert(`Messaging ${getFullName()}`);
                }}
              >
                <span className="message-icon">💬</span>
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;