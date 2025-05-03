// src/config/apiConfig.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Ensure URL always has https:// prefix if not localhost
const formattedApiUrl = API_URL.includes('localhost')
  ? API_URL
  : API_URL.startsWith('http') ? API_URL : `https://${API_URL}`;

export default formattedApiUrl;

console.log('API URL being used:', formattedApiUrl); // Debug log