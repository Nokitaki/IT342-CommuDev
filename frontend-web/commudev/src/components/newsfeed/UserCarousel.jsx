// src/components/newsfeed/UserCarousel.jsx
import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import '../../styles/components/userCarousel.css';

const UserCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const usersPerPage = 7;

  // Mock data for the user carousel
  const mockUsers = [
    { id: 1, name: "Harry", isOnline: false, image: "prof1.png" },
    { id: 2, name: "Keanu", isOnline: true, image: "prof2.jpg" },
    { id: 3, name: "Ariana", isOnline: true, image: "prof3.jpg" },
    { id: 4, name: "Justin", isOnline: true, image: "prof4.jpg" },
    { id: 5, name: "Carl", isOnline: false, image: "prof1.png" },
    { id: 6, name: "James", isOnline: true, image: "prof2.jpg" },
    { id: 7, name: "Sophie", isOnline: false, image: "prof3.jpg" },
    { id: 8, name: "Emma", isOnline: true, image: "prof4.jpg" },
    { id: 9, name: "Mike", isOnline: true, image: "prof1.png" },
    { id: 10, name: "Alex", isOnline: false, image: "prof2.jpg" },
    { id: 11, name: "Taylor", isOnline: true, image: "prof3.jpg" },
    { id: 12, name: "Jordan", isOnline: false, image: "prof4.jpg" },
  ];

  const nextPage = () => {
    if (currentIndex + usersPerPage < mockUsers.length) {
      setCurrentIndex(currentIndex + usersPerPage);
    } else {
      // Loop back to the beginning
      setCurrentIndex(0);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - usersPerPage);
    } else {
      // Loop to the end
      setCurrentIndex(Math.max(0, Math.floor(mockUsers.length / usersPerPage) * usersPerPage));
    }
  };

  const visibleUsers = mockUsers.slice(currentIndex, currentIndex + usersPerPage);

  return (
    <div className="user-carousel">
      <button 
        className="carousel-nav-button prev" 
        onClick={prevPage}
        aria-label="Previous users"
      >
        &lt;
      </button>
      
      <div className="user-avatars">
        {visibleUsers.map((user) => (
          <div key={user.id} className="user-avatar-item">
            <Avatar 
              src={user.image ? `/src/assets/images/profile/${user.image}` : '/src/assets/images/profile/default-avatar.png'}
              alt={`${user.name}'s profile`}
              showStatus={true}
              isOnline={user.isOnline}
              size="medium"
            />
            <span className="user-name">{user.name}</span>
          </div>
        ))}
      </div>
      
      <button 
        className="carousel-nav-button next" 
        onClick={nextPage}
        aria-label="Next users"
      >
        &gt;
      </button>
    </div>
  );
};

export default UserCarousel;