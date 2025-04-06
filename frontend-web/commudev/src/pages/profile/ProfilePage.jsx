// src/pages/profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import NewsfeedItem from '../../components/newsfeed/NewsfeedItem';
import PostFormModal from '../../components/modals/PostFormModal';
import NavigationBar from '../../components/navigation/NavigationBar';
import ProfileEditor from '../../components/profile/ProfileEditor';
import useAuth from '../../hooks/useAuth';
import useNewsfeed from '../../hooks/useNewsfeed';
import useProfile from '../../hooks/useProfile';
import { fetchAllPosts } from '../../services/newsfeedService';
import '../../styles/pages/profile.css';

const ProfilePage = () => {
  // Authentication and user data
  const { userData, profilePicture, handleLogout } = useAuth();
  const { profile, loading: profileLoading, error: profileError, fetchProfile, updateProfile } = useProfile();
  
  // Post related state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI state
  const [activeTab, setActiveTab] = useState('posts');
  const [coverImage, setCoverImage] = useState('/src/assets/images/profile/cover-default.jpg');
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  
  // Newsfeed hooks
  const { handleCreatePost, handleUpdatePost, handleDeletePost, handleLikePost } = useNewsfeed();

  // Debug user data
  useEffect(() => {
    console.log("User data:", userData);
    console.log("Profile data:", profile);
  }, [userData, profile]);

  // Helper function for getting full name
  const getFullName = () => {
    
    // If userData doesn't have the name, check profile (from useProfile)
    if (profile && profile.firstname && profile.lastname) {
      return `${profile.firstname} ${profile.lastname}`;
    }
    // If neither has the name, return default
    return 'User Profile';
  };

  // Filter posts for the current user
  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await fetchAllPosts();
        // Get current user ID from userData
        const userId = userData?.id;
        
        if (userId) {
          // Filter posts by creator_id or creator name
          const filtered = allPosts.filter(post => 
            post.creator_id === userId || 
            post.creator === `${userData.firstname} ${userData.lastname}`
          );
          setUserPosts(filtered);
        }
      } catch (error) {
        console.error("Error loading user posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      loadUserPosts();
    }
  }, [userData]);

  // Social media icons
  const SocialMediaLinks = () => (
    <div className="social-media-links">
      {/* Facebook icon */}
      <a href="#" className="social-icon facebook" title="Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
        </svg>
      </a>
      
      {/* Instagram icon */}
      <a href="#" className="social-icon instagram" title="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#E4405F">
          <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"/>
        </svg>
      </a>
      
      {/* LinkedIn icon */}
      <a href="#" className="social-icon linkedin" title="LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452Z"/>
        </svg>
      </a>
    </div>
  );

  // Get content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'posts':
        return (
          <>
            {/* Create post section */}
            <div className="profile-create-post">
              <div className="profile-create-post-header">
                <Avatar 
                  src={profilePicture || '/src/assets/images/profile/default-avatar.png'} 
                  alt={(userData?.firstname && userData?.lastname) ? 
                      `${userData.firstname} ${userData.lastname}'s profile` : 
                      "User profile"} 
                  size="medium" 
                />
                <div 
                  className="profile-create-post-input"
                  onClick={() => {
                    setEditingPost(null);
                    setIsModalOpen(true);
                  }}
                >
                  What's on your mind?
                </div>
              </div>
              <div className="profile-create-post-divider"></div>
              <div className="profile-create-post-actions">
                <div className="profile-create-post-action">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="red">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                    <path d="M5 4h4v16H5V4zm10 0h4v16h-4V4z" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                  Live Video
                </div>
                <div className="profile-create-post-action">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="green">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    <path d="M8 11a2 2 0 100-4 2 2 0 000 4z" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                  Photo/Video
                </div>
                <div className="profile-create-post-action">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="orange">
                    <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01" />
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Feeling/Activity
                </div>
              </div>
            </div>

            {/* Posts list */}
            <div className="profile-posts">
              {isLoading ? (
                <div className="loading-message">Loading posts...</div>
              ) : userPosts.length > 0 ? (
                userPosts.map(post => (
                  <NewsfeedItem 
                    key={post.newsfeed_id}
                    post={post}
                    onUpdate={handleUpdatePost}
                    onDelete={handleDeletePost}
                    onLike={handleLikePost}
                  />
                ))
              ) : (
                <div className="no-posts-message">No posts yet. Create your first post!</div>
              )}
            </div>
          </>
        );
      
      case 'about':
        return (
          <div className="profile-about">
            <div className="profile-box">
              <div className="profile-box-header">
                <h2 className="profile-box-title">About</h2>
              </div>
              <div className="profile-box-content">
                {/* Biography */}
                {profile?.biography && (
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" />
                      </svg>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-primary bio-text">
                        {profile.biography}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Date of Birth */}
                {profile?.dateOfBirth && (
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                      </svg>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-primary">
                        <span className="info-label">Date of Birth:</span> {profile.dateOfBirth}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Age */}
                {profile?.age !== undefined && profile?.age > 0 && (
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 9h-2v2h2V9zm4 0h-2v2h2V9zm3 6.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 9v2h2V9h-2z"/>
                      </svg>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-primary">
                        <span className="info-label">Age:</span> {profile.age} years
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Employment info from actual profile data */}
                {profile?.employmentStatus && (
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" />
                      </svg>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-primary">
                        <span className="info-label">Employment:</span> {profile.employmentStatus.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Location from actual profile data */}
                {profile?.country && (
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-primary">
                        <span className="info-label">Location:</span> {profile.country}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Joined date from actual profile data */}
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      <span className="info-label">Joined:</span> {profile?.createdAt ? 
                        new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
                        'Recently joined'}
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      <span className="info-label">Social Media:</span>
                      <SocialMediaLinks />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'friends':
        return (
          <div className="profile-friends">
            <div className="profile-box">
              <div className="profile-box-header">
                <h2 className="profile-box-title">Friends</h2>
              </div>
              <div className="profile-box-content">
                <div className="profile-friends-grid">
                  {/* Empty placeholder for friends that will come from backend */}
                  <div className="empty-friends-placeholder">
                    <p>Friends list will appear here when available.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'photos':
        return (
          <div className="profile-photos">
            <div className="profile-box">
              <div className="profile-box-header">
                <h2 className="profile-box-title">Photos</h2>
              </div>
              <div className="profile-box-content">
                <div className="profile-photos-grid">
                  {/* Empty placeholder for photos that will come from backend */}
                  <div className="empty-photos-placeholder">
                    <p>Photos will appear here when available.</p>
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
    <div className="profile-container">
      {/* Top navigation bar */}
      <div className="profile-top-navbar">
        <div className="profile-top-left">
          <Link to="/newsfeed" className="profile-logo-link">
            <img 
              src="/src/assets/images/logo.png" 
              alt="CommuDev Logo" 
              className="profile-logo" 
            />
          </Link>
          <div className="profile-search">
            <svg viewBox="0 0 24 24" fill="currentColor" className="profile-search-icon">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input type="text" placeholder="Search" className="profile-search-input" />
          </div>
        </div>
        
        <div className="profile-top-center">
          <NavigationBar />
        </div>
        
        <div className="profile-top-right">
          <div className="profile-user-menu">
            <Avatar 
              src={profilePicture || '/src/assets/images/profile/default-avatar.png'} 
              alt={(userData?.firstname && userData?.lastname) ? 
                  `${userData.firstname} ${userData.lastname}'s profile` : 
                  "User profile"} 
              size="small" 
            />
            <span className="profile-username">
              {userData ? userData.firstname : "User"}
            </span>
            <button className="profile-menu-button" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="profile-main">
        {/* Cover photo section */}
        <div className="profile-cover">
          <img 
            src={coverImage} 
            alt="Cover" 
            className="profile-cover-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/images/profile/default-cover.jpg';
            }}
          />
          <div className="profile-cover-buttons">
            <Button variant="primary">Edit Cover Photo</Button>
          </div>
        </div>
        
        {/* Profile header with avatar and user info */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div className="profile-avatar-wrapper">
              <img 
                src={profilePicture || '/src/assets/images/profile/default-avatar.png'} 
                alt={(userData?.firstname && userData?.lastname) ? 
                    `${userData.firstname} ${userData.lastname}'s profile` : 
                    "User profile"} 
                className="profile-avatar-image"
              />
            </div>
            <div className="profile-camera-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" />
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
            </div>
          </div>
          
          <div className="profile-name-container">
            <h1 className="profile-name">
              {getFullName()}
            </h1>
            <p className="profile-bio">
              {profile?.biography || "Community Development Advocate"}
            </p>
            
            <div className="profile-buttons">
              <Button 
                variant="primary" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        
        {/* Profile navigation */}
        <div className="profile-navigation">
          <div className="profile-tabs">
            <div 
              className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </div>
            <div 
              className={`profile-tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </div>
            <div 
              className={`profile-tab ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </div>
            <div 
              className={`profile-tab ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              Photos
            </div>
          </div>
          
          <div className="profile-actions">
            <Button variant="secondary">More</Button>
          </div>
        </div>
        
        {/* Profile content area */}
        <div className="profile-content">
          {/* Left column for info boxes */}
          <div className="profile-column-left">
            <div className="profile-box">
            <div className="profile-box-header">
                <h2 className="profile-box-title">Intro</h2>
              </div>
              <div className="profile-box-content">
                {/* Biography if available */}
                {profile?.biography && (
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" />
                      </svg>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-primary bio-text">
                        {profile.biography}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Employment from real data */}
                {profile?.employmentStatus && (
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" />
                      </svg>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-primary">
                        {profile.employmentStatus.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Location from real data */}
                {profile?.country && (
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-primary">
                        Lives in {profile.country}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Date of Birth */}
                {profile?.dateOfBirth && (
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                      </svg>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-primary">
                        Born on {profile.dateOfBirth}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Join date from real data */}
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      {profile?.createdAt ? 
                        `Joined ${new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : 
                        'Recently joined'}
                    </div>
                  </div>
                </div>
                
                {/* Social Media Icons */}
                <div className="profile-social-links-container">
                  <SocialMediaLinks />
                </div>
              </div>
            </div>
            
            <div className="profile-box">
              <div className="profile-box-header">
                <h2 className="profile-box-title">Photos</h2>
                <Link to="#" className="see-all-link">See all</Link>
              </div>
              <div className="profile-box-content">
                <div className="empty-photos-placeholder">
                  <p>Photos will appear here</p>
                </div>
              </div>
            </div>
            
            <div className="profile-box">
              <div className="profile-box-header">
                <h2 className="profile-box-title">Friends</h2>
                <Link to="#" className="see-all-link">See all</Link>
              </div>
              <div className="profile-box-content">
                <div className="empty-friends-placeholder">
                  <p>Friends will appear here</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column for posts and tab content */}
          <div className="profile-column-right">
            {renderTabContent()}
          </div>
      
      {/* Post creation modal */}
      <PostFormModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        onSubmit={handleCreatePost}
        editPost={editingPost}
        userName={getFullName()}
      />
      
      {/* Profile Editor Overlay */}
      {isEditing && profile && (
        <div className="profile-editor-overlay">
          <div className="profile-editor-container">
            <ProfileEditor 
              profile={profile} 
              onCancel={() => setIsEditing(false)} 
              onSuccess={(updatedProfile) => {
                setIsEditing(false);
                // Refresh the profile data
                fetchProfile();
              }} 
            />
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default ProfilePage;