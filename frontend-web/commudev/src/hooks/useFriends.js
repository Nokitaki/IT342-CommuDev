// src/hooks/useFriends.js
import { useState, useEffect, useCallback } from 'react';
import { 
  getFriends, 
  getPendingFriendRequests, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  removeFriend 
} from '../services/friendService';

/**
 * Custom hook to manage friends and friend requests
 */
const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Force a refresh of the data when this changes
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Fetch friends list
  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const friendsData = await getFriends();
      setFriends(friendsData);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pending friend requests
  const fetchPendingRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const requestsData = await getPendingFriendRequests();
      setPendingRequests(requestsData);
    } catch (err) {
      console.error('Error fetching friend requests:', err);
      setError('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  }, []);

  // Accept a friend request
  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      
      // Update the pending requests list by removing the accepted request
      setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      // Refresh friends list
      await fetchFriends();
      
      return true;
    } catch (err) {
      console.error('Error accepting friend request:', err);
      setError('Failed to accept friend request');
      return false;
    }
  };

  // Reject a friend request
  const handleRejectRequest = async (requestId) => {
    try {
      await rejectFriendRequest(requestId);
      
      // Update the pending requests list by removing the rejected request
      setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      return true;
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      setError('Failed to reject friend request');
      return false;
    }
  };

  // Remove a friend
  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      
      // Update the friends list by removing the deleted friend
      setFriends(prevFriends => 
        prevFriends.filter(friend => friend.id !== friendId)
      );
      
      return true;
    } catch (err) {
      console.error('Error removing friend:', err);
      setError('Failed to remove friend');
      return false;
    }
  };

  // Refresh all data
  const refreshFriendsData = () => {
    setLastRefresh(Date.now());
  };

  // Load initial data and refresh when lastRefresh changes
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        // Load both data sets in parallel
        await Promise.all([
          fetchFriends(),
          fetchPendingRequests()
        ]);
      } catch (err) {
        console.error('Error loading friends data:', err);
        setError('Failed to load friends data');
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [fetchFriends, fetchPendingRequests, lastRefresh]);

  return {
    friends,
    pendingRequests,
    loading,
    error,
    handleAcceptRequest,
    handleRejectRequest,
    handleRemoveFriend,
    refreshFriendsData
  };
};

export default useFriends;