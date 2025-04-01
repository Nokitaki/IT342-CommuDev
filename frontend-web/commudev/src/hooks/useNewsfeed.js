// src/hooks/useNewsfeed.js
import { useState, useEffect } from 'react';
import { 
  fetchAllPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost 
} from '../services/newsfeedService';

const useNewsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

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

  const handleCreatePost = async (postData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newPost = await createPost(postData);
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
      const updatedPost = await updatePost(postId, postData);
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

  const handleLikePost = async (postId, currentLikes) => {
    try {
      const updatedPost = await likePost(postId, currentLikes);
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
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost
  };
};

export default useNewsfeed;