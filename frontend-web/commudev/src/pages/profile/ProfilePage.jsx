// src/pages/profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import NewsfeedItem from '../../components/newsfeed/NewsfeedItem';
import PostFormModal from '../../components/modals/PostFormModal';
import NavigationBar from '../../components/navigation/NavigationBar';
import useAuth from '../../hooks/useAuth';
import useNewsfeed from '../../hooks/useNewsfeed';
import { fetchAllPosts } from '../../services/newsfeedService';
import '../../styles/pages/profile.css';

const ProfilePage = () => {
  const { userData, profilePicture, handleLogout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [coverImage, setCoverImage] = useState('/src/assets/images/profile/cover-default.jpg');
  const { handleCreatePost, handleUpdatePost, handleDeletePost, handleLikePost } = useNewsfeed();

  // Mock data for friends and photos
  const friends = [
    { id: 1, name: "Maria Garcia", image: "prof1.png", mutualFriends: 5 },
    { id: 2, name: "Robert Chen", image: "prof2.jpg", mutualFriends: 2 },
    { id: 3, name: "Sarah Johnson", image: "prof3.jpg", mutualFriends: 8 },
    { id: 4, name: "David Wong", image: "prof1.png", mutualFriends: 3 },
    { id: 5, name: "Emily Taylor", image: "prof2.jpg", mutualFriends: 1 },
    { id: 6, name: "James Rodriguez", image: "prof3.jpg", mutualFriends: 4 },
    { id: 7, name: "Sophia Kim", image: "prof1.png", mutualFriends: 7 },
    { id: 8, name: "Michael Brown", image: "prof2.jpg", mutualFriends: 2 },
    { id: 9, name: "Olivia Martinez", image: "prof3.jpg", mutualFriends: 5 }
  ];

  const photos = [
    { id: 1, src: "photo1.jpg", date: "2 days ago" },
    { id: 2, src: "photo2.jpg", date: "1 week ago" },
    { id: 3, src: "photo3.jpg", date: "2 weeks ago" },
    { id: 4, src: "photo4.jpg", date: "3 weeks ago" },
    { id: 5, src: "photo5.jpg", date: "1 month ago" },
    { id: 6, src: "photo6.jpg", date: "1 month ago" },
    { id: 7, src: "photo7.jpg", date: "2 months ago" },
    { id: 8, src: "photo8.jpg", date: "2 months ago" },
    { id: 9, src: "photo9.jpg", date: "3 months ago" }
  ];

  // Mock user information
  const userInfo = {
    workplaces: [
      { company: "Barangay Office", position: "Community Leader", current: true },
      { company: "Municipal Government", position: "Project Coordinator", current: false }
    ],
    education: [
      { school: "University of the Philippines", degree: "BS Community Development", current: false },
      { school: "Manila High School", degree: "", current: false }
    ],
    location: "Manila, Philippines",
    hometown: "Cebu City, Philippines",
    relationship: "Married",
    joined: "January 2023"
  };

  // Filter posts for the current user
  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await fetchAllPosts();
        // Get current user ID from userData
        const userId = userData?.id || 1; // Default to 1 if not available
        
        // Filter posts by creator_id
        const filtered = allPosts.filter(post => post.creator_id === userId);
        setUserPosts(filtered);
      } catch (error) {
        console.error("Error loading user posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPosts();
  }, [userData]);

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
                <div className="no-posts-message">No posts yet</div>
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
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    {userInfo.workplaces.map((workplace, index) => (
                      <div key={index} className="profile-info-work">
                        <div className="profile-info-primary">
                          {workplace.position} at {workplace.company}
                        </div>
                        <div className="profile-info-secondary">
                          {workplace.current ? "Current" : "Past"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    {userInfo.education.map((edu, index) => (
                      <div key={index} className="profile-info-education">
                        <div className="profile-info-primary">
                          {edu.school}
                        </div>
                        {edu.degree && (
                          <div className="profile-info-secondary">
                            {edu.degree}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      Lives in {userInfo.location}
                    </div>
                  </div>
                </div>
                
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      {userInfo.relationship}
                    </div>
                  </div>
                </div>
                
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      Joined {userInfo.joined}
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
                <Link to="/friends" className="see-all-link">See all friends</Link>
              </div>
              <div className="profile-box-content">
                <div className="profile-friends-grid">
                  {friends.map(friend => (
                    <div key={friend.id} className="profile-friend-item">
                      <div className="profile-friend-image">
                        <img 
                          src={`/src/assets/images/profile/${friend.image}`} 
                          alt={friend.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/images/profile/default-avatar.png';
                          }}
                        />
                      </div>
                      <div className="profile-friend-name">{friend.name}</div>
                      <div className="profile-friend-mutual">{friend.mutualFriends} mutual friends</div>
                    </div>
                  ))}
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
                <Link to="/photos" className="see-all-link">See all photos</Link>
              </div>
              <div className="profile-box-content">
                <div className="profile-photos-grid">
                  {photos.map(photo => (
                    <div key={photo.id} className="profile-photo-item">
                      <img 
                        src={`/src/assets/images/profile/${photo.src}`} 
                        alt={`Photo ${photo.id}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/images/profile/default-avatar.png';
                        }}
                      />
                    </div>
                  ))}
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
              {userData ? `${userData.firstname} ${userData.lastname}` : "User Profile"}
            </h1>
            <p className="profile-bio">Community Development Advocate</p>
            <div className="profile-buttons">
              <Button variant="primary">Edit Profile</Button>
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
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      {userInfo.workplaces[0].position} at {userInfo.workplaces[0].company}
                    </div>
                  </div>
                </div>
                
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      Lives in {userInfo.location}
                    </div>
                  </div>
                </div>
                
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      From {userInfo.hometown}
                    </div>
                  </div>
                </div>
                
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                  </div>
                  <div className="profile-info-details">
                    <div className="profile-info-primary">
                      Joined {userInfo.joined}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-box">
              <div className="profile-box-header">
                <h2 className="profile-box-title">Photos</h2>
                <Link to="/photos" className="see-all-link">See all photos</Link>
              </div>
              <div className="profile-box-content">
                <div className="profile-photos-grid">
                  {photos.slice(0, 9).map(photo => (
                    <div key={photo.id} className="profile-photo-item">
                      <img 
                        src={`/src/assets/images/profile/${photo.src}`} 
                        alt={`Photo ${photo.id}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/images/profile/default-avatar.png';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="profile-box">
              <div className="profile-box-header">
                <h2 className="profile-box-title">Friends</h2>
                <Link to="/friends" className="see-all-link">See all friends</Link>
              </div>
              <div className="profile-box-content">
                <div className="profile-friends-grid">
                  {friends.slice(0, 9).map(friend => (
                    <div key={friend.id} className="profile-friend-item">
                      <div className="profile-friend-image">
                        <img 
                          src={`/src/assets/images/profile/${friend.image}`} 
                          alt={friend.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/images/profile/default-avatar.png';
                          }}
                        />
                      </div>
                      <div className="profile-friend-name">{friend.name}</div>
                    </div>
                  ))}
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
        onSubmit={handleCreatePost}
        editPost={editingPost}
        userName={userData ? `${userData.firstname} ${userData.lastname}` : ''}
      />
    </div>
  );
};

export default ProfilePage;