// src/hooks/useResourcehub.js
import { useState, useEffect, useCallback } from 'react';
import * as resourcehubService from '../services/resourcehubService';
import useProfile from './useProfile';

/**
 * Custom hook for managing resource hub operations
 * @returns {Object} Resource hub methods and state
 */
const useResourcehub = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { profile } = useProfile();
  const [likedResources, setLikedResources] = useState({});

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Fetch all resources
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await resourcehubService.getAllResources();
      setResources(data);
      
      return data;
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch resources by category
  const fetchResourcesByCategory = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await resourcehubService.getResourcesByCategory(category);
      setResources(data);
      
      return data;
    } catch (err) {
      console.error(`Error fetching resources in category "${category}":`, err);
      setError('Failed to load resources for this category.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch resources by creator (get my resources)
  const fetchMyResources = useCallback(async () => {
    if (!profile) {
      setError('You must be logged in to view your resources');
      return [];
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await resourcehubService.getResourcesByCreator(profile.username);
      setResources(data);
      
      return data;
    } catch (err) {
      console.error('Error fetching your resources:', err);
      setError('Failed to load your resources.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Search resources
  const searchResources = useCallback(async (keyword) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await resourcehubService.searchResources(keyword);
      setResources(data);
      
      return data;
    } catch (err) {
      console.error(`Error searching resources with keyword "${keyword}":`, err);
      setError('Failed to search resources.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new resource
  const createResource = useCallback(async (resourceData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add creator field if not present
      const completeData = {
        ...resourceData,
        creator: profile?.username || resourceData.creator
      };
      
      const newResource = await resourcehubService.createResource(completeData);
      
      // Update resources list with the new resource
      setResources(prev => [newResource, ...prev]);
      
      setSuccess('Resource created successfully!');
      return newResource;
    } catch (err) {
      console.error('Error creating resource:', err);
      setError('Failed to create resource. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Update an existing resource
  const updateResource = useCallback(async (resourceId, resourceData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the current resource to preserve creator field
      const currentResource = resources.find(r => r.resourceId === resourceId);
      
      // Make sure the creator field is preserved in update data
      const completeData = {
        ...resourceData,
        creator: currentResource ? currentResource.creator : (profile?.username || resourceData.creator)
      };
      
      const updatedResource = await resourcehubService.updateResource(resourceId, completeData);
      
      // Update resources list with the updated resource
      setResources(prev => 
        prev.map(resource => resource.resourceId === resourceId ? updatedResource : resource)
      );
      
      setSuccess('Resource updated successfully!');
      return updatedResource;
    } catch (err) {
      console.error(`Error updating resource ${resourceId}:`, err);
      setError('Failed to update resource. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [resources, profile]);

  // Delete a resource
  const deleteResource = useCallback(async (resourceId) => {
    try {
      setLoading(true);
      setError(null);
      
      await resourcehubService.deleteResource(resourceId);
      
      // Remove the deleted resource from the list
      setResources(prev => prev.filter(resource => resource.resourceId !== resourceId));
      
      setSuccess('Resource deleted successfully!');
      return true;
    } catch (err) {
      console.error(`Error deleting resource ${resourceId}:`, err);
      setError('Failed to delete resource. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Like/unlike a resource
  const likeResource = useCallback(async (resourceId, isLike = true) => {
    try {
      setError(null);
      
      // Toggle locally first for fast UI feedback
      setLikedResources(prev => ({
        ...prev,
        [resourceId]: isLike
      }));
      
      // For now our API only supports liking, not unliking
      // In future this will be upgraded to support unlike
      const updatedResource = await resourcehubService.likeResource(resourceId);
      
      // Update resources list with the liked resource
      setResources(prev => 
        prev.map(resource => resource.resourceId === resourceId ? updatedResource : resource)
      );
      
      return updatedResource;
    } catch (err) {
      console.error(`Error liking resource ${resourceId}:`, err);
      setError('Failed to like resource. Please try again.');
      
      // Revert local state on error
      setLikedResources(prev => ({
        ...prev,
        [resourceId]: !isLike
      }));
      
      return null;
    }
  }, []);

  // Download a resource (placeholder for now)
  const downloadResource = useCallback(async (resourceId) => {
    try {
      setError(null);
      
      const result = await resourcehubService.downloadResource(resourceId);
      
      if (!result.success) {
        setError(result.message || 'Download functionality not yet implemented.');
      }
      
      return result;
    } catch (err) {
      console.error(`Error downloading resource ${resourceId}:`, err);
      setError('Failed to download resource. Please try again.');
      return null;
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
    resources,
    loading,
    error,
    success,
    likedResources,
    fetchResources,
    fetchResourcesByCategory,
    fetchMyResources,
    searchResources,
    createResource,
    updateResource,
    deleteResource,
    likeResource,
    downloadResource,
    setError,
    setSuccess
  };
};

export default useResourcehub;