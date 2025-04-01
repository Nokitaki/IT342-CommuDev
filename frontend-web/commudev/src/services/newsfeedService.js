// src/services/newsfeedService.js
import axios from 'axios';
import { getApiConfig } from './api';

const API_URL = 'http://localhost:8080/api/newsfeed';

/**
 * Fetch all posts from the server
 * @returns {Promise<Array>} Array of post objects
 */
export const fetchAllPosts = async () => {
  try {
    // COMMENTED: Real API call
    /*
    const response = await axios.get(`${API_URL}/getAllFeedDetails`, getApiConfig());
    
    if (!response.data) {
      return [];
    }
    
    // Process posts with profile pictures
    const postsWithProfilePictures = await Promise.all(
      response.data.map(async (post) => {
        try {
          const userResponse = await axios.get(
            `http://localhost:8080/api/user/${post.creator_id}`,
            getApiConfig()
          );
          const userData = userResponse.data;
          return {
            ...post,
            type: post.post_type,
            creator_profile_picture: userData.profilePicture
              ? `http://localhost:8080${userData.profilePicture}`
              : null,
          };
        } catch (error) {
          console.error(
            `Error fetching profile picture for post ${post.newsfeed_id}:`,
            error
          );
          return {
            ...post,
            type: post.post_type,
            creator_profile_picture: null,
          };
        }
      })
    );

    return postsWithProfilePictures;
    */
    
    // Return mock posts data
    return [
      {
        newsfeed_id: 1,
        creator: 'John Doe',
        creator_id: 1,
        post_description: 'This is a test announcement for the community. Everyone please take note of the upcoming changes to our schedule.',
        post_type: 'Announcement',
        post_date: new Date().toISOString(),
        post_status: 'Active',
        like_count: 15,
        creator_profile_picture: null
      },
      {
        newsfeed_id: 2,
        creator: 'Jane Smith',
        creator_id: 2,
        post_description: 'Upcoming community event this weekend! Everyone is welcome to join us for food, games, and networking. The event starts at 2 PM at the community center.',
        post_type: 'Event',
        post_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        post_status: 'Active',
        like_count: 24,
        creator_profile_picture: null
      },
      {
        newsfeed_id: 3,
        creator: 'John Doe',
        creator_id: 1,
        post_description: 'Don\'t forget to submit your monthly reports by Friday. Late submissions may not be accepted without prior notice.',
        post_type: 'Reminder',
        post_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        post_status: 'Active',
        like_count: 7,
        creator_profile_picture: null
      },
      {
        newsfeed_id: 4,
        creator: 'Maria Rodriguez',
        creator_id: 3,
        post_description: 'The community garden project is making great progress! Thanks to everyone who volunteered last weekend. We\'ll be planting new flowers next Saturday.',
        post_type: 'Announcement',
        post_date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        post_status: 'Active',
        like_count: 32,
        creator_profile_picture: null
      },
      {
        newsfeed_id: 5,
        creator: 'David Wilson',
        creator_id: 4,
        post_description: 'Reminder: The quarterly meeting has been rescheduled to next Wednesday at 10 AM. Please update your calendars accordingly.',
        post_type: 'Reminder',
        post_date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        post_status: 'Inactive',
        like_count: 12,
        creator_profile_picture: null
      }
    ];
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
    // COMMENTED: Real API call
    /*
    const formatted = {
      ...postData,
      post_date: new Date(postData.post_date).toISOString(),
      like_count: 0,
      post_status: "Active",
    };
    
    const response = await axios.post(
      `${API_URL}/addFeedDetails`,
      formatted,
      getApiConfig()
    );
    
    return response.data;
    */
    
    // Mock successful post creation
    console.log('Mock create post with data:', postData);
    
    // Create a new post with an ID and return it
    return {
      newsfeed_id: Math.floor(Math.random() * 1000) + 6, // Random ID starting from 6
      creator: postData.creator || 'John Doe',
      creator_id: 1,
      post_description: postData.post_description,
      post_type: postData.post_type,
      post_date: new Date(postData.post_date).toISOString(),
      post_status: "Active",
      like_count: 0,
      creator_profile_picture: null
    };
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
    // COMMENTED: Real API call
    /*
    const formatted = {
      ...postData,
      post_date: new Date(postData.post_date).toISOString(),
      newsfeed_id: postId
    };
    
    const response = await axios.put(
      `${API_URL}/updateFeedDetails?newsfeed_id=${postId}`,
      formatted,
      getApiConfig()
    );
    
    return response.data;
    */
    
    // Mock successful post update
    console.log(`Mock update post ${postId} with data:`, postData);
    
    // Return the updated post
    return {
      ...postData,
      newsfeed_id: postId,
      post_date: new Date(postData.post_date).toISOString()
    };
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
    // COMMENTED: Real API call
    /*
    await axios.delete(
      `${API_URL}/deleteFeed/${postId}`,
      getApiConfig()
    );
    */
    
    // Mock successful post deletion
    console.log(`Mock delete post ${postId}`);
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
};

/**
 * Like a post
 * @param {number} postId - ID of the post to like
 * @param {number} currentLikes - Current number of likes
 * @returns {Promise<Object>} Updated post object
 */
export const likePost = async (postId, currentLikes = 0) => {
  try {
    // COMMENTED: Real API call
    /*
    const response = await axios.patch(
      `${API_URL}/like/${postId}`,
      { like_count: (currentLikes || 0) + 1 },
      getApiConfig()
    );
    
    return response.data;
    */
    
    // Mock successful like
    console.log(`Mock like post ${postId}, current likes: ${currentLikes}`);
    
    // Find the post in mock data (assuming it's one of the ones we defined earlier)
    const mockPosts = await fetchAllPosts();
    const post = mockPosts.find(p => p.newsfeed_id === postId);
    
    if (post) {
      // Return updated post with incremented like count
      return {
        ...post,
        like_count: (currentLikes || 0) + 1
      };
    } else {
      // If not found, return a generic response
      return {
        newsfeed_id: postId,
        like_count: (currentLikes || 0) + 1
      };
    }
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Failed to like post');
  }
};