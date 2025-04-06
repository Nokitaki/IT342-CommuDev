// src/pages/profile/PublicProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile } from '../../services/authService';
import '../../styles/pages/publicProfile.css';

const PublicProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const data = await getPublicProfile(username);
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="not-found-container">Profile not found</div>;
  }

  // Check if profile is private
  if (profile.profileVisibility === 'PRIVATE') {
    return (
      <div className="private-profile-container">
        <h2>Private Profile</h2>
        <p>This profile is private and only visible to the user.</p>
        <Link to="/newsfeed" className="back-link">Back to Newsfeed</Link>
      </div>
    );
  }

  return (
    <div className="public-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={profile.profilePicture || '/src/assets/images/profile/default-avatar.png'} 
            alt={`${profile.firstname} ${profile.lastname}`} 
          />
        </div>
        
        <div className="profile-name-section">
          <h1>{profile.firstname} {profile.lastname}</h1>
          <p className="username">@{profile.username}</p>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h2>About</h2>
          <p>{profile.biography || 'No biography provided.'}</p>
        </div>
        
        {profile.country && (
          <div className="profile-section">
            <h2>Location</h2>
            <p>{profile.country}</p>
          </div>
        )}
        
        {/* Other sections like posts, photos, etc. can be added here */}
      </div>
      
      <div className="profile-footer">
        <Link to="/newsfeed" className="back-link">Back to Newsfeed</Link>
      </div>
    </div>
  );
};

export default PublicProfilePage;