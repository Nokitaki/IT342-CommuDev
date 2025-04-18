// src/components/newsfeed/CommentSection.jsx
import React, { useState, useEffect } from 'react';
import Avatar from '../common/Avatar';
import useProfile from '../../hooks/useProfile';
import { formatTimeAgo } from '../../utils/dateUtils';
import '../../styles/components/comments.css';

const CommentSection = ({ postId, comments = [], onAddComment, expanded = false }) => {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(expanded);
  const { profile } = useProfile();
  
  // API URL for images
  const API_URL = 'http://localhost:8080';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    
    onAddComment(postId, newComment);
    setNewComment('');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Get user's profile picture
  const getProfilePicture = () => {
    if (profile?.profilePicture) {
      return `${API_URL}${profile.profilePicture}`;
    }
    return '/src/assets/images/profile/default-avatar.png';
  };

  // Get commenter's profile picture
  const getCommenterPicture = (comment) => {
    if (comment.user?.profilePicture) {
      return comment.user.profilePicture.startsWith('http') 
        ? comment.user.profilePicture 
        : `${API_URL}${comment.user.profilePicture}`;
    }
    return '/src/assets/images/profile/default-avatar.png';
  };

  // Get commenter's name
  const getCommenterName = (comment) => {
    if (comment.user) {
      if (comment.user.firstname && comment.user.lastname) {
        return `${comment.user.firstname} ${comment.user.lastname}`;
      } else if (comment.user.firstname) {
        return comment.user.firstname;
      } else if (comment.user.username) {
        return comment.user.username;
      }
    }
    return comment.username || 'User';
  };

  return (
    <div className="comments-section">
      {comments.length > 0 && (
        <button 
          className="comments-toggle" 
          onClick={toggleExpanded}
        >
          {isExpanded ? 'Hide' : 'Show'} {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </button>
      )}
      
      {isExpanded && comments.length > 0 && (
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={comment.commentId || index} className="comment-item">
              <Avatar
                src={getCommenterPicture(comment)}
                alt={`${getCommenterName(comment)}'s profile`}
                size="small"
              />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-username">{getCommenterName(comment)}</span>
                  <span className="comment-time">
                    {formatTimeAgo(comment.createdAt || comment.created_at)}
                  </span>
                </div>
                <div className="comment-text">
                  {comment.commentText || comment.content || comment.text || ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <form className="comment-form" onSubmit={handleSubmit}>
        <Avatar
          src={getProfilePicture()}
          alt="Your profile"
          size="small"
        />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
        />
        <button 
          type="submit" 
          className="comment-submit"
          disabled={!newComment.trim()}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;