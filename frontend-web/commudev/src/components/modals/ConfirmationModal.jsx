// src/components/common/ConfirmationModal.jsx
import React from 'react';
import '../../styles/components/confirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger', 'warning', or 'info'
}) => {
  if (!isOpen) return null;
  
  // Prevent click propagation to parent elements
  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <div className="confirmation-modal-overlay" onClick={onClose}>
      <div className={`confirmation-modal ${type}`} onClick={handleModalClick}>
        <div className="confirmation-modal-icon">
          {type === 'danger' && (
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"/>
            </svg>
          )}
          {type === 'warning' && (
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          )}
          {type === 'info' && (
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          )}
        </div>
        <h3 className="confirmation-modal-title">{title}</h3>
        <p className="confirmation-modal-message">{message}</p>
        <div className="confirmation-modal-actions">
          <button 
            className="confirmation-modal-button cancel-button" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`confirmation-modal-button confirm-button ${type}`} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;