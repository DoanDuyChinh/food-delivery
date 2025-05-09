import { API_BASE_URL, USE_MOCKS } from '@/config/api.config';
import { mockService } from './mock.service';

// API request helper function
async function apiRequest(method, endpoint, data = null, headers = {}) {
  // If we're using mocks and in development mode, use the mock service
  if (USE_MOCKS) {
    switch (method.toLowerCase()) {
      case 'get':
        return mockService.get(endpoint);
      case 'post':
        return mockService.post(endpoint, data);
      case 'put':
        return mockService.put(endpoint, data);
      case 'patch':
        return mockService.patch(endpoint, data);
      case 'delete':
        return mockService.delete(endpoint);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  // For real API requests
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage if available
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data !== null && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || 'Something went wrong');
  }

  return responseData;
}

// Export API service methods
export const apiService = {
  get: (endpoint, headers = {}) => apiRequest('GET', endpoint, null, headers),
  post: (endpoint, data, headers = {}) => apiRequest('POST', endpoint, data, headers),
  put: (endpoint, data, headers = {}) => apiRequest('PUT', endpoint, data, headers),
  patch: (endpoint, data, headers = {}) => apiRequest('PATCH', endpoint, data, headers),
  delete: (endpoint, headers = {}) => apiRequest('DELETE', endpoint, null, headers)
};
