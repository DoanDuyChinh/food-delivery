import api from './api';
import { mockService } from './mock.service';

// Use mockService for development, real API for production
const service = import.meta.env.PROD ? api : mockService;

export const authService = {
  async login(credentials) {
    return service.post('/auth/login', credentials);
  },
  
  async register(userData) {
    return service.post('/auth/register', userData);
  }
};
