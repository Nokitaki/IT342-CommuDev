// src/components/newsfeed/PeopleYouMayKnow.jsx
import React from 'react';
import '../../styles/components/search.css';

const PeopleYouMayKnow = () => {
  // Mock data for "People You May Know"
  const suggestions = [
    { id: 1, name: "Maria Garcia", image: "prof1.png" },
    { id: 2, name: "Robert Chen", image: "prof2.jpg" },
    { id: 3, name: "Sarah Johnson", image: "prof3.jpg" }
  ];

  return (
    <div className="people-suggestions">
      <h3>PEOPLE YOU MAY KNOW</h3>
      <div className="suggestions-list">
        {suggestions.map(person => (
          <div key={person.id} className="suggestion-item">
            <img 
              src={`/src/assets/images/profile/${person.image}`} 
              alt={`${person.name}'s profile`}
              className="suggestion-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/src/assets/images/profile/default-avatar.png';
              }}
            />
            <span className="suggestion-name">{person.name}</span>
            <button className="suggestion-add-btn">+</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleYouMayKnow;