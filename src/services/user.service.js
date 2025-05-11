import api from './api';
import { mockService } from './mock.service';

// Use real API instead of mockService
const service = import.meta.env.PROD ? api : api;  // Changed from mockService to api

export const userService = {
  async getProfile() {
    return service.get('/users/profile');
  },
  
  async updateProfile(profileData) {
    return service.patch('/users/profile', profileData);
  },
  
  async changePassword(passwordData) {
    return service.put('/users/password', passwordData);
  }
};
