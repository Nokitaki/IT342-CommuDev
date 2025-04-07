// src/services/newsfeedService.js

/**
 * Fetch all posts from the server
 * @returns {Promise<Array>} Array of post objects
 */
export const fetchAllPosts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/newsfeed/all', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching posts: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts from server');
  }
};

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post object
 */
export const createPost = async (postData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Format the data to match backend expectations
    const formattedData = {
      post_description: postData.post_description,
      post_type: postData.post_type,
      post_status: postData.post_status || 'active'
    };
    
    const response = await fetch('http://localhost:8080/api/newsfeed/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error creating post: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
};

/**
 * Update an existing post
 * @param {number} postId - ID of the post to update
 * @param {Object} postData - Updated post data
 * @returns {Promise<Object>} Updated post object
 */
export const updatePost = async (postId, postData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Format the data to match backend expectations
    const formattedData = {
      post_description: postData.post_description,
      post_type: postData.post_type,
      post_status: postData.post_status || 'active'
    };
    
    const response = await fetch(`http://localhost:8080/api/newsfeed/update/${postId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error updating post: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }
};

/**
 * Delete a post
 * @param {number} postId - ID of the post to delete
 * @returns {Promise<boolean>} True if successful
 */
export const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:8080/api/newsfeed/delete/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error deleting post: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
};

/**
 * Like a post
 * @param {number} postId - ID of the post to like
 * @returns {Promise<Object>} Updated post object
 */
export const likePost = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:8080/api/newsfeed/like/${postId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error liking post: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Failed to like post');
  }
};

/**
 * Get current user's posts
 * @returns {Promise<Array>} Array of the current user's posts
 */
export const fetchMyPosts = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:8080/api/newsfeed/my-posts', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching your posts: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching your posts:', error);
    throw new Error('Failed to fetch your posts');
  }
};

/**
 * Get posts by username
 * @param {string} username - Username to fetch posts for
 * @returns {Promise<Array>} Array of user's posts
 */
export const fetchUserPosts = async (username) => {
  try {
    const response = await fetch(`http://localhost:8080/api/newsfeed/user/${username}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching user posts: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw new Error('Failed to fetch user posts');
  }
};