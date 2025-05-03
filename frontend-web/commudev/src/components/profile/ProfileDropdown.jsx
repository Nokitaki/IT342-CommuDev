// src/components/profile/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/components/profileDropdown.css';

const ProfileDropdown = ({ username, profilePicture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { handleLogout } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <div 
        className="profile-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={profilePicture} 
          alt={username} 
          className="profile-dropdown-avatar" 
        />
        <span className="profile-dropdown-name">{username}</span>
        <svg className={`dropdown-arrow ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" width="16" height="16">
          <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="profile-dropdown-menu">
          
         
          <div className="dropdown-divider"></div>
          <button 
            className="dropdown-item logout-item"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor" />
            </svg>
            Logout
          </button>
        </div>
      )}
      
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="logout-confirm-header">
              <h3>Confirm Logout</h3>
              <button className="logout-close-btn" onClick={() => setShowLogoutConfirm(false)}>×</button>
            </div>
            <div className="logout-confirm-content">
              <div className="logout-icon">
                <svg viewBox="0 0 24 24" width="40" height="40">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor" />
                </svg>
              </div>
              <p>Are you sure you want to logout? You will need to log in again to access your account.</p>
            </div>
            <div className="logout-confirm-actions">
              <button 
                className="logout-cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="logout-confirm-btn"
                onClick={() => {
                  handleLogout();
                  setShowLogoutConfirm(false);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;