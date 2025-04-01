// src/components/newsfeed/NewsfeedItem.jsx
import React, { useState, useEffect } from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatTimeAgo } from '../../utils/dateUtils';
import ReactMarkdown from 'react-markdown';
import '../../styles/components/newsfeed.css';

const NewsfeedItem = ({ post, onUpdate, onDelete, onLike }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setEditedPost(post);
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editedPost.post_description.trim()) {
      onUpdate(editedPost);
      setIsEditing(false);
    }
  };

  const handleLike = () => {
    onLike(post);
    setIsLiked(true);
    setTimeout(() => setIsLiked(false), 1000);
  };

  return (
    <article className="feed-item">
      <header className="post-header">
      <Avatar 
        src={post.creator_profile_picture || '/src/assets/images/profile/default-avatar.png'} 
        alt={`${post.creator || 'User'}'s profile`} 
        size="medium" 
      />
        <div className="user-info">
          <div className="user-meta">
            <h3 className="username">{post.creator || 'User'}</h3>
            <span className="post-meta">•</span>
            <span className="post-meta">{formatTimeAgo(post.post_date)}</span>
          </div>
          <div className="status-badges">
            {post.post_status && (
              <span className={`status-badge ${post.post_status.toLowerCase() === 'active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                {post.post_status}
              </span>
            )}
            
            {post.post_type && (
              <span className={`post-type-value post-type-${post.post_type.toLowerCase()}`}>
                {post.post_type}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="post-content">
        {isEditing ? (
          <div className="edit-form">
            <textarea
              className="edit-textarea"
              name="post_description"
              value={editedPost.post_description}
              onChange={handleChange}
            />
            <div className="edit-actions">
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <ReactMarkdown>{post.post_description}</ReactMarkdown>
        )}
      </div>

      <footer className="post-actions">
        <button
          className={`like-button ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
        >
          <svg className="heart-icon" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {post.like_count || 0} Likes
        </button>

        <div className="action-buttons">
          <Button 
            variant="icon" 
            onClick={() => setIsEditing(true)}
            className="btn-edit"
          >
            <svg className="edit-icon" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Edit
          </Button>
          <Button 
            variant="icon" 
            onClick={() => onDelete(post.newsfeed_id)}
            className="btn-delete"
          >
            <svg className="delete-icon" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
            Delete
          </Button>
        </div>
      </footer>
    </article>
  );
};

export default NewsfeedItem;