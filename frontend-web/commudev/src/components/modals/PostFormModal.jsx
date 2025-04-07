// src/components/modals/PostFormModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import useAuth from '../../hooks/useAuth';
import '../../styles/components/modal.css';

const PostFormModal = ({ isOpen, onClose, onSubmit, editPost, userName }) => {
  const { profilePicture } = useAuth();
  const [formData, setFormData] = useState({
    post_description: '',
    post_type: 'General'
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

  // Initialize form data when editing a post
  useEffect(() => {
    if (editPost) {
      setFormData({
        post_description: editPost.post_description || '',
        post_type: editPost.post_type || 'General',
        post_status: editPost.post_status || 'active'
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
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{editPost ? 'Edit Post' : 'Create New Post'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="user-info-section">
            <Avatar 
              src={profilePicture || '/src/assets/images/profile/default-avatar.png'} 
              alt={`${userName}'s profile`} 
              size="medium" 
            />
            <span className="user-name">{userName}</span>
          </div>
          
          <div className="form-group">
            <textarea
              name="post_description"
              value={formData.post_description}
              onChange={handleChange}
              placeholder="What's on your mind?"
              rows={5}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="post-type">Post Type:</label>
            <select
              id="post-type"
              name="post_type"
              value={formData.post_type}
              onChange={handleChange}
            >
              {postTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editPost ? 'Update Post' : 'Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormModal;