// src/components/resources/ResourceHubItem.jsx
import React, { useState, useEffect } from 'react';
import Avatar from '../common/Avatar';
import '../../styles/components/resourceItem.css';
import API_URL from '../../config/apiConfig';
import { formatTimeAgo } from '../../utils/dateUtils';
import { getProfilePicture } from '../../utils/assetUtils';
import { getUserByUsername } from '../../services/userService';

const ResourceHubItem = ({ resource, onDelete, onLike, onEdit }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(resource.heartCount || 0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch creator data when component mounts
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (resource.creator) {
        try {
          setLoading(true);
          const userData = await getUserByUsername(resource.creator);
          setCreatorData(userData);
        } catch (err) {
          console.error('Error fetching creator data:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCreatorData();
  }, [resource.creator]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get relative time (e.g., "2 days ago")
  const getTimeAgo = (dateString) => {
    return formatTimeAgo(dateString);
  };

  // Handle like toggle action (like/unlike)
  const handleLikeToggle = async () => {
    // Toggle the liked state
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Calculate the new like count correctly
    // If liking, set to 1, if unliking, set to 0
    const newLikeCount = newLikedState ? 1 : 0;
    setLikeCount(newLikeCount);
    
    try {
      // Call the API to like/unlike the resource
      await onLike(resource.resourceId, newLikedState);
    } catch (error) {
      // Revert UI changes if API call fails
      setIsLiked(!newLikedState);
      setLikeCount(!newLikedState ? 1 : 0);
      console.error('Error toggling like:', error);
    }
  };

  // Handle download action (placeholder for now)
  const handleDownload = () => {
    // This will be implemented later
    console.log('Download requested for resource ID:', resource.resourceId);
    alert('Download functionality will be implemented soon!');
  };

  // Get creator's profile picture
  const getCreatorProfilePicture = () => {
    // If we have fetched creator data with a profile picture
    if (creatorData?.profilePicture) {
      return creatorData.profilePicture.startsWith('http')
        ? creatorData.profilePicture
        : `${API_URL}${creatorData.profilePicture}`;
    }
    
    // Otherwise use the default avatar from assetUtils
    try {
      return getProfilePicture({});
    } catch (e) {
      // Fallback to a direct path if the utility function fails
      return '/assets/images/profile/default-avatar.png';
    }
  };

  // Get creator's display name
  const getCreatorName = () => {
    if (creatorData) {
      if (creatorData.firstname && creatorData.lastname) {
        return `${creatorData.firstname} ${creatorData.lastname}`;
      } else if (creatorData.firstname) {
        return creatorData.firstname;
      }
    }
    return resource.creator || 'Unknown User';
  };

  // Toggle description expansion
  const toggleDescription = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <article className="resource-item">
      <header className="resource-header">
        <div className="resource-author">
          <Avatar 
            src={getCreatorProfilePicture()} 
            alt={`${resource.creator}'s profile`} 
            size="medium" 
          />
          <div className="author-info">
            <h3 className="author-name">{getCreatorName()}</h3>
            <div className="resource-meta">
              <span className="upload-date">{getTimeAgo(resource.uploadDate)}</span>
              <div className="resource-badges">
                <span className="resource-badge resource-badge-active">Active</span>
                <span className={`resource-type resource-type-${resource.resourceCategory?.toLowerCase()}`}>
                  {resource.resourceCategory}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="resource-content">
        <h3 className="resource-title">{resource.resourceTitle}</h3>
        <p 
          className={`resource-description ${isExpanded ? 'expanded' : ''}`}
          onClick={toggleDescription}
        >
          {resource.resourceDescription}
        </p>
        {resource.resourceDescription && resource.resourceDescription.length > 150 && (
          <button 
            className="read-more-button" 
            onClick={toggleDescription}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
        <div className="resource-stats">
          <span className="heart-count">
            <svg className="heart-icon" width="16" height="16" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                fill={isLiked ? "#f44336" : "currentColor"} />
            </svg>
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </span>
          <span className="upload-info">Added on {formatDate(resource.uploadDate)}</span>
        </div>
      </div>

      <footer className="resource-actions">
        <div className="resource-primary-actions">
          <button 
            className={`resource-button like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLikeToggle}
            title={isLiked ? "Unlike this resource" : "Like this resource"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="heart-icon">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                fill={isLiked ? "#ffffff" : "currentColor"} />
            </svg>
            {isLiked ? 'Liked' : 'Like'}
          </button>
          
          <button 
            className="resource-button download-button"
            onClick={handleDownload}
            title="Download this resource"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="download-icon" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download
          </button>
        </div>
        
        <div className="action-buttons">
          <button 
            className="resource-button edit-button" 
            onClick={() => onEdit(resource)}
          >
            <svg className="edit-icon" viewBox="0 0 24 24" width="16" height="16">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Edit
          </button>
          <button 
            className="resource-button delete-button" 
            onClick={() => onDelete(resource)}
          >
            <svg className="delete-icon" viewBox="0 0 24 24" width="16" height="16">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
            Delete
          </button>
        </div>
      </footer>
    </article>
  );
};

export default ResourceHubItem;