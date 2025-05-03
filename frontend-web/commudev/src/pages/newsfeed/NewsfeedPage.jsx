// src/pages/newsfeed/NewsfeedPage.jsx
import React, { useState, useEffect, Suspense } from 'react';
import MainLayout from '../../layouts/MainLayout';
import CreatePostForm from '../../components/newsfeed/CreatePostForm';
import PostFormModal from '../../components/modals/PostFormModal';
import UserCarousel from '../../components/newsfeed/UserCarousel';
import useNewsfeed from '../../hooks/useNewsfeed';
import useProfile from '../../hooks/useProfile';
import '../../styles/pages/newsfeed.css';
import API_URL from '../../config/apiConfig';
import { getAssetUrl } from '../../utils/assetUtils';

// Lazy load the heavy components
const NewsfeedItem = React.lazy(() => import('../../components/newsfeed/NewsfeedItem'));

// Skeleton component for loading state
const PostSkeleton = () => (
  <div className="feed-item skeleton">
    <div className="skeleton-header">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-text-container">
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    </div>
    <div className="skeleton-content">
      <div className="skeleton-text"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
    <div className="skeleton-actions">
      <div className="skeleton-button"></div>
      <div className="skeleton-button"></div>
    </div>
  </div>
);

const NewsfeedPage = () => {
  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  
  // Weather state
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Manila'); // Default to Manila
  
  // Use profile hook to get user data
  const { profile, loading: profileLoading } = useProfile();
  
  const {
    posts,
    loading,
    error,
    loadPosts,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost
  } = useNewsfeed();

  // Philippine cities for the dropdown
  const philippineCities = [
    "Manila", "Quezon City", "Davao City", "Caloocan", "Cebu City", 
    "Zamboanga City", "Taguig", "Antipolo", "Pasig", "Cagayan de Oro",
    "Parañaque", "Dasmariñas", "Valenzuela", "Bacoor", "General Santos",
    "Las Piñas", "Makati", "Bacolod", "Muntinlupa", "Angeles",
    "Iloilo City", "Marikina", "Baguio", "Batangas City", "Butuan"
  ];

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Optimized weather data fetching with cache
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedCity) return;
      
      try {
        // Check if we have cached weather data less than 30 minutes old
        const cachedWeather = localStorage.getItem('weatherData');
        const cachedTime = localStorage.getItem('weatherDataTime');
        const cachedCity = localStorage.getItem('weatherCity');
        
        if (cachedWeather && cachedTime && cachedCity === selectedCity) {
          const parsedData = JSON.parse(cachedWeather);
          const timestamp = parseInt(cachedTime);
          const now = Date.now();
          
          // If the data is less than 30 minutes old, use it
          if (now - timestamp < 30 * 60 * 1000) {
            setWeatherData(parsedData);
            setWeatherError(null);
            setWeatherLoading(false);
            return;
          }
        }
        
        // Otherwise fetch new data
        setWeatherLoading(true);
        const apiKey = '842a99c8bd5d8f66dd96de258dcbd954';
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity},ph&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Save to localStorage
        localStorage.setItem('weatherData', JSON.stringify(data));
        localStorage.setItem('weatherDataTime', Date.now().toString());
        localStorage.setItem('weatherCity', selectedCity);
        
        setWeatherData(data);
        setWeatherError(null);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherError('Failed to load weather data');
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeatherData();
    
    // Refresh weather data every 30 minutes
    const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [selectedCity]);

  // Batch initial data loading
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Call loadPosts directly since it already has loading state management
        await loadPosts();
      } catch (error) {
        console.error("Error in initial data loading:", error);
      }
    };

    fetchInitialData();
    
    // Set up auto-refresh every 30 seconds without full page reload
    const intervalId = setInterval(() => {
      loadPosts();
    }, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [loadPosts]);

  // Implement intersection observer for lazy loading comments
  useEffect(() => {
    if (posts.length === 0 || loading) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // This post is visible, we could lazy load its comments here
          const postId = entry.target.dataset.postId;
          console.log(`Post ${postId} is visible`);
          
          // Stop observing once it's visible
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Start observing all post elements
    const postElements = document.querySelectorAll('.feed-item');
    postElements.forEach(post => {
      observer.observe(post);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [posts, loading]);

  const handleSubmitPost = async (formData) => {
    try {
      // If editing, update the post
      if (editingPost) {
        // Get the correct ID
        const postId = editingPost.newsfeedId || editingPost.newsfeed_id;
        console.log("Updating post with ID:", postId);
        
        // Make sure to pass the original post object with the ID
        const updatedData = {
          ...editingPost, // Keep all original properties including ID
          post_description: formData.post_description,
          postDescription: formData.post_description, // Add both formats
          post_type: formData.post_type,
          postType: formData.post_type, // Add both formats
          post_status: formData.post_status || 'active',
          postStatus: formData.post_status || 'active', // Add both formats
        };
        
        await handleUpdatePost(postId, updatedData);
      } else {
        // Otherwise create a new post
        await handleCreatePost(formData);
      }

      // Close modal and reset editing state
      setIsModalOpen(false);
      setEditingPost(null);
      
      // Refresh posts after creating/updating
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const onDeletePost = async (postId) => {
    await handleDeletePost(postId);
    
    // Refresh posts after deletion
    loadPosts();
  };

  const onEditPost = (post) => {
    // Log the post to see its structure
    console.log("Editing post:", post);
    
    // Make a copy of the post object
    const postForEditing = { ...post };
    
    // Ensure the post has the expected properties for the form
    if (postForEditing.postDescription && !postForEditing.post_description) {
      postForEditing.post_description = postForEditing.postDescription;
    }
    
    if (postForEditing.postType && !postForEditing.post_type) {
      postForEditing.post_type = postForEditing.postType;
    }
    
    if (postForEditing.postStatus && !postForEditing.post_status) {
      postForEditing.post_status = postForEditing.postStatus;
    }
    
    setEditingPost(postForEditing);
    setIsModalOpen(true);
  };

  const onLikePost = async (postId) => {
    await handleLikePost(postId);
    
    // Refresh posts to get updated like count
    loadPosts();
  };

  const getUserName = () => {
    if (profile?.firstname && profile?.lastname) {
      return `${profile.firstname} ${profile.lastname}`;
    } else if (profile?.firstname) {
      return profile.firstname;
    } else if (profile?.username) {
      return profile.username;
    }
    return '';
  };

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Optimize image loading
  const optimizeImageUrl = (url, width = 100) => {
    if (!url) return getAssetUrl('/assets/images/profile/default-avatar.png');
    
    if (url.startsWith('http')) {
      return url;
    }
    
    return `${API_URL}${url}?w=${width}`;
  };

  // Right sidebar content with weather
  const RightSidebar = (
    <div className="right-sidebar-content">
      <div className={`weather-section ${weatherData ? `weather-condition-${weatherData.weather[0]?.main?.toLowerCase() || 'default'}` : ''}`}>
        <div className="weather-section-header">
          <h2>
            <span className="weather-icon-title">☁️</span> 
            Weather Dashboard
          </h2>
          <div className="location-selector">
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="location-dropdown"
            >
              <option value="">Select City</option>
              {philippineCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        
        {weatherLoading ? (
          <div className="weather-loading">
            <div className="cloud-loader"></div>
            <p>Fetching weather data...</p>
          </div>
        ) : weatherError ? (
          <div className="weather-error">
            <span className="weather-emoji">⚠️</span>
            <p>{weatherError}</p>
          </div>
        ) : weatherData ? (
          <div className="weather-container">
            <div className="weather-header">
              <div className="weather-location">
                <span className="location-pin">📍</span>
                <h3>{weatherData.name}, Philippines</h3>
              </div>
              <div className="weather-temp">
                {Math.round(weatherData.main.temp)}°C
              </div>
            </div>
            
            <div className="weather-animation-container">
              {/* Dynamic weather animation based on conditions */}
              <div className={`weather-animation weather-${weatherData.weather[0]?.main?.toLowerCase() || 'default'}`}>
                {weatherData.weather[0]?.main === 'Rain' && (
                  <>
                    <div className="rain drop-1"></div>
                    <div className="rain drop-2"></div>
                    <div className="rain drop-3"></div>
                    <div className="rain drop-4"></div>
                    <div className="rain drop-5"></div>
                  </>
                )}
                {weatherData.weather[0]?.main === 'Clear' && (
                  <div className="sun"></div>
                )}
                {weatherData.weather[0]?.main === 'Clouds' && (
                  <>
                    <div className="cloud cloud-1"></div>
                    <div className="cloud cloud-2"></div>
                  </>
                )}
                {weatherData.weather[0]?.main === 'Thunderstorm' && (
                  <>
                    <div className="cloud thunder-cloud"></div>
                    <div className="lightning"></div>
                  </>
                )}
              </div>
              
              <div className="weather-icon-wrapper">
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                  alt={weatherData.weather[0].description}
                  className="weather-icon"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div className="weather-info">
              <div className="weather-description">
                {/* Add emoji based on weather */}
                <span className="weather-emoji">
                  {weatherData.weather[0]?.main === 'Clear' && '☀️'}
                  {weatherData.weather[0]?.main === 'Clouds' && '☁️'}
                  {weatherData.weather[0]?.main === 'Rain' && '🌧️'}
                  {weatherData.weather[0]?.main === 'Drizzle' && '🌦️'}
                  {weatherData.weather[0]?.main === 'Thunderstorm' && '⛈️'}
                  {weatherData.weather[0]?.main === 'Snow' && '❄️'}
                  {weatherData.weather[0]?.main === 'Mist' && '🌫️'}
                  {weatherData.weather[0]?.main === 'Smoke' && '💨'}
                  {weatherData.weather[0]?.main === 'Haze' && '🌫️'}
                  {weatherData.weather[0]?.main === 'Dust' && '💨'}
                  {weatherData.weather[0]?.main === 'Fog' && '🌫️'}
                  {weatherData.weather[0]?.main === 'Tornado' && '🌪️'}
                </span>
                {weatherData.weather[0].description}
              </div>
              
              <div className="weather-stats">
                <div className="weather-stat">
                  <span className="stat-icon">💧</span>
                  <span className="stat-label">Humidity:</span>
                  <span className="stat-value">{weatherData.main.humidity}%</span>
                </div>
                <div className="weather-stat">
                  <span className="stat-icon">💨</span>
                  <span className="stat-label">Wind:</span>
                  <span className="stat-value">{Math.round(weatherData.wind.speed * 3.6)} km/h</span>
                </div>
                <div className="weather-stat">
                  <span className="stat-icon">🌡️</span>
                  <span className="stat-label">Feels like:</span>
                  <span className="stat-value">{Math.round(weatherData.main.feels_like)}°C</span>
                </div>
              </div>
              
              <div className="weather-updated">
                <span className="update-icon">🔄</span>
                Updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ) : (
          <div className="weather-error">
            <span className="weather-emoji">🤔</span>
            <p>No weather data available</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <MainLayout rightSidebar={RightSidebar}>
      <div className="newsfeed-content">
        {/* Using Suspense for UserCarousel */}
        <Suspense fallback={
          <div className="user-carousel skeleton-carousel">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-avatar"></div>
            <div className="skeleton-avatar"></div>
            <div className="skeleton-avatar"></div>
            <div className="skeleton-avatar"></div>
          </div>
        }>
          <UserCarousel />
        </Suspense>
        
        <div className="feed-container">
          <CreatePostForm 
            onOpenModal={() => {
              setEditingPost(null);
              setIsModalOpen(true);
            }} 
          />
          
          {loading ? (
            <div className="loading-posts">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="newsfeed-items">
              {posts.length > 0 ? (
                <Suspense fallback={
                  <div className="loading-indicator">
                    <div className="loading-spinner"></div>
                    <p>Loading posts...</p>
                  </div>
                }>
                  {currentPosts.map(post => (
                    <NewsfeedItem 
                      key={post.newsfeedId || post.newsfeed_id}
                      post={post}
                      onUpdate={(updatedPost) => handleUpdatePost(post.newsfeedId || post.newsfeed_id, updatedPost)}
                      onDelete={() => onDeletePost(post.newsfeedId || post.newsfeed_id)}
                      onLike={() => onLikePost(post.newsfeedId || post.newsfeed_id)}
                      onEdit={() => onEditPost(post)}
                      isCurrentUser={profile?.id === post.user?.id}
                    />
                  ))}
                  
                  {/* Pagination controls */}
                  {posts.length > postsPerPage && (
                    <div className="pagination">
                      <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        className="pagination-button"
                      >
                        &laquo; Previous
                      </button>
                      
                      <div className="pagination-numbers">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                      >
                        Next &raquo;
                      </button>
                    </div>
                  )}
                </Suspense>
              ) : (
                <div className="no-posts-message">No posts to display. Be the first to create a post!</div>
              )}
            </div>
          )}
        </div>
        
        <PostFormModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPost(null);
          }}
          onSubmit={handleSubmitPost}
          editPost={editingPost}
          userName={getUserName()}
        />
      </div>
    </MainLayout>
  );
};

export default NewsfeedPage;