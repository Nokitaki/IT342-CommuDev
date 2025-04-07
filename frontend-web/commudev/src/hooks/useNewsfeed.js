// src/hooks/useNewsfeed.js
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (initialUsername) {
      loadUserPosts(initialUsername);
    } else {
      loadPosts();
    }
  }, [initialUsername]);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const postsData = await fetchAllPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadMyPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const postsData = await fetchMyPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading my posts:', error);
      setError('Failed to load your posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async (username) => {
    setLoading(true);
    setError(null);
    
    try {
      const postsData = await fetchUserPosts(username);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading user posts:', error);
      setError(`Failed to load posts for ${username}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Format the data to match what the backend expects
      const formattedData = {
        post_description: postData.post_description || postData.description,
        post_type: postData.post_type || postData.type || 'General',
        post_status: postData.post_status || 'active'
      };
      
      const newPost = await createPost(formattedData);
      setPosts(prevPosts => [newPost, ...prevPosts]);
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
      // Format the data to match what the backend expects
      const formattedData = {
        post_description: postData.post_description || postData.description,
        post_type: postData.post_type || postData.type || 'General',
        post_status: postData.post_status || 'active'
      };
      
      const updatedPost = await updatePost(postId, formattedData);
      setPosts(prevPosts => 
        prevPosts.map(post => post.newsfeed_id === postId ? updatedPost : post)
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
      await deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.newsfeed_id !== postId));
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
      const updatedPost = await likePost(postId);
      setPosts(prevPosts => 
        prevPosts.map(post => post.newsfeed_id === postId ? updatedPost : post)
      );
      return updatedPost;
    } catch (error) {
      console.error('Error liking post:', error);
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
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost
  };
};

export default useNewsfeed;