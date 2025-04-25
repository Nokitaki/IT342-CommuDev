// src/components/common/Button.jsx
import React from 'react';
import '../../styles/components/button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {disabled && variant === 'primary' ? (
        <div className="btn-loading">
          <span className="loading-spinner"></span>
        </div>
      ) : disabled && variant === 'delete' ? (
        <div className="btn-loading">
          <span className="loading-spinner"></span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;