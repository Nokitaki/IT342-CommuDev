// src/components/navigation/NavItem.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/navigation.css';

const NavItem = ({ icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link to={path} className={`nav-item ${isActive ? 'active' : ''}`}>
      <img 
        src={icon} 
        alt={`${label} icon`} 
        className="nav-icon" 
      />
      <span className="nav-label">{label}</span>
    </Link>
  );
};

export default NavItem;