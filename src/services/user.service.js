import api from './api';
import { mockService } from './mock.service';

// Use mockService for development, real API for production
const service = import.meta.env.PROD ? api : mockService;

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
