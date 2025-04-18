// src/pages/post/PostPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import NewsfeedItem from '../../components/newsfeed/NewsfeedItem';
import CommentSection from '../../components/newsfeed/CommentSection';
import Button from '../../components/common/Button';
import useNewsfeed from '../../hooks/useNewsfeed';
import useComments from '../../hooks/useComments';
import { getPostById } from '../../services/newsfeedService';
import '../../styles/components/postPage.css';

const PostPage = () => {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localComments, setLocalComments] = useState([]);
  const highlightedCommentRef = useRef(null);
  
  // Get highlighted comment ID from location state (if coming from notification)
  const highlightCommentId = location.state?.highlightCommentId;
  const fromNotification = location.state?.fromNotification;
  
  // Get hooks for post and comments
  const { handleUpdatePost, handleDeletePost, handleLikePost } = useNewsfeed();
  const { 
    comments, 
    fetchComments, 
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment
  } = useComments();
  
  // Update local comments when comments change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);
  
  // Fetch the post and its comments
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        
        // Convert postId to number
        const numericPostId = parseInt(postId, 10);
        if (isNaN(numericPostId)) {
          throw new Error('Invalid post ID');
        }
        
        // Fetch post
        const postData = await getPostById(numericPostId);
        setPost(postData);
        
        // Fetch comments
        await fetchComments(numericPostId);
      } catch (err) {
        console.error('Error loading post:', err);
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [postId, fetchComments]);
  
  // Scroll to highlighted comment when comments are loaded
  useEffect(() => {
    if (highlightCommentId && localComments.length > 0) {
      // Find the highlighted comment DOM element
      const highlightedElement = document.getElementById(`comment-${highlightCommentId}`);
      
      if (highlightedElement) {
        // Scroll to the element
        highlightedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Add highlight animation
        highlightedElement.classList.add('highlighted');
        
        // Remove highlight after animation completes
        setTimeout(() => {
          highlightedElement.classList.remove('highlighted');
        }, 3000);
      }
    }
  }, [localComments, highlightCommentId]);
  
  const handlePostUpdate = async (updatedPost) => {
    try {
      await handleUpdatePost(post.newsfeedId || post.newsfeed_id, updatedPost);
      // Refresh post
      const refreshedPost = await getPostById(postId);
      setPost(refreshedPost);
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };
  
  const handlePostDelete = async () => {
    try {
      await handleDeletePost(post.newsfeedId || post.newsfeed_id);
      // Redirect to newsfeed after deletion
      navigate('/newsfeed');
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };
  
  const handlePostLike = async () => {
    try {
      await handleLikePost(post.newsfeedId || post.newsfeed_id);
      // Refresh post
      const refreshedPost = await getPostById(postId);
      setPost(refreshedPost);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };
  
  // Comment handlers with local state updates
  const handleCommentAdd = async (postId, commentText) => {
    const newComment = await handleAddComment(postId, commentText);
    return newComment;
  };
  
  const handleCommentUpdate = async (commentId, commentText) => {
    const updatedComment = await handleUpdateComment(commentId, commentText);
    return updatedComment;
  };
  
  const handleCommentDelete = async (commentId) => {
    const success = await handleDeleteComment(commentId);
    return success;
  };
  
  // Determine if current user can edit this post
  const isCurrentUserPost = () => {
    if (!post || !post.user) return false;
    
    // We would need to get the current user ID from an auth context or similar
    // This is a simplified example - replace with your actual auth implementation
    const currentUserId = localStorage.getItem('userId');
    return currentUserId && post.user.id === parseInt(currentUserId, 10);
  };
  
  // Render the main content
  if (loading) {
    return (
      <MainLayout>
        <div className="post-page-loading">
          <div className="loading-spinner"></div>
          <p>Loading post...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !post) {
    return (
      <MainLayout>
        <div className="post-page-error">
          <h2>Error Loading Post</h2>
          <p>{error || 'Post not found'}</p>
          <Button variant="primary" onClick={() => navigate('/newsfeed')}>
            Back to Newsfeed
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="post-page">
        {fromNotification && (
          <div className="from-notification-banner">
            <button className="back-button" onClick={() => navigate('/newsfeed')}>
              ← Back to Newsfeed
            </button>
          </div>
        )}
        
        <div className="post-container">
          <NewsfeedItem 
            post={post}
            onUpdate={handlePostUpdate}
            onDelete={handlePostDelete}
            onLike={handlePostLike}
            isCurrentUser={isCurrentUserPost()}
          />
          
          <div className="post-comments-section">
            <h3>Comments</h3>
            <CommentSection 
              postId={post.newsfeedId || post.newsfeed_id}
              comments={localComments}
              onAddComment={handleCommentAdd}
              onUpdateComment={handleCommentUpdate}
              onDeleteComment={handleCommentDelete}
              expanded={true}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostPage;