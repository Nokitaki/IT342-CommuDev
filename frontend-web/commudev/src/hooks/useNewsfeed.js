// src/hooks/useNewsfeed.js
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchAllPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  toggleLikePost, // Updated import
  checkUserLiked, // New import
  getLikeStatus, // New import
  fetchMyPosts,
  fetchUserPosts,
  getPostById
} from '../services/newsfeedService';

const useNewsfeed = (initialUsername = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [likeStatuses, setLikeStatuses] = useState({}); // Track like statuses

  // Load like statuses for all posts
  const loadLikeStatuses = async (postsToCheck) => {
    try {
      const statuses = {};
      
      // Get like status for each post
      for (const post of postsToCheck) {
        const postId = post.newsfeedId || post.newsfeed_id;
        
        if (postId) {
          const status = await getLikeStatus(postId);
          statuses[postId] = {
            liked: status.liked,
            likeCount: status.likeCount
          };
        }
      }
      
      setLikeStatuses(statuses);
    } catch (error) {
      console.error('Error loading like statuses:', error);
    }
  };

  // Use useCallback to memoize functions
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading all posts...');
      try {
        // First try to get all posts
        const postsData = await fetchAllPosts();
        // Log each post ID for debugging
        postsData.forEach(post => {
          console.log(`Post ID: ${post.newsfeedId}, type: ${typeof post.newsfeedId}`);
        });
        
        // Sort posts by date (newest first)
        const sortedPosts = postsData.sort((a, b) => {
          return new Date(b.post_date || b.postDate || 0) - new Date(a.post_date || a.postDate || 0);
        });
        setPosts(sortedPosts);
        console.log('Posts loaded successfully:', sortedPosts.length);
        
        // Load like statuses for all posts
        loadLikeStatuses(sortedPosts);
      } catch (error) {
        console.error('Error loading all posts, falling back to my posts:', error);
        
        // If that fails, try to get just the user's posts
        const myPostsData = await fetchMyPosts();
        // Log each post ID for debugging
        myPostsData.forEach(post => {
          console.log(`My Post ID: ${post.newsfeedId}, type: ${typeof post.newsfeedId}`);
        });
        
        // Sort posts by date (newest first)
        const sortedPosts = myPostsData.sort((a, b) => {
          return new Date(b.post_date || b.postDate || 0) - new Date(a.post_date || a.postDate || 0);
        });
        setPosts(sortedPosts);
        console.log('Fallback: My posts loaded successfully:', sortedPosts.length);
        
        // Load like statuses for all posts
        loadLikeStatuses(sortedPosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading my posts...');
      const postsData = await fetchMyPosts();
      
      // Log each post ID for debugging
      postsData.forEach(post => {
        console.log(`My Post ID: ${post.newsfeedId}, type: ${typeof post.newsfeedId}`);
      });
      
      // Sort posts by date (newest first)
      const sortedPosts = postsData.sort((a, b) => {
        return new Date(b.post_date || b.postDate || 0) - new Date(a.post_date || a.postDate || 0);
      });
      setPosts(sortedPosts);
      console.log('My posts loaded successfully:', sortedPosts.length);
      
      // Load like statuses
      loadLikeStatuses(sortedPosts);
    } catch (error) {
      console.error('Error loading my posts:', error);
      setError('Failed to load your posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserPosts = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Loading posts for user: ${username}`);
      const postsData = await fetchUserPosts(username);
      
      // Log each post ID for debugging
      postsData.forEach(post => {
        console.log(`User Post ID: ${post.newsfeedId}, type: ${typeof post.newsfeedId}`);
      });
      
      // Sort posts by date (newest first)
      const sortedPosts = postsData.sort((a, b) => {
        return new Date(b.post_date || b.postDate || 0) - new Date(a.post_date || a.postDate || 0);
      });
      setPosts(sortedPosts);
      console.log(`User posts loaded successfully:`, sortedPosts.length);
      
      // Load like statuses
      loadLikeStatuses(sortedPosts);
    } catch (error) {
      console.error('Error loading user posts:', error);
      setError(`Failed to load posts for ${username}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load posts based on initialUsername or use fallback
  useEffect(() => {
    if (initialUsername) {
      // If username is provided, load that user's posts
      loadUserPosts(initialUsername);
    } else {
      // Otherwise try to load all posts
      loadPosts().catch(err => {
        console.error("Error loading all posts, falling back to user posts:", err);
        // Fall back to user posts if all posts fails
        loadMyPosts();
      });
    }
  }, [initialUsername, loadPosts, loadUserPosts, loadMyPosts, lastRefresh]);

  // Function to refresh posts
  const refreshPosts = () => {
    setLastRefresh(Date.now());
  };

  const handleCreatePost = async (postData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Format the data to match what the backend expects
      const formattedData = {
        post_description: postData.post_description || postData.description,
        post_type: postData.post_type || postData.type || 'General',
        post_status: postData.post_status || 'active',
        post_date: postData.post_date || new Date().toISOString()
      };
      
      const newPost = await createPost(formattedData);
      
      // Log the new post for debugging
      console.log('New post created:', newPost);
      console.log('New post ID:', newPost.newsfeedId);
      
      // Add the new post to the beginning of the posts array
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      // Refresh the posts list after creating a new post
      setTimeout(refreshPosts, 500);
      
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (postId, postData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Important: Check which property is used for the ID
      console.log(`Attempting to update post with ID: ${postId}`);
      console.log('Post data:', postData);
      
      // The backend might be using newsfeedId instead of newsfeed_id
      // Get the actual numeric ID value
      const numericPostId = postData.newsfeedId || postData.newsfeed_id || postId;
      
      console.log(`Using numeric ID for update: ${numericPostId}`);
      
      if (!numericPostId) {
        setError('Failed to update post: Invalid post ID');
        return null;
      }
      
      // Format the data to match what the backend expects
      const formattedData = {
        post_description: postData.post_description || postData.description || postData.postDescription,
        post_type: postData.post_type || postData.type || postData.postType || 'General',
        post_status: postData.post_status || postData.postStatus || 'active',
        post_date: postData.post_date || postData.postDate || new Date().toISOString()
      };
      
      const updatedPost = await updatePost(numericPostId, formattedData);
      
      // Update the post in the posts array
      setPosts(prevPosts => 
        prevPosts.map(post => {
          // Check both possible ID properties
          const postIdentifier = post.newsfeedId || post.newsfeed_id;
          return postIdentifier === numericPostId ? updatedPost : post;
        })
      );
      
      return updatedPost;
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Attempting to delete post with ID: ${postId}`);
      
      // The backend might be using newsfeedId instead of newsfeed_id
      // Find the post to get the actual ID
      const post = posts.find(p => p.newsfeedId === postId || p.newsfeed_id === postId);
      
      if (!post) {
        console.error('Post not found for deletion:', postId);
        setError('Failed to delete post: Post not found');
        return false;
      }
      
      // Use the correct ID property from the found post
      const numericPostId = post.newsfeedId || post.newsfeed_id;
      
      console.log(`Using numeric ID for deletion: ${numericPostId}`);
      
      if (!numericPostId) {
        setError('Failed to delete post: Invalid post ID');
        return false;
      }
      
      await deletePost(numericPostId);
      
      // Remove the deleted post from the posts array
      setPosts(prevPosts => prevPosts.filter(p => {
        // Check both possible ID properties
        const postIdentifier = p.newsfeedId || p.newsfeed_id;
        return postIdentifier !== numericPostId;
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Updated to use toggleLikePost
  const handleLikePost = async (postId) => {
    try {
      console.log(`Attempting to like post with ID:`, postId);
      
      // Extract the numeric ID, handling both object and primitive cases
      let numericPostId;
      
      if (typeof postId === 'object' && postId !== null) {
        // If we received a post object, extract ID
        numericPostId = postId.newsfeedId || postId.newsfeed_id;
        console.log('Extracted ID from post object:', numericPostId);
      } else {
        // If we received just the ID
        numericPostId = postId;
        console.log('Using provided ID directly:', numericPostId);
      }
      
      if (!numericPostId) {
        console.error('Invalid post ID for liking:', postId);
        setError('Failed to like post: Invalid post ID');
        return null;
      }
      
      // Ensure numeric ID is treated as a number
      numericPostId = parseInt(numericPostId, 10);
      
      if (isNaN(numericPostId)) {
        console.error('Post ID is not a valid number:', postId);
        setError('Failed to like post: Invalid post ID format');
        return null;
      }
      
      console.log(`Making API call to like post with ID: ${numericPostId}`);
      
      // Use the toggleLikePost function
      const result = await toggleLikePost(numericPostId);
      console.log('Like toggle result:', result);
      
      // Update local like status
      setLikeStatuses(prev => ({
        ...prev,
        [numericPostId]: {
          liked: result.liked,
          likeCount: result.likeCount
        }
      }));
      
      // Update the post in the posts array with the new like count
      setPosts(prevPosts => 
        prevPosts.map(p => {
          const postIdentifier = parseInt(p.newsfeedId || p.newsfeed_id, 10);
          if (postIdentifier === numericPostId) {
            console.log(`Updating post ${postIdentifier} with new like count: ${result.likeCount}`);
            return {
              ...p,
              likeCount: result.likeCount,
              like_count: result.likeCount
            };
          }
          return p;
        })
      );
      
      // Force a refresh of the posts
      setTimeout(refreshPosts, 500);
      
      return result.post;
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post. Please try again.');
      return null;
    }
  };

  // Check if a user has liked a post
  const checkIfUserLiked = async (postId) => {
    try {
      const numericPostId = typeof postId === 'object' ? 
        (postId.newsfeedId || postId.newsfeed_id) : 
        postId;
      
      if (!numericPostId) return false;
      
      // First check our local state
      if (likeStatuses[numericPostId]) {
        return likeStatuses[numericPostId].liked;
      }
      
      // Otherwise check with the server
      const liked = await checkUserLiked(numericPostId);
      
      // Update our local state
      setLikeStatuses(prev => ({
        ...prev,
        [numericPostId]: {
          ...prev[numericPostId],
          liked
        }
      }));
      
      return liked;
    } catch (error) {
      console.error('Error checking if user liked post:', error);
      return false;
    }
  };

  // Get a single post by ID
  const fetchPostById = async (postId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching post with ID: ${postId}`);
      const post = await getPostById(postId);
      
      // Get the like status for this post
      const likeStatus = await getLikeStatus(postId);
      
      // Update local like status
      setLikeStatuses(prev => ({
        ...prev,
        [postId]: {
          liked: likeStatus.liked,
          likeCount: likeStatus.likeCount
        }
      }));
      
      return post;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      setError('Failed to fetch post. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    likeStatuses, // Now exposing the like statuses
    loadPosts,
    loadMyPosts,
    loadUserPosts,
    refreshPosts,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost,
    checkIfUserLiked, // New function to check if a user liked a post
    fetchPostById     // New function to fetch a single post
  };
};

export default useNewsfeed;