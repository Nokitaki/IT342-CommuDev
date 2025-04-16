// src/hooks/useComments.js
import { useState, useEffect, useCallback } from 'react';
import { 
  getCommentsByPostId, 
  addComment, 
  updateComment, 
  deleteComment, 
  getCommentCount 
} from '../services/commentService';

const useComments = (initialPostId = null) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Fetch comments for a post
  const fetchComments = useCallback(async (postId) => {
    if (!postId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching comments for post ${postId}`);
      const commentsData = await getCommentsByPostId(postId);
      
      // Sort comments by date (oldest first for a natural conversation flow)
      const sortedComments = commentsData.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      
      setComments(sortedComments);
      console.log(`Fetched ${sortedComments.length} comments for post ${postId}`);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load comments for initialPostId if provided
  useEffect(() => {
    if (initialPostId) {
      fetchComments(initialPostId);
    }
  }, [initialPostId, fetchComments, lastRefresh]);

  // Function to add a new comment
  const handleAddComment = async (postId, commentText) => {
    setLoading(true);
    setError(null);
    
    try {
      const newComment = await addComment(postId, commentText);
      console.log('New comment added:', newComment);
      
      // Add the new comment to the existing comments
      setComments(prevComments => [...prevComments, newComment]);
      
      return newComment;
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to update a comment
  const handleUpdateComment = async (commentId, commentText) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedComment = await updateComment(commentId, commentText);
      console.log('Comment updated:', updatedComment);
      
      // Update the comment in the state
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.commentId === commentId ? updatedComment : comment
        )
      );
      
      return updatedComment;
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a comment
  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await deleteComment(commentId);
      console.log('Comment deletion success:', success);
      
      if (success) {
        // Remove the comment from the state
        setComments(prevComments => 
          prevComments.filter(comment => comment.commentId !== commentId)
        );
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to get comment count
  const getCommentCountForPost = async (postId) => {
    try {
      const count = await getCommentCount(postId);
      return count;
    } catch (err) {
      console.error('Error getting comment count:', err);
      return 0;
    }
  };

  // Function to refresh comments
  const refreshComments = () => {
    setLastRefresh(Date.now());
  };

  return {
    comments,
    loading,
    error,
    fetchComments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    getCommentCountForPost,
    refreshComments
  };
};

export default useComments;