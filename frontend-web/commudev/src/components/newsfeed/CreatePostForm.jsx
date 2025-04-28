// src/components/newsfeed/CreatePostForm.jsx
import React from 'react';
import Avatar from '../common/Avatar';
import useProfile from '../../hooks/useProfile';
import API_URL from '../../config/apiConfig';

import "../../styles/components/createPostForm.css";
const CreatePostForm = ({ onOpenModal }) => {
  // Get user profile data
  const { profile } = useProfile();

 

  return (
    <div className="create-post-section">
      <h2 className="feed-title">Community News Feed</h2>
      <div className="create-post-container">
        <div className="create-post-avatar">
          <Avatar 
            src={profile?.profilePicture ? 
              `${API_URL}${profile.profilePicture}` : 
              '../../../public/assets/images/profile/default-avatar.png'
            } 
            alt={(profile?.firstname && profile?.lastname) ? 
                `${profile.firstname} ${profile.lastname}'s profile` : 
                "User profile"} 
            size="medium" 
          />
        </div>
        <div className="post-input-container" onClick={onOpenModal}>
          <div className="post-input">What's on your mind?</div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;