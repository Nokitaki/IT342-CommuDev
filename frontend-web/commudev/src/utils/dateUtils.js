// src/utils/dateUtils.js

/**
 * Format a date string into a relative time (e.g., "2 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative time string
 */
export const formatTimeAgo = (dateString) => {
  if (!dateString) return "Just now";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
    
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    
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
    
    // Convert to weeks
    const diffInWeeks = Math.floor(diffInDays / 7);
    
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    }
    
    // Convert to months
    const diffInMonths = Math.floor(diffInDays / 30);
    
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    // Convert to years
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Just now"; // Fallback in case of errors
  }
};

/**
 * Format a date to a human-readable string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString(undefined, mergedOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid date';
  }
};

/**
 * Get month name from month index
 * @param {number} monthIndex - Month index (0-11)
 * @returns {string} Month name
 */
export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months[monthIndex] || '';
};

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is yesterday
 */
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Format a date as "Today", "Yesterday" or a date string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatRelativeDate = (date) => {
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return formatDate(date);
  }
};

export default {
  formatTimeAgo,
  formatDate,
  getMonthName,
  isToday,
  isYesterday,
  formatRelativeDate
};