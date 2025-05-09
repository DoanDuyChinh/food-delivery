import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
    isAdmin: (state) => state.user?.role === 'admin',
    isCustomer: (state) => state.user?.role === 'customer',
    isShipper: (state) => state.user?.role === 'shipper',
  },
  
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    
    setUser(user) {
      this.user = user;
      if (user?.role) {
        localStorage.setItem('userRole', user.role);
      }
    },
    
    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authService.login(credentials);
        this.setToken(response.accessToken);
        this.setUser({ 
          userId: response.userId,
          role: response.role
        });
        await this.fetchUserProfile();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to login';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authService.register(userData);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to register';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUserProfile() {
      if (!this.token) return;
      
      this.loading = true;
      
      try {
        const user = await userService.getProfile();
        this.setUser(user);
        return user;
      } catch (error) {
        this.error = error.message || 'Failed to fetch user profile';
        this.logout();
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProfile(profileData) {
      this.loading = true;
      
      try {
        const response = await userService.updateProfile(profileData);
        this.setUser({ ...this.user, ...response });
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async changePassword(passwordData) {
      this.loading = true;
      
      try {
        const response = await userService.changePassword(passwordData);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to change password';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    },
  },
});
