// src/hooks/useNewsfeed.js
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchAllPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost,
  fetchMyPosts,
  fetchUserPosts
} from '../services/newsfeedService';

const useNewsfeed = (initialUsername = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

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
      loadUserPosts(initialUsername);
    } else {
      // Use myPosts as a fallback until the all posts endpoint is fixed
      loadMyPosts();
    }
  }, [initialUsername, loadUserPosts, loadMyPosts, lastRefresh]);

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

  const handleLikePost = async (postId) => {
    try {
      console.log(`Attempting to like post with ID: ${postId}`);
      
      // Similar to delete, find the post to get the actual ID
      const post = posts.find(p => p.newsfeedId === postId || p.newsfeed_id === postId);
      
      if (!post) {
        console.error('Post not found for liking:', postId);
        setError('Failed to like post: Post not found');
        return null;
      }
      
      // Use the correct ID property
      const numericPostId = post.newsfeedId || post.newsfeed_id;
      
      console.log(`Using numeric ID for liking: ${numericPostId}`);
      
      if (!numericPostId) {
        setError('Failed to like post: Invalid post ID');
        return null;
      }
      
      const updatedPost = await likePost(numericPostId);
      
      // Update the post in the posts array
      setPosts(prevPosts => 
        prevPosts.map(p => {
          const postIdentifier = p.newsfeedId || p.newsfeed_id;
          return postIdentifier === numericPostId ? updatedPost : p;
        })
      );
      
      return updatedPost;
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post.');
      return null;
    }
  };

  return {
    posts,
    loading,
    error,
    loadPosts,
    loadMyPosts,
    loadUserPosts,
    refreshPosts,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost
  };
};

export default useNewsfeed;