// src/components/modals/PostFormModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import useProfile from '../../hooks/useProfile';
import '../../styles/components/modal.css';
import API_URL from '../../config/apiConfig';
const PostFormModal = ({ isOpen, onClose, onSubmit, editPost, userName }) => {
  const { profile } = useProfile();
  const [formData, setFormData] = useState({
    post_description: '',
    post_type: 'General',
    post_status: 'active'
  });



  // Post types options
  const postTypes = [
    'General',
    'Announcement',
    'Event',
    'Question',
    'Discussion',
    'Resource'
  ];

  // Initialize form data when editing a post or when the modal opens/closes
  useEffect(() => {
    if (editPost) {
      console.log("Setting form data for edit with post:", editPost);
      
      // Log all available properties to debug
      console.log("Available properties:", Object.keys(editPost));
      
      // Get the post description from any available property
      const description = editPost.post_description || editPost.postDescription || '';
      const type = editPost.post_type || editPost.postType || 'General';
      const status = editPost.post_status || editPost.postStatus || 'active';
      
      console.log("Using description:", description);
      console.log("Using type:", type);
      console.log("Using status:", status);
      
      // Always use snake_case for form data since that's what your database uses
      setFormData({
        post_description: description,
        post_type: type,
        post_status: status
      });
      
      console.log("Form data set to:", {
        post_description: description,
        post_type: type,
        post_status: status
      });
    } else {
      // Reset form when not editing
      setFormData({
        post_description: '',
        post_type: 'General',
        post_status: 'active'
      });
    }
  }, [editPost, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to: ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.post_description.trim()) {
      alert('Please enter a post description');
      return;
    }
    
    // Create data object with snake_case properties to match your database columns
    const updatedFormData = {
      ...formData,
      post_date: new Date().toISOString(), // Include current date
      like_count: 0 // Initialize like count for new posts
    };
    
    // If editing, maintain the original ID
    if (editPost && (editPost.newsfeed_id || editPost.newsfeedId)) {
      updatedFormData.newsfeed_id = editPost.newsfeed_id || editPost.newsfeedId;
    }
    
    console.log("Submitting form data:", updatedFormData);
    onSubmit(updatedFormData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{editPost ? 'Edit Post' : 'Create New Post'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-user-info">
          <Avatar 
            src={profile?.profilePicture ? 
              `${API_URL}${profile.profilePicture}` : 
              '/src/assets/images/profile/default-avatar.png'
            } 
            alt={`${userName}'s profile`} 
            size="medium" 
          />
          <span className="modal-username">{userName}</span>
        </div>
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <textarea
              name="post_description"
              value={formData.post_description}
              onChange={handleChange}
              placeholder="What's on your mind?"
              rows={5}
              required
              className="modal-textarea"
            />
          </div>
          
          <div className="form-group post-type-group">
            <label htmlFor="post-type">Post Type:</label>
            <select
              id="post-type"
              name="post_type"
              value={formData.post_type}
              onChange={handleChange}
              className="modal-select"
            >
              {postTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="modal-divider"></div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="modal-button cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="modal-button post-button"
            >
              {editPost ? 'Update' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormModal;