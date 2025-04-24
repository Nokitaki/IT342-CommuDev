// src/components/newsfeed/NewsfeedItem.jsx
import React, { useState, useEffect } from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import CommentSection from './CommentSection';
import { formatTimeAgo } from '../../utils/dateUtils';
import ReactMarkdown from 'react-markdown';
import useComments from '../../hooks/useComments';
import '../../styles/components/newsfeed.css';

const NewsfeedItem = ({ post, onUpdate, onDelete, onLike, onEdit, isCurrentUser = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // New state for inline confirmation
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete action
  
  // Get the post ID in the correct format
  const postId = post.newsfeed_id || post.newsfeedId;
  
  // Use our custom hook for comments
  const { 
    comments, 
    loading: commentsLoading, 
    error: commentsError, 
    fetchComments,
    handleAddComment,
    getCommentCountForPost
  } = useComments();

  useEffect(() => {
    setEditedPost(post);
    
    // Get initial comment count
    const getInitialCommentCount = async () => {
      if (postId) {
        const count = await getCommentCountForPost(postId);
        setCommentCount(count);
      }
    };
    
    getInitialCommentCount();
  }, [post, postId, getCommentCountForPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Log the post object for debugging
    console.log('Saving edited post:', editedPost);
    
    // Check for post_description (snake_case) which is what our DB uses
    if (editedPost.post_description && editedPost.post_description.trim()) {
      onUpdate(editedPost);
      setIsEditing(false);
    }
  };

  const handleLike = () => {
    // Extract the numeric ID from post
    const numericPostId = parseInt(post.newsfeedId || post.newsfeed_id, 10);
    
    if (isNaN(numericPostId)) {
      console.error('Invalid post ID for liking:', post);
      return;
    }
    
    console.log('Liking post with ID:', numericPostId);
    
    // Call the onLike function with the numeric ID
    onLike(numericPostId);
    
    // Set visual feedback immediately
    setIsLiked(true);
    setTimeout(() => setIsLiked(false), 1000);
  };

  const handleEdit = () => {
    console.log('Editing post with ID:', postId);
    console.log('Post object:', post);
    
    onEdit(post);
  };

  // Modified to show the inline delete confirmation instead of modal
  const handleDelete = () => {
    console.log('Initiating delete for post with ID:', postId);
    setShowDeleteConfirmation(true);
  };
  
  // Handle delete confirmation
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(postId);
      // No need to hide confirmation as the post will be removed from DOM
    } catch (error) {
      console.error('Error deleting post:', error);
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };
  
  // Handle cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };
  
  const handleCommentsClick = () => {
    // Toggle comments visibility
    setShowComments(!showComments);
    
    // If we're showing comments and haven't loaded them yet, fetch them
    if (!showComments && postId) {
      fetchComments(postId);
    }
  };
  
  const handleAddNewComment = async (postId, commentText) => {
    const newComment = await handleAddComment(postId, commentText);
    if (newComment) {
      // Update comment count after adding a new comment
      setCommentCount(prev => prev + 1);
    }
  };

  // Get the username from the user object if available
  const getUsername = () => {
    if (post.user && post.user.username) {
      return post.user.username;
    }
    return post.creator || 'User';
  };

  // Get profile picture
  const getProfilePicture = () => {
    if (post.user && post.user.profilePicture) {
      return post.user.profilePicture.startsWith('http') 
        ? post.user.profilePicture 
        : `http://localhost:8080${post.user.profilePicture}`;
    }
    return post.creator_profile_picture || '/src/assets/images/profile/default-avatar.png';
  };

  // Format post date with proper fallback
  const getFormattedDate = () => {
    // Use either property name
    const postDate = post.post_date || post.postDate;
    
    if (!postDate) {
      return 'Just now'; // Default to "Just now" if no date is provided
    }
    return formatTimeAgo(postDate);
  };

  // Get post description (check both naming styles)
  const getPostDescription = () => {
    return post.post_description || post.postDescription || '';
  };

  // Get post type (check both naming styles)
  const getPostType = () => {
    return post.post_type || post.postType || 'General';
  };

  // Get post status (check both naming styles)
  const getPostStatus = () => {
    return post.post_status || post.postStatus || 'active';
  };

  // Check if the current user can edit this post
  const canEdit = isCurrentUser;

  return (
    <article className="feed-item">
      <header className="post-header">
        <Avatar 
          src={getProfilePicture()} 
          alt={`${getUsername()}'s profile`} 
          size="medium" 
        />
        <div className="user-info">
          <div className="user-meta">
            <h3 className="username">{getUsername()}</h3>
            <span className="post-meta">•</span>
            <span className="post-meta">{getFormattedDate()}</span>
          </div>
          <div className="status-badges">
            {getPostStatus() && (
              <span className={`status-badge ${getPostStatus().toLowerCase() === 'active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                {getPostStatus()}
              </span>
            )}
            
            {getPostType() && (
              <span className={`post-type-value post-type-${getPostType().toLowerCase()}`}>
                {getPostType()}
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
              value={editedPost.post_description || ''}
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
          <ReactMarkdown>{getPostDescription()}</ReactMarkdown>
        )}
      </div>

      {/* Inline Delete Confirmation */}
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <div className="delete-confirmation-message">
            <svg className="delete-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#e53e3e" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          </div>
          <div className="delete-confirmation-actions">
            <Button 
              variant="secondary" 
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="delete" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      )}

      <footer className="post-actions">
        <div className="post-actions-buttons">
          <button
            className={`like-button ${isLiked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <svg className="heart-icon" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {post.like_count || post.likeCount || 0} Likes
          </button>
          
          <button
            className="comment-button"
            onClick={handleCommentsClick}
          >
            <svg className="comment-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            {commentCount} Comments
          </button>
        </div>

        <div className="action-buttons">
          {canEdit && !showDeleteConfirmation && (
            <>
              <Button 
                variant="icon" 
                onClick={handleEdit}
                className="btn-edit"
              >
                <svg className="edit-icon" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                Edit
              </Button>
              <Button 
                variant="icon" 
                onClick={handleDelete}
                className="btn-delete"
              >
                <svg className="delete-icon" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
                Delete
              </Button>
            </>
          )}
        </div>
      </footer>
      
      {/* Comments section */}
      {showComments && (
        <CommentSection 
          postId={postId}
          comments={comments}
          onAddComment={handleAddNewComment}
          expanded={true}
        />
      )}
    </article>
  );
};

export default NewsfeedItem;