/**
 * API Configuration
 * This file manages API endpoints for different environments
 */

const API_ENDPOINTS = {
  development: 'http://localhost:3000',
  production: import.meta.env.VITE_API_URL || 'https://your-backend-api.com',
  // If you're using mock data for development
  mock: ''
};

// Determine the current environment
const environment = import.meta.env.MODE || 'development';

// For local development, you can use the mock service by uncommenting this line
// const apiMode = 'mock';
const apiMode = environment === 'production' ? 'production' : 'development';

export const API_BASE_URL = API_ENDPOINTS[apiMode];

// Export configuration flag to determine if we should use mocks
export const USE_MOCKS = apiMode === 'mock' || environment === 'development';
