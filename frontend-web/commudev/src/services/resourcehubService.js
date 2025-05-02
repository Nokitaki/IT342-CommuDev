// src/services/resourcehubService.js
import API_URL from '../config/apiConfig';
import { getAuthHeaders } from './api';

/**
 * Fetch all resources from the resource hub
 * @returns {Promise<Array>} - Promise that resolves to an array of resources
 */
export const getAllResources = async () => {
  try {
    // Add authentication headers to the request
    const response = await fetch(`${API_URL}/api/resourcehub/all`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

/**
 * Get a resource by ID
 * @param {number} resourceId - The ID of the resource to fetch
 * @returns {Promise<Object>} - Promise that resolves to a resource object
 */
export const getResourceById = async (resourceId) => {
  try {
    const response = await fetch(`${API_URL}/api/resourcehub/${resourceId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching resource ${resourceId}:`, error);
    throw error;
  }
};

/**
 * Create a new resource
 * @param {Object} resourceData - Data for the new resource
 * @returns {Promise<Object>} - Promise that resolves to the created resource
 */
export const createResource = async (resourceData) => {
  try {
    const response = await fetch(`${API_URL}/api/resourcehub/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(resourceData)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

/**
 * Update an existing resource
 * @param {number} resourceId - ID of the resource to update
 * @param {Object} resourceData - New data for the resource
 * @returns {Promise<Object>} - Promise that resolves to the updated resource
 */
export const updateResource = async (resourceId, resourceData) => {
  try {
    const response = await fetch(`${API_URL}/api/resourcehub/update/${resourceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(resourceData)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating resource ${resourceId}:`, error);
    throw error;
  }
};

/**
 * Delete a resource
 * @param {number} resourceId - ID of the resource to delete
 * @returns {Promise<string>} - Promise that resolves to a success message
 */
export const deleteResource = async (resourceId) => {
  try {
    const response = await fetch(`${API_URL}/api/resourcehub/delete/${resourceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    // First check if the response content type is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // If it's not JSON, just return the text as a success message
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.error(`Error deleting resource ${resourceId}:`, error);
    throw error;
  }
};

/**
 * Like (heart) a resource
 * @param {number} resourceId - ID of the resource to like
 * @returns {Promise<Object>} - Promise that resolves to the updated resource
 */
export const likeResource = async (resourceId) => {
  try {
    const response = await fetch(`${API_URL}/api/resourcehub/heart/${resourceId}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error liking resource ${resourceId}:`, error);
    throw error;
  }
};

/**
 * Search resources by title
 * @param {string} keyword - Search keyword
 * @returns {Promise<Array>} - Promise that resolves to an array of matching resources
 */
export const searchResources = async (keyword) => {
  try {
    const response = await fetch(`${API_URL}/api/resourcehub/search?keyword=${encodeURIComponent(keyword)}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error searching resources with keyword "${keyword}":`, error);
    throw error;
  }
};

/**
 * Get resources by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} - Promise that resolves to an array of resources in the category
 */
export const getResourcesByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/api/resourcehub/category/${encodeURIComponent(category)}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching resources in category "${category}":`, error);
    throw error;
  }
};

/**
 * Get resources by creator
 * @param {string} creator - Creator's username or ID
 * @returns {Promise<Array>} - Promise that resolves to an array of resources by the creator
 */
export const getResourcesByCreator = async (creator) => {
  try {
    const response = await fetch(`${API_URL}/api/resourcehub/creator/${encodeURIComponent(creator)}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching resources by creator "${creator}":`, error);
    throw error;
  }
};

export default {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  likeResource,
  searchResources,
  getResourcesByCategory,
  getResourcesByCreator
};