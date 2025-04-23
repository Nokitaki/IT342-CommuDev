// src/services/newsfeedService.js


const API_URL = 'http://localhost:8080';


/**
 * Fetch all posts from the server
 * @returns {Promise<Array>} Array of post objects
 */
export const fetchAllPosts = async () => {
  try {
    // Use a more robust approach for token handling
    const token = localStorage.getItem('token');
    
    // Make fetch request with better error handling
    const response = await fetch('http://localhost:8080/api/newsfeed/all', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      credentials: 'include' // Include credentials for CORS
    });
    
    // Log the response status for debugging
    console.log(`Fetch posts response status: ${response.status}`);
    
    if (!response.ok) {
      // Try to get more detailed error information
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error status: ${response.status}`;
      } catch (e) {
        errorMessage = `Error fetching posts: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Log the first post to see its structure
    if (data.length > 0) {
      console.log('Sample post structure:', data[0]);
    }
    
    console.log(`Fetched ${data.length} posts successfully`);
    return data;
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
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    // Include BOTH naming styles to handle any backend mapper issues
    const formattedData = {
      // snake_case (database column names)
      post_description: postData.post_description || postData.postDescription || '',
      post_type: postData.post_type || postData.postType || 'General',
      post_status: postData.post_status || postData.postStatus || 'active',
      post_date: postData.post_date || postData.postDate || new Date().toISOString(),
      like_count: postData.like_count || postData.likeCount || 0,
      
      // camelCase (Java entity property names)
      postDescription: postData.post_description || postData.postDescription || '',
      postType: postData.post_type || postData.postType || 'General',
      postStatus: postData.post_status || postData.postStatus || 'active',
      postDate: postData.post_date || postData.postDate || new Date().toISOString(),
      likeCount: postData.like_count || postData.likeCount || 0
    };
    
    console.log('Creating post with data:', formattedData);
    
    const response = await fetch('http://localhost:8080/api/newsfeed/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formattedData)
    });
    
    console.log(`Create post response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error creating post: ${response.status}`;
      } catch (e) {
        errorMessage = `Error creating post: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const createdPost = await response.json();
    console.log('Post created successfully:', createdPost);
    
    // Normalize the response to include both property styles
    const normalizedPost = {
      ...createdPost,
      // Ensure we have snake_case properties
      newsfeed_id: createdPost.newsfeedId || createdPost.newsfeed_id,
      post_description: createdPost.postDescription || createdPost.post_description || '',
      post_type: createdPost.postType || createdPost.post_type || 'General',
      post_status: createdPost.postStatus || createdPost.post_status || 'active',
      post_date: createdPost.postDate || createdPost.post_date,
      like_count: createdPost.likeCount || createdPost.like_count || 0,
      
      // And camelCase properties
      newsfeedId: createdPost.newsfeedId || createdPost.newsfeed_id,
      postDescription: createdPost.postDescription || createdPost.post_description || '',
      postType: createdPost.postType || createdPost.post_type || 'General',
      postStatus: createdPost.postStatus || createdPost.post_status || 'active',
      postDate: createdPost.postDate || createdPost.post_date,
      likeCount: createdPost.likeCount || createdPost.like_count || 0
    };
    
    return normalizedPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(error.message || 'Failed to create post');
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
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    // Convert any postId to a number
    const numericPostId = parseInt(postId, 10);
    if (isNaN(numericPostId)) {
      throw new Error('Invalid post ID');
    }
    
    console.log(`Attempting to delete post with ID: ${numericPostId}`);
    
    // Instead of deleting, we'll try to update the status to "deleted"
    const softDeleteData = {
      post_status: "deleted",
      postStatus: "deleted"
    };
    
    // Try soft delete first (update status to "deleted")
    try {
      const response = await fetch(`http://localhost:8080/api/newsfeed/update/${numericPostId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(softDeleteData)
      });
      
      console.log(`Soft delete response status: ${response.status}`);
      
      if (response.ok) {
        console.log('Post soft-deleted successfully');
        return true;
      }
      
      // If soft delete failed, try hard delete as a fallback
      console.log('Soft delete failed, attempting hard delete');
    } catch (error) {
      console.warn('Error during soft delete, attempting hard delete:', error);
    }
    
    // Try hard delete (this may still fail due to foreign key constraints)
    const deleteResponse = await fetch(`http://localhost:8080/api/newsfeed/delete/${numericPostId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log(`Hard delete response status: ${deleteResponse.status}`);
    
    if (!deleteResponse.ok) {
      let errorMessage;
      try {
        const errorData = await deleteResponse.json();
        errorMessage = errorData.error || errorData.message || `Error deleting post: ${deleteResponse.status}`;
        
        // If the error contains foreign key constraint, suggest an alternative
        if (errorMessage.includes('foreign key constraint')) {
          throw new Error('Cannot delete post with comments. Try hiding it instead.');
        }
        
        throw new Error(errorMessage);
      } catch (e) {
        throw e; // Re-throw the already formatted error
      }
    }
    
    console.log('Post hard-deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
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
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    console.log(`Attempting to like post with ID: ${postId}`);
    
    const response = await fetch(`http://localhost:8080/api/newsfeed/like/${postId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log(`Like post response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error liking post: ${response.status}`;
      } catch (e) {
        errorMessage = `Error liking post: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const updatedPost = await response.json();
    console.log('Post liked successfully:', updatedPost);
    return updatedPost;
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error(error.message || 'Failed to like post');
  }
};

/**
 * Get current user's posts
 * @returns {Promise<Array>} Array of the current user's posts
 */
export const fetchMyPosts = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    console.log('Fetching current user posts');
    
    const response = await fetch('http://localhost:8080/api/newsfeed/my-posts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log(`Fetch my posts response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error fetching your posts: ${response.status}`;
      } catch (e) {
        errorMessage = `Error fetching your posts: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const posts = await response.json();
    
    // Log the first post to see its structure
    if (posts.length > 0) {
      console.log('Sample user post structure:', posts[0]);
    }
    
    console.log(`Fetched ${posts.length} of your posts successfully`);
    return posts;
  } catch (error) {
    console.error('Error fetching your posts:', error);
    throw new Error(error.message || 'Failed to fetch your posts');
  }
};

