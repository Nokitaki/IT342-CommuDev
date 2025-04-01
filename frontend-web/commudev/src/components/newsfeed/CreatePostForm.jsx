// src/components/newsfeed/CreatePostForm.jsx
import React from 'react';
import Avatar from '../common/Avatar';
import useAuth from '../../hooks/useAuth';
import '../../styles/components/createPostForm.css'; // Adjust the path as necessary

const CreatePostForm = ({ onOpenModal }) => {
  const { userData, profilePicture } = useAuth();

  return (
    <div className="create-post-section">
      <h2 className="feed-title">Community News Feed</h2>
      <div className="create-post-container" onClick={onOpenModal}>
        <div className="create-post-avatar">
        <Avatar 
          src={profilePicture || '/src/assets/images/profile/default-avatar.png'} 
          alt={(userData?.firstname && userData?.lastname) ? 
              `${userData.firstname} ${userData.lastname}'s profile` : 
              "User profile"} 
          size="medium" 
        />
        </div>
        <div className="post-input-container">
          <input
            type="text"
            placeholder="What's on your mind?"
            className="post-input"
            readOnly
            onClick={onOpenModal}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;