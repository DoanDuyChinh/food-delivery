import api from './api';

export const authService = {
  // User login
  async login(credentials) {
    return api.post('/auth/login', credentials);
  },
  
  // User registration
  async register(userData) {
    return api.post('/auth/register', userData);
  },
  
  // Get user profile
  async getUserProfile() {
    return api.get('/users/profile');
  },
  
  // Update user profile
  async updateUserProfile(profileData) {
    return api.patch('/users/profile', profileData);
  },
  
  // Change user password
  async changePassword(passwordData) {
    return api.put('/users/password', passwordData);
  }
};