/**
 * Get posts by username
 * @param {string} username - Username to fetch posts for
 * @returns {Promise<Array>} Array of user's posts
 */
export const fetchUserPosts = async (username) => {
  try {
    console.log(`Fetching posts for user: ${username}`);
    
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Add token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`http://localhost:8080/api/newsfeed/user/${username}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    });
    
    console.log(`Fetch user posts response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error fetching user posts: ${response.status}`;
      } catch (e) {
        errorMessage = `Error fetching user posts: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const posts = await response.json();
    
    // Log the first post to see its structure
    if (posts.length > 0) {
      console.log('Sample post structure for user posts:', posts[0]);
    }
    
    console.log(`Fetched ${posts.length} posts for user ${username}`);
    return posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw new Error(error.message || 'Failed to fetch user posts');
  }
};



export const updatePost = async (postId, postData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    // Convert any postId to a number
    const numericPostId = parseInt(postId, 10);
    if (isNaN(numericPostId)) {
      throw new Error('Invalid post ID');
    }
    
    // Important: Format the data properly
    // Make sure we have the essential fields in the right format
    const formattedData = {
      post_description: postData.post_description || postData.postDescription || '',
      post_type: postData.post_type || postData.postType || 'General',
      post_status: postData.post_status || postData.postStatus || 'active'
    };
    
    console.log(`Updating post ${numericPostId} with data:`, formattedData);
    
    const response = await fetch(`http://localhost:8080/api/newsfeed/update/${numericPostId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formattedData)
    });
    
    console.log(`Update post response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error updating post: ${response.status}`;
      } catch (e) {
        errorMessage = `Error updating post: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const updatedPost = await response.json();
    console.log('Post updated successfully:', updatedPost);
    
    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Add this function to src/services/newsfeedService.js

/**
 * Get a post by ID
 * @param {number} postId - ID of the post to get
 * @returns {Promise<Object>} Post object
 */
export const getPostById = async (postId) => {
  try {
    console.log(`Fetching post with ID: ${postId}`);
    
    const response = await fetch(`http://localhost:8080/api/newsfeed/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log(`Get post response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error getting post: ${response.status}`;
      } catch (e) {
        errorMessage = `Error getting post: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const post = await response.json();
    console.log('Post retrieved successfully:', post);
    return post;
  } catch (error) {
    console.error('Error getting post:', error);
    throw new Error(error.message || 'Failed to get post');
  }

};







/**
 * Toggle like on a post
 * @param {number} postId - ID of the post to like/unlike
 * @returns {Promise<Object>} Updated post and like status
 */
export const toggleLikePost = async (postId) => {
  try {
    // Ensure postId is a number
    const numericPostId = parseInt(postId, 10);
    
    if (isNaN(numericPostId)) {
      throw new Error(`Invalid post ID: ${postId}`);
    }
    
    console.log(`Making API request to toggle like for post with ID: ${numericPostId}`);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const response = await fetch(`http://localhost:8080/api/newsfeed/like/${numericPostId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log(`Like API response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage = `Error toggling like: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Ignore parsing errors
      }
      throw new Error(errorMessage);
    }
    
    const responseData = await response.json();
    console.log('Like API response data:', responseData);
    
    // Ensure we have a consistent response format
    return {
      post: responseData.post || {},
      liked: responseData.liked || false,
      likeCount: responseData.likeCount || responseData.post?.likeCount || responseData.post?.like_count || 0
    };
  } catch (error) {
    console.error('Error in toggleLikePost service:', error);
    throw error;
  }
};

/**
 * Check if current user has liked a post
 * @param {number} postId - ID of the post to check
 * @returns {Promise<boolean>} True if user has liked the post
 */
export const checkUserLiked = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return false; // Not authenticated
    }
    
    const response = await fetch(`http://localhost:8080/api/newsfeed/liked/${postId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      console.error(`Error checking like status: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    return data.liked;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
};

/**
 * Get like status for a post
 * @param {number} postId - ID of the post
 * @returns {Promise<Object>} Like status with liked flag and count
 */
export const getLikeStatus = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    
    // If there's no token, return default values without making the API call
    if (!token) {
      return { liked: false, likeCount: 0 };
    }
    
    const response = await fetch(`${API_URL}/api/newsfeed/like-status/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      return { liked: false, likeCount: 0 };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting like status:', error);
    return { liked: false, likeCount: 0 };
  }
};