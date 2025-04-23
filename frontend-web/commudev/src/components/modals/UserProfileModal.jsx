// src/components/modals/UserProfileModal.jsx
import React, { useEffect } from 'react';
import Button from '../common/Button';
import '../../styles/components/userProfileModal.css';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  // Check for null/undefined user or not being open
  if (!isOpen || !user) return null;

  // API URL for images
  const API_URL = 'http://localhost:8080';

  // Get user's profile picture with fallback
  const getProfilePicture = () => {
    if (user.profilePicture) {
      return user.profilePicture.startsWith('http') 
        ? user.profilePicture 
        : `${API_URL}${user.profilePicture}`;
    }
    return '/src/assets/images/profile/default-avatar.png';
  };

  // Get user's cover photo with fallback
  const getCoverPhoto = () => {
    if (user.coverPhoto) {
      return user.coverPhoto.startsWith('http') 
        ? user.coverPhoto 
        : `${API_URL}${user.coverPhoto}`;
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
    
    try {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch (e) {
      return 'Recently joined';
    }
  };

  // Handle the employment status display
  const getEmploymentStatusText = () => {
    const status = user.employmentStatus;
    if (!status) return '—';
    
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
    
    // First check if it's in our map
    if (statusMap[status]) return statusMap[status];
    
    // Then check if it's a string that needs formatting
    if (typeof status === 'string') {
      return status.replace(/_/g, ' ');
    }
    
    // Last resort
    return '—';
  };

  // Handle country display with emoji
  const getCountryDisplay = () => {
    const country = user.country;
    if (!country) return '—';
    
    const countryEmojis = {
      'US': '🇺🇸 United States',
      'CA': '🇨🇦 Canada',
      'GB': '🇬🇧 United Kingdom',
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
    
    // First check if it's in our emoji map
    if (countryEmojis[country]) return countryEmojis[country];
    
    // Otherwise return with global emoji
    return `🌎 ${country}`;
  };

  // Get birth info (combining date of birth and age)
  const getBirthInfo = () => {
    if (user.dateOfBirth) return `Born on ${user.dateOfBirth}`;
    if (user.age) return `${user.age} years old`;
    return '—';
  };

  // Handle add friend button click
  const handleAddFriend = () => {
    console.log('Adding friend:', user.id);
    alert(`Friend request sent to ${getFullName()}`);
  };

  // Handle message button click
  const handleMessage = () => {
    console.log('Messaging:', user.id);
    alert(`Messaging ${getFullName()}`);
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
              {user.employmentStatus === 'STUDENT' && (
                <div className="profile-status-badge">
                  <span className="status-student">Student</span>
                </div>
              )}
            </div>
            <p className="user-profile-username">@{user.username}</p>

            {/* About Section */}
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
                  {/* Employment Status */}
                  <div className="user-profile-detail-item">
                    <div className="detail-icon-container employment">
                      <span className="detail-icon">💼</span>
                    </div>
                    <div className="detail-content">
                      <h4>Status</h4>
                      <p>{getEmploymentStatusText()}</p>
                    </div>
                  </div>
                  
                  {/* Country/Location */}
                  <div className="user-profile-detail-item">
                    <div className="detail-icon-container location">
                      <span className="detail-icon">📍</span>
                    </div>
                    <div className="detail-content">
                      <h4>Location</h4>
                      <p>{getCountryDisplay()}</p>
                    </div>
                  </div>
                  
                  {/* Birthday/Age */}
                  <div className="user-profile-detail-item">
                    <div className="detail-icon-container birthday">
                      <span className="detail-icon">🎂</span>
                    </div>
                    <div className="detail-content">
                      <h4>Birthday</h4>
                      <p>{getBirthInfo()}</p>
                    </div>
                  </div>
                  
                  {/* Join Date */}
                  <div className="user-profile-detail-item">
                    <div className="detail-icon-container joined">
                      <span className="detail-icon">📆</span>
                    </div>
                    <div className="detail-content">
                      <h4>Joined</h4>
                      <p>{formatJoinDate()} 🎉</p>
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
                onClick={handleMessage}
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