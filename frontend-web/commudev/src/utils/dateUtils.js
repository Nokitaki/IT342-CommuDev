// src/utils/dateUtils.js

/**
 * Format a date string into a relative time (e.g., "2 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative time string
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return "Just now"; // Changed from "No date available" to "Just now"

  try {
    const postDate = new Date(dateString);
    if (isNaN(postDate.getTime())) return "Just now"; // Changed from "Invalid date" to "Just now"
    
    const now = new Date();
    const diffInMilliseconds = now.getTime() - postDate.getTime();
    
    // If date is in the future (possible with system clock differences)
    if (diffInMilliseconds < 0) return "Just now";
    
    // Convert to seconds
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    
    if (diffInSeconds < 60) {
      return diffInSeconds < 10 ? 'Just now' : `${diffInSeconds} seconds ago`;
    }
    
    // Convert to minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Convert to hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Convert to days
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    // For older dates, return the formatted date
    return postDate.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Just now"; // Fallback in case of errors
  }
};

/**
 * Format a date object to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDateToISOString = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  return date.toISOString().split('T')[0];
};

/**
 * Get the month name from a date
 * @param {Date|string} date - Date object or date string
 * @returns {string} Month name
 */
export const getMonthName = (date) => {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (date instanceof Date && !isNaN(date.getTime())) {
    return months[date.getMonth()];
  }
  
  return '';
};