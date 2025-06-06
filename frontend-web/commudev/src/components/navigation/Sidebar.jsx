// src/components/navigation/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserSearch from '../common/UserSearch';
import Avatar from '../common/Avatar';
import PeopleYouMayKnow from '../newsfeed/PeopleYouMayKnow';
import FriendsSidebar from '../friends/FriendsSidebar';
import useProfile from '../../hooks/useProfile';
import '../../styles/components/sidebar.css';
import API_URL from '../../config/apiConfig';
import { getAssetUrl, getProfilePicture } from '../../utils/assetUtils';


const Sidebar = () => {
  // Use profile hook to get the current user data
  const { profile, loading } = useProfile();
  const [profilePicture, setProfilePicture] = useState(null);
  

  
  useEffect(() => {
    // When profile is loaded, update the profile picture
    if (profile?.profilePicture) {
      setProfilePicture(`${API_URL}${profile.profilePicture}`);
    }
  }, [profile]);

  // Get user full name
  const getFullName = () => {
    if (profile) {
      if (profile.firstname && profile.lastname) {
        return `${profile.firstname} ${profile.lastname}`;
      } else if (profile.firstname) {
        return profile.firstname;
      } else if (profile.username) {
        return profile.username;
      }
    }
    return 'Loading...';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/newsfeed" className="logo-container">
          <img 
            src={getAssetUrl('/assets/images/logo.png')}
            alt="CommuDev Logo" 
            className="logo-image" 
          />
        </Link>
        <UserSearch />
      </div>

      <Link to="/profile" className="profile-sidebar-link">
        <div className="profile-sidebar">
          <Avatar 
            src={profilePicture || getProfilePicture({})}
            alt={getFullName()} 
            size="medium"
          />
          <div className="profile-info">
            <h4>{loading ? "Loading..." : getFullName()}</h4>
          </div>
        </div>
      </Link>

      {/* Replace Community section with Friends section */}
      <FriendsSidebar />

      {/* People You May Know component */}
      <PeopleYouMayKnow />
    </aside>
  );
};

export default Sidebar;