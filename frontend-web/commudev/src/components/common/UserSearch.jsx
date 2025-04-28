// src/components/common/UserSearch.jsx
import React, { useState } from 'react';
import '../../styles/components/search.css';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
    // In a real app, you would fetch search results here
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Mock search results - replace with actual API data in production
  const searchResults = [
    { id: 1, name: 'Maria Garcia', image: 'prof1.png' },
    { id: 2, name: 'Robert Chen', image: 'prof2.jpg' },
    { id: 3, name: 'Sarah Johnson', image: 'prof3.jpg' },
  ];

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={isFocused ? "" : "    Search users..."}
        value={searchTerm}
        onChange={handleSearch}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="search-input"
      />
      {!isFocused && (
        <svg className="search-icon" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      )}
      {searchTerm && (
        <button 
          className="search-clear" 
          onClick={clearSearch}
          aria-label="Clear search"
        >
          ×
        </button>
      )}

      {showResults && (
        <div className="search-results">
          {searchResults.map(result => (
            <div key={result.id} className="search-result-item">
              <img 
                src={`/src/assets/images/profile/${result.image}`} 
                alt={`${result.name}'s profile`}
                className="search-result-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/images/profile/default-avatar.png';
                }}
              />
              <span className="search-result-name">{result.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;