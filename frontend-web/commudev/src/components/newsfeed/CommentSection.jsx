// src/components/newsfeed/CommentSection.jsx
import React, { useState, useEffect } from 'react';
import Avatar from '../common/Avatar';
import useProfile from '../../hooks/useProfile';
import { formatTimeAgo } from '../../utils/dateUtils';
import useComments from '../../hooks/useComments';
import '../../styles/components/comments.css';

const CommentSection = ({ postId, comments = [], onAddComment, expanded = false }) => {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [localComments, setLocalComments] = useState([]);
  const { profile } = useProfile();
  const { 
    handleUpdateComment, 
    handleDeleteComment,
    fetchComments 
  } = useComments();
  
  // API URL for images
  const API_URL = 'http://localhost:8080';

  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);
  
  // Refresh comments after an edit or delete
  const refreshComments = async () => {
    if (postId) {
      const freshComments = await fetchComments(postId);
      if (freshComments) {
        setLocalComments(freshComments);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    
    const success = await onAddComment(postId, newComment);
    if (success) {
      setNewComment('');
      // Refresh comments after adding
      refreshComments();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    // Fetch comments when expanding if we haven't already
    if (!isExpanded && localComments.length === 0) {
      refreshComments();
    }
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

  // Check if comment belongs to current user
  const isCurrentUserComment = (comment) => {
    if (!profile || !comment.user) return false;
    return profile.id === comment.user.id || profile.username === comment.user.username;
  };

  // Handle edit comment start
  const handleEditClick = (comment) => {
    console.log("Starting edit for comment:", comment);
    // Always use commentText if available, otherwise try other properties
    const textToEdit = comment.commentText || comment.content || comment.text || '';
    setEditingCommentId(comment.commentId);
    setEditText(textToEdit);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  // Handle save edit
  const handleSaveEdit = async (commentId) => {
    if (!commentId || editText.trim() === '') {
      console.error("Invalid comment ID or empty text");
      return;
    }
    
    console.log(`Saving edit for comment ${commentId} with text: ${editText}`);
    
    try {
      const result = await handleUpdateComment(commentId, editText);
      console.log("Update result:", result);
      
      if (result) {
        // Update the comment locally to avoid needing a refresh
        setLocalComments(prevComments => 
          prevComments.map(c => 
            c.commentId === commentId ? { ...c, commentText: editText } : c
          )
        );
        
        // Also refresh from server
        refreshComments();
      }
      
      setEditingCommentId(null);
      setEditText('');
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment. Please try again.");
    }
  };

  // Handle delete comment
  const handleDelete = async (commentId) => {
    if (!commentId) {
      console.error("Invalid comment ID for deletion");
      return;
    }
    
    console.log(`Attempting to delete comment ${commentId}`);
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const success = await handleDeleteComment(commentId);
        console.log("Delete result:", success);
        
        if (success) {
          // Remove the comment locally
          setLocalComments(prevComments => 
            prevComments.filter(c => c.commentId !== commentId)
          );
          
          // Also refresh from server
          refreshComments();
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment. Please try again.");
      }
    }
  };

  return (
    <div className="comments-section">
      {localComments.length > 0 && (
        <button 
          className="comments-toggle" 
          onClick={toggleExpanded}
        >
          {isExpanded ? 'Hide' : 'Show'} {localComments.length} {localComments.length === 1 ? 'comment' : 'comments'}
        </button>
      )}
      
      {isExpanded && localComments.length > 0 && (
        <div className="comments-list">
          {localComments.map((comment, index) => (
            <div key={comment.commentId || `comment-${index}`} className="comment-item">
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
                
                {editingCommentId === comment.commentId ? (
                  <div className="comment-edit-form">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="comment-edit-textarea"
                    />
                    <div className="comment-edit-actions">
                      <button
                        type="button"
                        className="comment-edit-btn save-btn"
                        onClick={() => handleSaveEdit(comment.commentId)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="comment-edit-btn cancel-btn"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="comment-text-container">
                    <div className="comment-text">
                      {comment.commentText || comment.content || comment.text || ''}
                    </div>
                    
                    {isCurrentUserComment(comment) && (
                      <div className="comment-actions">
                        <button
                          type="button"
                          className="comment-action-btn edit-btn"
                          onClick={() => handleEditClick(comment)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="comment-action-btn delete-btn"
                          onClick={() => handleDelete(comment.commentId)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
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