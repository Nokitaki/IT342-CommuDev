// src/config/assetConfig.js
const ASSETS_URL = process.env.NODE_ENV === 'production' 
  ? '' // Empty string means it will use the root of your domain
  : '';

export default ASSETS_URL;