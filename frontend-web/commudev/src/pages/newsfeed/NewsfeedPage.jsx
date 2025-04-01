// src/pages/newsfeed/NewsfeedPage.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import CreatePostForm from '../../components/newsfeed/CreatePostForm';
import NewsfeedItem from '../../components/newsfeed/NewsfeedItem';
import PostFormModal from '../../components/modals/PostFormModal';
import UserCarousel from '../../components/newsfeed/UserCarousel';
import Calendar from '../../components/common/Calendar';
import NotificationItem from '../../components/newsfeed/NotificationItem';
import { 
  fetchAllPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost 
} from '../../services/newsfeedService';
import useAuth from '../../hooks/useAuth';
import '../../styles/pages/newsfeed.css';

const NewsfeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const { userData, profilePicture } = useAuth();

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

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await fetchAllPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleCreatePost = async (formData) => {
    try {
      // Add user info to form data
      const postData = {
        ...formData,
        creator: userData ? `${userData.firstname} ${userData.lastname}` : '',
        creator_id: userData?.id,
        creator_profile_picture: profilePicture,
      };

      // If editing, update the post
      if (editingPost) {
        const updatedPost = await updatePost(editingPost.newsfeed_id, postData);
        setPosts(posts.map(post => 
          post.newsfeed_id === editingPost.newsfeed_id ? updatedPost : post
        ));
      } else {
        // Otherwise create a new post
        const newPost = await createPost(postData);
        setPosts([newPost, ...posts]);
      }

      // Close modal and reset editing state
      setIsModalOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      const result = await updatePost(updatedPost.newsfeed_id, updatedPost);
      setPosts(posts.map(post => 
        post.newsfeed_id === updatedPost.newsfeed_id ? result : post
      ));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter(post => post.newsfeed_id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleLikePost = async (post) => {
    try {
      const updatedPost = await likePost(post.newsfeed_id, post.like_count);
      setPosts(posts.map(p => 
        p.newsfeed_id === post.newsfeed_id ? updatedPost : p
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
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
          
          <div className="newsfeed-items">
            {posts.map(post => (
              <NewsfeedItem 
                key={post.newsfeed_id}
                post={post}
                onUpdate={handleUpdatePost}
                onDelete={handleDeletePost}
                onLike={handleLikePost}
              />
            ))}
          </div>
        </div>
        
        <PostFormModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPost(null);
          }}
          onSubmit={handleCreatePost}
          editPost={editingPost}
          userName={userData ? `${userData.firstname} ${userData.lastname}` : ''}
        />
      </div>
    </MainLayout>
  );
};

export default NewsfeedPage;