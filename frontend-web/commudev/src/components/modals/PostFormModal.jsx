// src/components/modals/PostFormModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import '../../styles/components/modal.css';

const PostFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editPost = null,
  userName
}) => {
  const [formData, setFormData] = useState({
    creator: userName,
    post_description: '',
    post_type: '',
    post_date: new Date().toISOString().split('T')[0],
    community: '',
  });

  useEffect(() => {
    if (editPost) {
      setFormData({
        post_description: editPost.post_description || '',
        post_type: editPost.post_type || '',
        post_date: editPost.post_date ? 
                   new Date(editPost.post_date).toISOString().split('T')[0] : 
                   new Date().toISOString().split('T')[0],
        community: editPost.community || '',
        creator: userName,
      });
    } else {
      // Reset form if not editing
      setFormData({
        creator: userName,
        post_description: '',
        post_type: '',
        post_date: new Date().toISOString().split('T')[0],
        community: '',
      });
    }
  }, [editPost, userName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">
          {editPost ? 'Edit Post' : 'Create a Post'}
        </h3>
        <form onSubmit={handleSubmit}>
          <textarea
            name="post_description"
            value={formData.post_description}
            onChange={handleChange}
            placeholder="Write your post here..."
            className="modal-textarea"
            required
          />

          <select
            name="community"
            value={formData.community}
            onChange={handleChange}
            className="modal-select"
          >
            <option value="">Select Community</option>
            <option value="Barangay Community">Barangay Community</option>
            <option value="Municipality Community">Municipality Community</option>
          </select>

          <select
            name="post_type"
            value={formData.post_type}
            onChange={handleChange}
            className="modal-select"
            required
          >
            <option value="">Select Post Type</option>
            <option value="Announcement">Announcement</option>
            <option value="Event">Event</option>
            <option value="Reminder">Reminder</option>
          </select>

          <input
            type="date"
            name="post_date"
            value={formData.post_date}
            onChange={handleChange}
            className="modal-date-input"
          />

          <div className="modal-actions">
            <Button 
              type="submit" 
              variant="primary"
            >
              {editPost ? 'Save Changes' : 'Create Post'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormModal;