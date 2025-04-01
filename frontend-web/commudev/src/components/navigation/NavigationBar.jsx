// src/components/navigation/NavigationBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import NavItem from './NavItem';
import '../../styles/components/navigation.css';

// Import icons
import HomeIcon from '../../assets/icons/HomeIcon.svg';
import MessageIcon from '../../assets/icons/MessageIcon.svg';
import ResourceIcon from '../../assets/icons/ResourceIcon.svg';
import TaskIcon from '../../assets/icons/TaskIcon.svg';
import RewardsIcon from '../../assets/icons/RewardsIcon.svg';
import FeedbackIcon from '../../assets/icons/FeedbackIcon.svg';

const NavigationBar = () => {
  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/newsfeed" },
    { icon: MessageIcon, label: "Messages", path: "/messages" },
    { icon: ResourceIcon, label: "Resources", path: "/resources" },
    { icon: TaskIcon, label: "Tasks", path: "/tasks" },
    { icon: RewardsIcon, label: "Rewards", path: "/rewards" },
    { icon: FeedbackIcon, label: "Feedback", path: "/feedback" },
  ];

  return (
    <nav className="navigation-bar">
      <div className="nav-icons">
        {navigationItems.map((item, index) => (
          <NavItem 
            key={index}
            icon={item.icon}
            label={item.label}
            path={item.path}
          />
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;