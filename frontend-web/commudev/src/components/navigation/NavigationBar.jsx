// src/components/navigation/NavigationBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/navigation.css';

// Import icons
import HomeIcon from '../../assets/icons/HomeIcon.svg';
import MessageIcon from '../../assets/icons/MessageIcon.svg';
import ResourceIcon from '../../assets/icons/ResourceIcon.svg';

const NavigationBar = () => {
  const location = useLocation();
  
  // Simplified navigation items without Tasks, Rewards, and Feedback
  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/newsfeed" },
    { icon: MessageIcon, label: "Messages", path: "/messages" },
    { icon: ResourceIcon, label: "Resources", path: "/resources" }
  ];

  return (
    <nav className="navigation-bar">
      <div className="nav-icons">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <img 
              src={item.icon} 
              alt={`${item.label} icon`} 
              className="nav-icon" 
            />
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;