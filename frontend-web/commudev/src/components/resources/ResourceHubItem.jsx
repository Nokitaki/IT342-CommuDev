// src/components/resources/ResourceHubItem.jsx
import React from 'react';
import Avatar from '../common/Avatar';
import '../../styles/components/resourceItem.css';

const ResourceHubItem = ({ resource, onDelete, onLike, onEdit }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className="resource-item">
      <header className="resource-header">
        <div className="resource-author">
          <Avatar 
            src={resource.creator_profile_picture || '../../../public/assets/images/profile/default-avatar.png'} 
            alt={`${resource.creator}'s profile`} 
            size="medium" 
          />
          <div className="author-info">
            <h3 className="author-name">{resource.creator || 'Unknown User'}</h3>
            <div className="resource-meta">
              <span className="upload-date">{formatDate(resource.upload_date)}</span>
              <div className="resource-badges">
                <span className="resource-badge resource-badge-active">{resource.status || 'Active'}</span>
                <span className={`resource-type resource-type-${resource.resource_category.toLowerCase()}`}>
                  {resource.resource_category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="resource-content">
        <h3 className="resource-title">{resource.resource_title}</h3>
        <p className="resource-description">{resource.resource_description}</p>
        <div className="resource-stats">
          <span className="download-count">
            <svg className="download-icon" width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor" />
            </svg>
            {resource.heart_count || 0} downloads
          </span>
          <span className="file-size">{resource.fileSize || '2.5 MB'}</span>
        </div>
      </div>

      <footer className="resource-actions">
        <button 
          className="resource-button download-button" 
          onClick={() => onLike(resource.resource_id)}
          title="Download and like this resource"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" className="download-icon">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor" />
          </svg>
          Download
        </button>
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
            onClick={() => onDelete(resource.resource_id)}
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