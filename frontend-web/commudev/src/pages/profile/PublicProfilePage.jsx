// src/pages/profile/PublicProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPublicProfile } from '../../services/authService';
import { checkFriendStatus, sendFriendRequest, removeFriend } from '../../services/friendService';
import Button from '../../components/common/Button';
import NewsfeedItem from '../../components/newsfeed/NewsfeedItem';
import useNewsfeed from '../../hooks/useNewsfeed';
import useProfile from '../../hooks/useProfile';
import Avatar from '../../components/common/Avatar';
import '../../styles/pages/publicProfile.css';
import API_URL from '../../config/apiConfig';



const PublicProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [friendStatus, setFriendStatus] = useState({ isFriend: false, pendingRequest: false });
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Get current user's profile
  const { profile: currentUserProfile } = useProfile();
  
  // Use the newsfeed hook to load user's posts
  const { posts, loading: postsLoading, loadUserPosts, handleLikePost } = useNewsfeed(username);


  // Load the user profile and check friendship status
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getPublicProfile(username);
        console.log("Profile data received:", profileData);
        
        setProfile(profileData);
        
        // Check friendship status if we have a current user
        if (currentUserProfile && currentUserProfile.id && profileData && profileData.id) {
          try {
            // Make sure profileData.id is defined and valid
            const userIdToCheck = profileData.id;
            console.log("Checking friend status for user ID:", userIdToCheck);
            
            if (userIdToCheck) {
              const status = await checkFriendStatus(userIdToCheck);
              setFriendStatus(status);
            }
          } catch (err) {
            console.error('Error checking friend status:', err);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, currentUserProfile]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get user's profile picture
  const getProfilePicture = () => {
    if (profile?.profilePicture) {
      return profile.profilePicture.startsWith('http') 
        ? profile.profilePicture 
        : `${API_URL}${profile.profilePicture}`;
    }
    return '/src/assets/images/profile/default-avatar.png';
  };

  // Get user's cover photo
  const getCoverPhoto = () => {
    if (profile?.coverPhoto) {
      return profile.coverPhoto.startsWith('http') 
        ? profile.coverPhoto 
        : `${API_URL}${profile.coverPhoto}`;
    }
    return '/src/assets/images/profile/coverphoto.jpg';
  };

  // Get full name
  const getFullName = () => {
    if (profile?.firstname && profile?.lastname) {
      return `${profile.firstname} ${profile.lastname}`;
    } else if (profile?.firstname) {
      return profile.firstname;
    }
    return profile?.username || 'User';
  };

  // Handle add friend button
  const handleAddFriend = async () => {
    if (!currentUserProfile) {
      navigate('/login');
      return;
    }
    
    setIsActionLoading(true);
    setStatusMessage({ text: '', type: '' });
    
    try {
      await sendFriendRequest(profile.id);
      setFriendStatus(prev => ({ ...prev, pendingRequest: true }));
      setStatusMessage({ 
        text: 'Friend request sent successfully!', 
        type: 'success' 
      });
    } catch (err) {
      console.error('Error sending friend request:', err);
      
      // Check if error contains "already sent" message
      if (err.message && err.message.includes('already sent')) {
        setStatusMessage({ 
          text: 'You have already sent a friend request to this user', 
          type: 'info' 
        });
        setFriendStatus(prev => ({ ...prev, pendingRequest: true }));
      } else {
        setStatusMessage({ 
          text: 'Failed to send friend request. Please try again.', 
          type: 'error' 
        });
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle unfriend button
  const handleUnfriend = async () => {
    if (!currentUserProfile || !profile) return;
    
    if (!window.confirm(`Are you sure you want to remove ${getFullName()} from your friends?`)) {
      return;
    }
    
    setIsActionLoading(true);
    setStatusMessage({ text: '', type: '' });
    
    try {
      await removeFriend(profile.id);
      setFriendStatus({ isFriend: false, pendingRequest: false });
      setStatusMessage({ 
        text: 'Friend removed successfully', 
        type: 'success' 
      });
    } catch (err) {
      console.error('Error removing friend:', err);
      setStatusMessage({ 
        text: 'Failed to remove friend. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle message button
  const handleMessage = () => {
    if (!currentUserProfile) {
      navigate('/login');
      return;
    }
    
    navigate(`/messages?user=${profile.id}`);
  };

  if (loading) {
    return (
      <div className="public-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-profile-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/newsfeed" className="back-link">Back to Newsfeed</Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="public-profile-not-found">
        <h2>Profile Not Found</h2>
        <p>Sorry, the profile you're looking for doesn't exist or has been removed.</p>
        <Link to="/newsfeed" className="back-link">Back to Newsfeed</Link>
      </div>
    );
  }

  // Check if profile is private
  if (profile.profileVisibility === 'PRIVATE' && (!currentUserProfile || currentUserProfile.username !== profile.username)) {
    return (
      <div className="private-profile-container">
        <div className="private-profile-content">
          <div className="private-profile-icon">🔒</div>
          <h2>Private Profile</h2>
          <p>This profile is private and only visible to the user.</p>
          <div className="private-profile-avatar">
            <Avatar 
              src={getProfilePicture()}
              alt={profile.username}
              size="large"
            />
            <h3>@{profile.username}</h3>
          </div>
          <Link to="/newsfeed" className="back-link">Back to Newsfeed</Link>
        </div>
      </div>
    );
  }

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="profile-posts">
            {postsLoading ? (
              <div className="loading-posts">
                <div className="loading-spinner"></div>
                <p>Loading posts...</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <NewsfeedItem 
                  key={post.newsfeedId || post.newsfeed_id}
                  post={post}
                  onLike={() => handleLikePost(post.newsfeedId || post.newsfeed_id)}
                  isCurrentUser={false}
                />
              ))
            ) : (
              <div className="no-posts">
                <div className="no-posts-icon">📝</div>
                <h3>No Posts Yet</h3>
                <p>{profile.firstname || profile.username} hasn't shared any posts yet.</p>
              </div>
            )}
          </div>
        );
      
      case 'about':
        return (
          <div className="profile-about">
            <div className="about-section">
              <h3>Personal Information</h3>
              
              {profile.biography && (
                <div className="about-bio">
                  <div className="bio-header">
                    <span className="bio-icon">✨</span>
                    <h4>Biography</h4>
                  </div>
                  <p>{profile.biography}</p>
                </div>
              )}
              
              <div className="about-details">
                {profile.country && (
                  <div className="about-detail">
                    <div className="detail-icon">🌍</div>
                    <div className="detail-content">
                      <h4>Country</h4>
                      <p>{profile.country}</p>
                    </div>
                  </div>
                )}
                
                {profile.dateOfBirth && (
                  <div className="about-detail">
                    <div className="detail-icon">🎂</div>
                    <div className="detail-content">
                      <h4>Date of Birth</h4>
                      <p>{profile.dateOfBirth}</p>
                    </div>
                  </div>
                )}
                
                {profile.age && (
                  <div className="about-detail">
                    <div className="detail-icon">🔢</div>
                    <div className="detail-content">
                      <h4>Age</h4>
                      <p>{profile.age} years old</p>
                    </div>
                  </div>
                )}
                
                <div className="about-detail">
                  <div className="detail-icon">🗓️</div>
                  <div className="detail-content">
                    <h4>Member Since</h4>
                    <p>{profile.createdAt ? formatDate(profile.createdAt) : 'Recently joined'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <div className="public-profile-container">
      {/* Cover Section */}
      <div className="public-profile-cover">
        <img 
          src={getCoverPhoto()} 
          alt="Cover" 
          className="cover-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/src/assets/images/profile/coverphoto.jpg';
          }}
        />
        <div className="cover-overlay"></div>
        <div className="profile-nav">
          <Link to="/newsfeed" className="nav-link home-link">
            <span className="nav-icon">🏠</span>
            Home
          </Link>
        </div>
      </div>
      
      {/* Profile Header */}
      <div className="public-profile-header">
        <div className="profile-avatar-wrapper">
          <img 
            src={getProfilePicture()} 
            alt={getFullName()} 
            className="profile-avatar-large"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/images/profile/default-avatar.png';
            }}
          />
        </div>
        
        <div className="profile-info">
          <h1 className="profile-name">{getFullName()}</h1>
          <p className="profile-username">@{profile.username}</p>
          
          {statusMessage.text && (
            <div className={`profile-status-message ${statusMessage.type}`}>
              {statusMessage.text}
            </div>
          )}
          
          <div className="profile-actions">
            {!currentUserProfile ? (
              <Button 
                variant="primary" 
                onClick={() => navigate('/login')}
                className="full-width-btn"
              >
                Log in to Interact
              </Button>
            ) : currentUserProfile.username === profile.username ? (
              <Button 
                variant="primary" 
                onClick={() => navigate('/profile')}
                className="full-width-btn"
              >
                Edit Your Profile
              </Button>
            ) : (
              <div className="button-row">
               <Button 
  variant="primary" 
  onClick={handleMessage}
  style={{ width: 'auto' }}
>
  <span className="message-icon">✉️</span>
  <span>Message</span>
</Button>

              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Navigation Tabs */}
      <div className="profile-navigation">
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <span className="tab-icon">📝</span>
            Posts
          </button>
          <button 
            className={`profile-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <span className="tab-icon">ℹ️</span>
            About
          </button>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="profile-content">
        {renderTabContent()}
      </div>
      
      {/* Profile Footer */}
      <div className="profile-footer">
        <p>© {new Date().getFullYear()} CommuDev</p>
        <Link to="/newsfeed" className="back-link">
          <span className="back-icon">←</span>
          Back to Newsfeed
        </Link>
      </div>
    </div>
  );
};

export default PublicProfilePage;