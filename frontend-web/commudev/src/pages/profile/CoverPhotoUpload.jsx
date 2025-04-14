// src/pages/profile/CoverPhotoUpload.jsx
// src/pages/profile/CoverPhotoUpload.jsx
// src/pages/profile/CoverPhotoUpload.jsx
import React, { useState } from 'react';
import Button from '../../components/common/Button';
import './coverPhotoUpload.css'; // Updated path

const CoverPhotoUpload = ({ 
  currentCoverPhoto, 
  onSave, 
  onCancel, 
  isOpen 
}) => {
  const [coverPhoto, setCoverPhoto] = useState(null);
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
      
      setCoverPhoto(file);
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
    if (coverPhoto) {
      try {
        setIsUploading(true);
        setError(null);
        
        // Create FormData object
        const formData = new FormData();
        formData.append('file', coverPhoto);
        
        // Call the parent save function
        await onSave(formData);
        
      } catch (error) {
        console.error('Error uploading cover photo:', error);
        setError('Failed to upload cover photo. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleClose = () => {
    setCoverPhoto(null);
    setPreviewUrl(null);
    setError(null);
    onCancel();
  };

  return (
    <div className="cover-photo-upload-overlay">
      <div className="cover-photo-upload-modal">
        <h2>Update Cover Photo</h2>
        
        <div className="cover-preview-container">
          <img 
            src={previewUrl || currentCoverPhoto || '/src/assets/images/profile/default-cover.jpg'} 
            alt="Cover Preview" 
            className="cover-preview-image"
          />
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
              {coverPhoto ? coverPhoto.name : 'No file selected'}
            </span>
          </div>
          
          {error && <p className="upload-error">{error}</p>}
          
          <p className="upload-help-text">
            For best results, use an image with 1200 x 400 pixels or higher. Maximum file size: 5MB.
          </p>
          
          <div className="cover-upload-actions">
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
              disabled={!coverPhoto || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Save Cover Photo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoverPhotoUpload;