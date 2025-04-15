
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
  const [crop, setCrop] = useState({ aspect: 1, width: 100, unit: '%' });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);
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

  const onImageLoaded = useCallback(img => {
    setImageRef(img);
    return false; // Return false to prevent setting a default crop
  }, []);

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (!blob) return;
        blob.name = 'cropped-profile-image.jpg';
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!completedCrop || !imageRef) {
      setError("Please complete the crop first");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      const croppedImg = await getCroppedImg(imageRef, completedCrop);
      
      // Create FormData object
      const formData = new FormData();
      formData.append('file', croppedImg, 'profile-picture.jpg');
      
      // Call the parent save function
      await onSave(formData);
      
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
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
        
        {previewUrl && (
          <div className="crop-container">
            <ReactCrop
              src={previewUrl}
              crop={crop}
              onChange={newCrop => setCrop(newCrop)}
              onComplete={c => setCompletedCrop(c)}
              onImageLoaded={onImageLoaded}
              circularCrop
              keepSelection
            />
          </div>
        )}
        
        {!previewUrl && currentProfilePicture && (
          <div className="profile-preview-container">
            <div className="profile-preview-wrapper">
              <img 
                src={currentProfilePicture} 
                alt="Current Profile" 
                className="profile-preview-image"
              />
            </div>
          </div>
        )}
        
        <p className="upload-help-text">
          For best results, use an image at least 400 x 400 pixels. Use the crop tool to center your face.
        </p>
        
        <div className="profile-upload-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={!completedCrop || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Save Profile Picture'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;