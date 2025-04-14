
// src/pages/profile/ProfilePictureUpload.jsx
import React, { useState } from 'react';
import Button from '../../components/common/Button';
import './profilePictureUpload.css'; // Updated path

const ProfilePictureUpload = ({ 
  currentProfilePicture, 
  onSave, 
  onCancel, 
  isOpen 
}) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      
      setProfilePicture(file);
      setError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profilePicture) {
      try {
        setIsUploading(true);
        setError(null);
        
        // Create FormData object
        const formData = new FormData();
        formData.append('file', profilePicture);
        
        // Call the parent save function
        await onSave(formData);
        
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        setError('Failed to upload profile picture. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleClose = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
    setError(null);
    onCancel();
  };

  return (
    <div className="profile-picture-upload-overlay">
      <div className="profile-picture-upload-modal">
        <h2>Update Profile Picture</h2>
        
        <div className="profile-preview-container">
          <div className="profile-preview-wrapper">
            <img 
              src={previewUrl || currentProfilePicture || '/src/assets/images/profile/default-avatar.png'} 
              alt="Profile Preview" 
              className="profile-preview-image"
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="file-input-container">
            <label className="file-input-label">
              Choose Photo
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect}
                className="file-input" 
              />
            </label>
            <span className="file-name">
              {profilePicture ? profilePicture.name : 'No file selected'}
            </span>
          </div>
          
          {error && <p className="upload-error">{error}</p>}
          
          <p className="upload-help-text">
            For best results, use an image at least 400 x 400 pixels. Maximum file size: 5MB.
          </p>
          
          <div className="profile-upload-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={!profilePicture || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Save Profile Picture'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;