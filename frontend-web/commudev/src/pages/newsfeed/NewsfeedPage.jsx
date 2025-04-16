// src/pages/newsfeed/NewsfeedPage.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import CreatePostForm from '../../components/newsfeed/CreatePostForm';
import NewsfeedItem from '../../components/newsfeed/NewsfeedItem';
import PostFormModal from '../../components/modals/PostFormModal';
import UserCarousel from '../../components/newsfeed/UserCarousel';
import Calendar from '../../components/common/Calendar';
import NotificationItem from '../../components/newsfeed/NotificationItem';
import useNewsfeed from '../../hooks/useNewsfeed';
import useProfile from '../../hooks/useProfile';
import '../../styles/pages/newsfeed.css';

const NewsfeedPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  
  // Use profile hook to get user data
  const { profile, loading: profileLoading } = useProfile();
  
  const {
    posts,
    loading,
    error,
    loadPosts,
    loadMyPosts,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost
  } = useNewsfeed();


// Modified useEffect to avoid the refresh loop issue
useEffect(() => {
  // Explicitly load all posts
  loadPosts();
  
  // Set up auto-refresh every 30 seconds
  const intervalId = setInterval(() => {
    loadPosts(); // Just call loadPosts directly instead of using refreshTrigger
  }, 30000);
  
  // Clean up interval on unmount
  return () => clearInterval(intervalId);
}, [loadPosts]); // Remove refreshTrigger from dependencies



  // Mock notifications for now
  const notifications = [
    {
      id: 1,
      user: "Keanu",
      image: "prof1.png",
      message: "liked your post",
      time: "2 minutes ago",
    },
    {
      id: 2,
      user: "Ariana",
      image: "prof2.jpg",
      message: "commented on your picture",
      time: "5 minutes ago",
    },
    {
      id: 3,
      user: "Harry",
      image: "prof3.jpg",
      message: "sent you a friend request",
      time: "10 minutes ago",
    },
  ];

  const handleSubmitPost = async (formData) => {
    try {
      // If editing, update the post
      if (editingPost) {
        // Get the correct ID
        const postId = editingPost.newsfeedId || editingPost.newsfeed_id;
        console.log("Updating post with ID:", postId);
        console.log("Post data:", formData);
        
        // Make sure to pass the original post object with the ID
        const updatedData = {
          ...editingPost, // Keep all original properties including ID
          post_description: formData.post_description,
          postDescription: formData.post_description, // Add both formats
          post_type: formData.post_type,
          postType: formData.post_type, // Add both formats
          post_status: formData.post_status || 'active',
          postStatus: formData.post_status || 'active', // Add both formats
        };
        
        await handleUpdatePost(postId, updatedData);
      } else {
        // Otherwise create a new post
        await handleCreatePost(formData);
      }

      // Close modal and reset editing state
      setIsModalOpen(false);
      setEditingPost(null);
      
      // Refresh posts after creating/updating
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const onDeletePost = async (postId) => {
    await handleDeletePost(postId);
    
    // Refresh posts after deletion
    loadPosts();
  };

  const onEditPost = (post) => {
    // Log the post to see its structure
    console.log("Editing post:", post);
    
    // Make a copy of the post object
    const postForEditing = { ...post };
    
    // Ensure the post has the expected properties for the form
    if (postForEditing.postDescription && !postForEditing.post_description) {
      postForEditing.post_description = postForEditing.postDescription;
    }
    
    if (postForEditing.postType && !postForEditing.post_type) {
      postForEditing.post_type = postForEditing.postType;
    }
    
    if (postForEditing.postStatus && !postForEditing.post_status) {
      postForEditing.post_status = postForEditing.postStatus;
    }
    
    setEditingPost(postForEditing);
    setIsModalOpen(true);
  };

  const onLikePost = async (postId) => {
    await handleLikePost(postId);
    
    // After liking, refresh posts to get updated like count
    loadPosts();
  };


  const getUserName = () => {
    if (profile?.firstname && profile?.lastname) {
      return `${profile.firstname} ${profile.lastname}`;
    } else if (profile?.firstname) {
      return profile.firstname;
    } else if (profile?.username) {
      return profile.username;
    }
    return '';
  };

  // Right sidebar content
  const RightSidebar = (
    <div className="right-sidebar-content">
      <div className="calendar-section">
        <h2>Calendar</h2>
        <Calendar />
      </div>

      <div className="notifications-section">
        <h2>Notifications</h2>
        <div className="notifications-list">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              notification={notification} 
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout rightSidebar={RightSidebar}>
      <div className="newsfeed-content">
        <UserCarousel />
        
        <div className="feed-container">
          <CreatePostForm 
            onOpenModal={() => {
              setEditingPost(null);
              setIsModalOpen(true);
            }} 
          />
          
          {loading ? (
            <div className="loading-indicator">Loading posts...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="newsfeed-items">
              {posts.length > 0 ? (
                posts.map(post => (
                  <NewsfeedItem 
                    key={post.newsfeedId || post.newsfeed_id}
                    post={post}
                    onUpdate={(updatedPost) => handleUpdatePost(post.newsfeedId || post.newsfeed_id, updatedPost)}
                    onDelete={onDeletePost}
                    onLike={onLikePost}
                    onEdit={onEditPost}
                    isCurrentUser={profile?.id === post.user?.id}
                  />
                ))
              ) : (
                <div className="no-posts-message">No posts to display. Be the first to create a post!</div>
              )}
            </div>
          )}
        </div>
        
        <PostFormModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPost(null);
          }}
          onSubmit={handleSubmitPost}
          editPost={editingPost}
          userName={getUserName()}
        />
      </div>
    </MainLayout>
  );
};

export default NewsfeedPage;