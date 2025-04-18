// src/services/commentService.js

const API_URL = 'http://localhost:8080/api/comments';

/**
 * Get comments for a post
 * @param {number} postId - Post ID
 * @returns {Promise<Array>} Array of comments
 */
export const getCommentsByPostId = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Add token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/post/${postId}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const comments = await response.json();
    console.log('Raw comments from API:', comments);
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
};

/**
 * Add a comment to a post
 * @param {number} postId - Post ID
 * @param {string} commentText - Comment text
 * @returns {Promise<Object>} Created comment
 */
export const addComment = async (postId, commentText) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required to add a comment');
    }
    
    console.log('Adding comment:', { postId, commentText });
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        postId: postId,
        commentText: commentText
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    const newComment = await response.json();
    console.log('Comment added successfully:', newComment);
    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error(error.message || 'Failed to add comment');
  }
};

/**
 * Update a comment
 * @param {number} commentId - Comment ID
 * @param {string} commentText - New comment text
 * @returns {Promise<Object>} Updated comment
 */
export const updateComment = async (commentId, commentText) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required to update a comment');
    }
    
    const response = await fetch(`${API_URL}/${commentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ commentText })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating comment:', error);
    throw new Error(error.message || 'Failed to update comment');
  }
};

/**
 * Delete a comment
 * @param {number} commentId - Comment ID
 * @returns {Promise<boolean>} True if successful
 */
export const deleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required to delete a comment');
    }
    
    const response = await fetch(`${API_URL}/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error(error.message || 'Failed to delete comment');
  }
};

/**
 * Get comment count for a post
 * @param {number} postId - Post ID
 * @returns {Promise<number>} Number of comments
 */
export const getCommentCount = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/count/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching comment count:', error);
    return 0; // Return 0 instead of throwing to prevent UI disruption
  }
};