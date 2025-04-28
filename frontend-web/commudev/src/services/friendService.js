import API_URL from '../config/apiConfig.js';



/**
 * Send a friend request to another user
 * @param {string|number} userId - The ID of the user to send the request to
 * @returns {Promise<Object>} - Response with success message
 */
export const sendFriendRequest = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/friends/request/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || `Error ${response.status}: ${response.statusText}`;
      
      // Pass through the specific error message from the server
      // This will allow us to detect the "already sent" error message
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

/**
 * Get all pending friend requests for the current user
 * @returns {Promise<Array>} - Array of pending friend requests
 */
export const getPendingFriendRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No token available for friend requests');
      return [];
    }
    
    const response = await fetch(`${API_URL}/api/friends/requests/pending`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending friend requests:', error);
    // Return empty array instead of throwing to prevent crashes
    return [];
  }
};

/**
 * Accept a friend request
 * @param {string|number} requestId - The ID of the friend request to accept
 * @returns {Promise<Object>} - Response with success message
 */
export const acceptFriendRequest = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/friends/request/${requestId}/accept`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

/**
 * Reject a friend request
 * @param {string|number} requestId - The ID of the friend request to reject
 * @returns {Promise<Object>} - Response with success message
 */
export const rejectFriendRequest = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/friends/request/${requestId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

/**
 * Get all friends of the current user
 * @returns {Promise<Array>} - Array of friends
 */
export const getFriends = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No token available for fetching friends');
      return [];
    }
    
    const response = await fetch(`${API_URL}/api/friends`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching friends:', error);
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Remove a friend
 * @param {string|number} userId - The ID of the friend to remove
 * @returns {Promise<Object>} - Response with success message
 */
export const removeFriend = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/api/friends/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

/**
 * Check if a user is a friend of the current user
 * @param {string|number} userId - The ID of the user to check
 * @returns {Promise<Object>} - Response with isFriend and pendingRequest booleans
 */
export const checkFriendStatus = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // First check if they are friends
    const friendResponse = await fetch(`${API_URL}/api/friends/check/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!friendResponse.ok) {
      const errorData = await friendResponse.json();
      throw new Error(errorData.error || `Error ${friendResponse.status}: ${friendResponse.statusText}`);
    }
    
    const friendStatus = await friendResponse.json();
    
    // If they are friends, we don't need to check for pending requests
    if (friendStatus.isFriend) {
      return {
        isFriend: true,
        pendingRequest: false
      };
    }
    
    // If they're not friends, check if there's a pending request
    try {
      // Get all pending requests
      const pendingRequestsResponse = await fetch(`${API_URL}/api/friends/requests/pending`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (pendingRequestsResponse.ok) {
        const pendingRequests = await pendingRequestsResponse.json();
        
        // Check if any pending request is for this user
        const hasPendingRequest = pendingRequests.some(
          request => request.receiver?.id == userId || request.sender?.id == userId
        );
        
        return {
          isFriend: false,
          pendingRequest: hasPendingRequest
        };
      }
    } catch (error) {
      console.error('Error checking pending requests:', error);
    }
    
    // Default response if pending request check fails
    return {
      isFriend: friendStatus.isFriend,
      pendingRequest: false
    };
  } catch (error) {
    console.error('Error checking friend status:', error);
    throw error;
  }
};


