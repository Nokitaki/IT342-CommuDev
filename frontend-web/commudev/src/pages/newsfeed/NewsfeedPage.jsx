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
import useAuth from '../../hooks/useAuth';
import '../../styles/pages/newsfeed.css';

const NewsfeedPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const { userData, profilePicture } = useAuth();
  
  const {
    posts,
    loading,
    error,
    loadPosts,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost
  } = useNewsfeed();

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
        await handleUpdatePost(editingPost.newsfeed_id, formData);
      } else {
        // Otherwise create a new post
        await handleCreatePost(formData);
      }

      // Close modal and reset editing state
      setIsModalOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const onDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await handleDeletePost(postId);
    }
  };

  const onEditPost = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const onLikePost = async (post) => {
    await handleLikePost(post.newsfeed_id);
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
                    key={post.newsfeed_id}
                    post={post}
                    onUpdate={(updatedPost) => handleUpdatePost(post.newsfeed_id, updatedPost)}
                    onDelete={() => onDeletePost(post.newsfeed_id)}
                    onLike={() => onLikePost(post)}
                    onEdit={() => onEditPost(post)}
                    isCurrentUser={userData?.id === post.user?.id}
                  />
                ))
              ) : (
                <div className="no-posts-message">No posts to display.</div>
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
          userName={userData ? `${userData.firstname || ''} ${userData.lastname || ''}`.trim() : ''}
        />
      </div>
    </MainLayout>
  );
};

export default NewsfeedPage;