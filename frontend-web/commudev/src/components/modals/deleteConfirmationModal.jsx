// src/components/modals/DeleteConfirmationModal.jsx
import React from 'react';
import '../../styles/components/deleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  // Prevent clicks within the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-container" onClick={handleModalClick}>
        <div className="delete-modal-header">
          <h2>{title || "Confirm Deletion"}</h2>
          <button className="delete-modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="delete-modal-content">
          <div className="delete-modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="delete-modal-message">{message || "Are you sure you want to delete this item? This action cannot be undone."}</p>
        </div>
        
        <div className="delete-modal-actions">
          <button 
            className="delete-modal-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="delete-modal-confirm-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;