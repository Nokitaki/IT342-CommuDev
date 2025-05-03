// src/pages/profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import NewsfeedItem from '../../components/newsfeed/NewsfeedItem';
import PostFormModal from '../../components/modals/PostFormModal';
import NavigationBar from '../../components/navigation/NavigationBar';
import ProfileEditor from '../../components/modals/ProfileEditor';
import useAuth from '../../hooks/useAuth';
import useNewsfeed from '../../hooks/useNewsfeed';
import useProfile from '../../hooks/useProfile';
import { fetchAllPosts } from '../../services/newsfeedService';
import '../../styles/pages/profile.css';
import ProfileDropdown from '../../components/profile/ProfileDropdown';
import { getAssetUrl } from '../../utils/assetUtils';

// In your ProfilePage.jsx
import CoverPhotoUpload from './CoverPhotoUpload'; // Adjust path based on your structure
import ProfilePictureUpload from './ProfilePictureUpload'; // Adjust path based on your structure
import API_URL from '../../config/apiConfig';


import { getProfilePicture, getCoverPhoto } from '../../utils/assetUtils';

const ProfilePage = () => {
  // Authentication and user data
  const { handleLogout } = useAuth(); 
  const { 
    profile, 
    loading: profileLoading, 
    error: profileError, 
    fetchProfile, 
    refreshProfile,
    updateProfile,
    updatePicture,
    updateCoverPhoto
  } = useProfile();
  
  // UI state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);
  
  // State for forcing image refresh
  const [imageKey, setImageKey] = useState(Date.now());
  
  // Post related state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI state
  const [activeTab, setActiveTab] = useState('posts');
  
  // Newsfeed hooks with loadMyPosts function
  const { 
    posts,
    loading: postsLoading,
    error: postsError,
    loadMyPosts,
    handleCreatePost, 
    handleUpdatePost, 
    handleDeletePost, 
    handleLikePost 
  } = useNewsfeed();

  // Helper function for getting full name
  const getFullName = () => {
    if (profile && profile.firstname && profile.lastname) {
      return `${profile.firstname} ${profile.lastname}`;
    } else if (profile && profile.firstname) {
      return profile.firstname;
    } else if (profile && profile.username) {
      return profile.username;
    }
    return 'User';
  };

  // Load user's posts when profile loads
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (profile) {
        try {
          setIsLoading(true);
          // Use the loadMyPosts function from useNewsfeed hook
          // This makes a direct API call to get the user's own posts
          await loadMyPosts();
        } catch (error) {
          console.error("Error loading user posts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserPosts();
  }, [profile, loadMyPosts]);

  // Handle profile picture click
  const handleProfilePictureClick = () => {
    setIsUploadingProfilePic(true);
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (formData) => {
    if (formData) {
      try {
        const success = await updatePicture(formData);
        if (success) {
          // Refresh profile data from server
          await fetchProfile();
          
          // Close the upload modal
          setIsUploadingProfilePic(false);
          
          // Force image refresh by updating the key
          setImageKey(Date.now());
        }
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
      }
    }
  };

  // Handle cover photo upload button click
  const handleCoverPhotoClick = () => {
    setIsUploadingCover(true);
  };

  // Handle cover photo upload
  const handleCoverPhotoUpload = async (formData) => {
    if (formData) {
      try {
        const success = await updateCoverPhoto(formData);
        if (success) {
          // Refresh profile data from server
          await fetchProfile();
          
          // Close the upload modal
          setIsUploadingCover(false);
          
          // Force image refresh by updating the key
          setImageKey(Date.now());
        }
      } catch (error) {
        console.error('Failed to upload cover photo:', error);
      }
    }
  };

  // Handle profile update from editor
  const handleProfileUpdate = async (formData) => {
    // Ensure the numeric values are properly parsed
    const updatedFormData = {
      ...formData,
      age: formData.age ? parseInt(formData.age, 10) : undefined
    };
  
    try {
      const success = await updateProfile(updatedFormData);
      if (success) {
        setIsEditing(false);
        // Refresh profile data
        await fetchProfile();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };




  const testProfileUpdate = async () => {
    try {
      // Try with minimal data
      const simpleData = {
        firstname: "Test Update"
      };
      
      console.log('Testing profile update with simple data:', simpleData);
      const success = await updateProfile(simpleData);
      
      if (success) {
        console.log('Simple profile update succeeded!');
      } else {
        console.log('Simple profile update failed');
      }
    } catch (err) {
      console.error('Test update error:', err);
    }
  };
  
  // Add a test button somewhere in your component
  <Button variant="secondary" onClick={testProfileUpdate}>
    Test Update
  </Button>

  

  // Social media icons component
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"/>
        </svg>
      </a>
      
      {/* LinkedIn icon */}
      <a href="#" className="social-icon linkedin" title="LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452Z"/>
        </svg>
      </a>
      
      {/* Added GitHub icon */}
      <a href="#" className="social-icon github" title="GitHub">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#24292e">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
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
                src={profile?.profilePicture ? 
                  `${API_URL}${profile.profilePicture}` : 
                  getAssetUrl('/assets/images/profile/pp.png')
              }
                  alt={getFullName()} 
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

            {/* Posts list - Now using the posts from useNewsfeed */}
            <div className="profile-posts">
              {isLoading || postsLoading ? (
                <div className="loading-message">
                  <div className="loading-spinner"></div>
                  Loading posts...
                </div>
              ) : posts.length > 0 ? (
                posts.map(post => (
                  <NewsfeedItem 
                    key={post.newsfeedId || post.newsfeed_id}
                    post={post}
                    onUpdate={(updatedPost) => handleUpdatePost(post.newsfeedId || post.newsfeed_id, updatedPost)}
                    onDelete={() => handleDeletePost(post.newsfeedId || post.newsfeed_id)}
                    onLike={() => handleLikePost(post)}
                    onEdit={() => {
                      setEditingPost(post);
                      setIsModalOpen(true);
                    }}
                    isCurrentUser={true}
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
                  <h2 className="profile-box-title">✨ About Me</h2>
                </div>
                <div className="profile-box-content">
                  {/* Biography */}
                  {profile?.biography && (
                    <div className="profile-info-item">
                      <div className="profile-info-icon">
                        <span className="info-emoji">📖</span>
                      </div>
                      <div className="profile-info-details">
                        <div className="profile-info-label">Bio</div>
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
                        <span className="info-emoji">🎂</span>
                      </div>
                      <div className="profile-info-details">
                        <div className="profile-info-label">Birthday</div>
                        <div className="profile-info-primary">
                          {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Age */}
                  {profile?.age !== undefined && profile?.age > 0 && (
                    <div className="profile-info-item">
                      <div className="profile-info-icon">
                        <span className="info-emoji">🔢</span>
                      </div>
                      <div className="profile-info-details">
                        <div className="profile-info-label">Age</div>
                        <div className="profile-info-primary">
                          {profile.age} years old
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Employment info from actual profile data */}
                  {profile?.employmentStatus && (
                    <div className="profile-info-item">
                      <div className="profile-info-icon">
                        <span className="info-emoji">
                          {profile.employmentStatus === 'STUDENT' ? '🎓' :
                           profile.employmentStatus === 'EMPLOYED_FULL_TIME' ? '💼' :
                           profile.employmentStatus === 'EMPLOYED_PART_TIME' ? '⏱️' :
                           profile.employmentStatus === 'SELF_EMPLOYED' ? '🚀' :
                           profile.employmentStatus === 'UNEMPLOYED' ? '🔍' :
                           profile.employmentStatus === 'RETIRED' ? '🏖️' :
                           profile.employmentStatus === 'HOMEMAKER' ? '🏠' :
                           profile.employmentStatus === 'UNABLE_TO_WORK' ? '🙏' :
                           '👔'}
                        </span>
                      </div>
                      <div className="profile-info-details">
                        <div className="profile-info-label">Employment</div>
                        <div className="profile-info-primary">
                          {profile.employmentStatus === 'EMPLOYED_FULL_TIME' ? 'Employed Full-Time' :
                           profile.employmentStatus === 'EMPLOYED_PART_TIME' ? 'Employed Part-Time' :
                           profile.employmentStatus === 'SELF_EMPLOYED' ? 'Self-Employed' :
                           profile.employmentStatus === 'UNEMPLOYED' ? 'Seeking Opportunities' :
                           profile.employmentStatus === 'STUDENT' ? 'Student' :
                           profile.employmentStatus === 'RETIRED' ? 'Retired' :
                           profile.employmentStatus === 'HOMEMAKER' ? 'Homemaker' :
                           profile.employmentStatus === 'UNABLE_TO_WORK' ? 'Unable to Work' :
                           profile.employmentStatus === 'PREFER_NOT_TO_SAY' ? 'Prefer Not to Say' :
                           profile.employmentStatus.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Location from actual profile data */}
                  {profile?.country && (
                    <div className="profile-info-item">
                      <div className="profile-info-icon">
                        <span className="info-emoji">
                          {profile.country === 'US' ? '🇺🇸' :
                           profile.country === 'CA' ? '🇨🇦' :
                           profile.country === 'UK' ? '🇬🇧' :
                           profile.country === 'AU' ? '🇦🇺' :
                           profile.country === 'PH' ? '🇵🇭' :
                           profile.country === 'IN' ? '🇮🇳' :
                           profile.country === 'JP' ? '🇯🇵' :
                           profile.country === 'CN' ? '🇨🇳' :
                           profile.country === 'BR' ? '🇧🇷' :
                           profile.country === 'DE' ? '🇩🇪' :
                           profile.country === 'FR' ? '🇫🇷' :
                           profile.country === 'IT' ? '🇮🇹' :
                           profile.country === 'ES' ? '🇪🇸' :
                           profile.country === 'RU' ? '🇷🇺' :
                           profile.country === 'MX' ? '🇲🇽' :
                           '🌎'}
                        </span>
                      </div>
                      <div className="profile-info-details">
                        <div className="profile-info-label">Country</div>
                        <div className="profile-info-primary">
                          {profile.country === 'US' ? 'United States' :
                           profile.country === 'CA' ? 'Canada' :
                           profile.country === 'UK' ? 'United Kingdom' :
                           profile.country === 'AU' ? 'Australia' :
                           profile.country === 'PH' ? 'Philippines' :
                           profile.country === 'IN' ? 'India' :
                           profile.country === 'JP' ? 'Japan' :
                           profile.country === 'CN' ? 'China' :
                           profile.country === 'BR' ? 'Brazil' :
                           profile.country === 'DE' ? 'Germany' :
                           profile.country === 'FR' ? 'France' :
                           profile.country === 'IT' ? 'Italy' :
                           profile.country === 'ES' ? 'Spain' :
                           profile.country === 'RU' ? 'Russia' :
                           profile.country === 'MX' ? 'Mexico' :
                           profile.country}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Joined date from actual profile data */}
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <span className="info-emoji">📅</span>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-label">Member Since</div>
                      <div className="profile-info-primary">
                        {profile?.createdAt ? 
                          new Date(profile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 
                          'Recently joined'} 🎉
                      </div>
                    </div>
                  </div>
                  
                  {/* Social Media Links */}
                  <div className="profile-social-links-item">
                    <div className="profile-info-icon">
                      <span className="info-emoji">🌐</span>
                    </div>
                    <div className="profile-info-details">
                      <div className="profile-info-label">Social Media</div>
                      <div className="profile-social-links-container about-social">
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
               src={getAssetUrl('/assets/images/logo.png')} 
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
  <ProfileDropdown 
    username={profile ? getFullName() : "User"}
    profilePicture={
      profile?.profilePicture ? 
      `${API_URL}${profile.profilePicture}` : 
      getAssetUrl('/assets/images/profile/default-avatar.png')
    }
  />
</div>
      </div>
      
      <div className="profile-main">
        {/* Cover photo section */}
        <div className="profile-cover">
          <img  
            key={`cover-image-${imageKey}`}
            src={getCoverPhoto(profile)}
            alt="Cover"
            className="profile-cover-image"
            onError={(e) => {
              console.log("Error loading cover photo:", profile?.coverPhoto);
              e.target.onerror = null;
              e.target.src = getAssetUrl('/assets/images/profile/prof3.jpg');
            }}
          />
          <div className="profile-cover-buttons">
            <Button 
              variant="primary" 
              onClick={handleCoverPhotoClick}
            >
              Edit Cover Photo
            </Button>
          </div>
        </div>
        
        {/* Profile header with avatar and user info */}
        <div className="profile-header">
          <div className="profile-avatar-container" onClick={handleProfilePictureClick}>
            <div className="profile-avatar-wrapper">
              <img 
                key={`profile-image-${imageKey}`}
                src={getProfilePicture(profile) || getAssetUrl('/assets/images/profile/pp.png')}
                alt={getFullName()} 
                className="profile-avatar-image"
                onError={(e) => {
                  console.log("Error loading profile picture:", profile?.profilePicture);
                  e.target.onerror = null;
                  e.target.src = getAssetUrl('/assets/images/profile/pp.png');
                }}
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
              {profile?.biography || ""}
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
    <h2 className="profile-box-title">✨ Information</h2>
  </div>
  <div className="profile-box-content">
    {/* Biography if available */}
    {profile?.biography && (
      <div className="profile-info-item">
        <div className="profile-info-icon">
          <span className="info-emoji">📝</span>
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
          <span className="info-emoji">💼</span>
        </div>
        <div className="profile-info-details">
          <div className="profile-info-primary">
            <span className="info-label">Status:</span> 
            {profile.employmentStatus === 'STUDENT' ? '🎓 Student' : 
             profile.employmentStatus === 'EMPLOYED_FULL_TIME' ? '👔 Employed Full-Time' :
             profile.employmentStatus === 'EMPLOYED_PART_TIME' ? '👔 Employed Part-Time' :
             profile.employmentStatus === 'SELF_EMPLOYED' ? '🚀 Self-Employed' :
             profile.employmentStatus === 'UNEMPLOYED' ? '🔍 Seeking Opportunities' :
             profile.employmentStatus === 'RETIRED' ? '🏖️ Retired' :
             profile.employmentStatus.replace(/_/g, ' ')}
          </div>
        </div>
      </div>
    )}
               
               {/* Location from real data */}
               {profile?.country && (
      <div className="profile-info-item">
        <div className="profile-info-icon">
          <span className="info-emoji">📍</span>
        </div>
        <div className="profile-info-details">
          <div className="profile-info-primary">
            <span className="info-label">Location:</span> Lives in 
            {profile.country === 'US' ? ' 🇺🇸 United States' :
             profile.country === 'PH' ? ' 🇵🇭 Philippines' :
             profile.country === 'CA' ? ' 🇨🇦 Canada' :
             profile.country === 'GB' ? ' 🇬🇧 United Kingdom' :
             profile.country === 'AU' ? ' 🇦🇺 Australia' :
             ` ${profile.country}`}
          </div>
        </div>
      </div>
    )}
               
               {/* Date of Birth */}
               {profile?.dateOfBirth && (
      <div className="profile-info-item">
        <div className="profile-info-icon">
          <span className="info-emoji">🎂</span>
        </div>
        <div className="profile-info-details">
          <div className="profile-info-primary">
            <span className="info-label">Birthday:</span> Born on {profile.dateOfBirth}
          </div>
        </div>
      </div>
    )}
               
               {/* Join date from real data */}
               <div className="profile-info-item">
      <div className="profile-info-icon">
        <span className="info-emoji">🏆</span>
      </div>
      <div className="profile-info-details">
        <div className="profile-info-primary">
          <span className="info-label">Member Since:</span> {profile?.createdAt ? 
            `Joined ${new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : 
            'Recently joined'} 🎉
        </div>
      </div>
    </div>
    
    {/* Social Media Icons */}
    <div className="profile-social-links-container">
      <div className="social-media-header">
        <span className="info-emoji">🌐</span> Connect with me
      </div>
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
       </div>
     </div>
     
     {/* Post creation modal */}
     <PostFormModal 
       isOpen={isModalOpen}
       onClose={() => {
         setIsModalOpen(false);
         setEditingPost(null);
       }}
       onSubmit={editingPost ? 
         (formData) => {
           handleUpdatePost(editingPost.newsfeedId || editingPost.newsfeed_id, formData);
           // Refresh posts after update
           loadMyPosts();
         } : 
         (formData) => {
           handleCreatePost(formData);
           // Refresh posts after creation
           loadMyPosts();
         }
       }
       editPost={editingPost}
       userName={getFullName()}
     />

     {/* Profile Editor Modal */}
     {isEditing && profile && (
       <div className="profile-editor-overlay">
         <div className="profile-editor-container">
           <ProfileEditor 
             profile={profile} 
             onCancel={() => setIsEditing(false)} 
             onSave={handleProfileUpdate} 
           />
         </div>
       </div>
     )}

     {/* Cover Photo Upload Modal */}
     <CoverPhotoUpload 
       isOpen={isUploadingCover}
       currentCoverPhoto={profile?.coverPhoto ? `${API_URL}${profile.coverPhoto}` : null}
       onSave={handleCoverPhotoUpload}
       onCancel={() => setIsUploadingCover(false)}
     />

     {/* Profile Picture Upload Modal */}
     <ProfilePictureUpload 
       isOpen={isUploadingProfilePic}
       currentProfilePicture={profile?.profilePicture ? `${API_URL}${profile.profilePicture}` : null}
       onSave={handleProfilePictureUpload}
       onCancel={() => setIsUploadingProfilePic(false)}
     />
   </div>
 );
};

export default ProfilePage;