import { defineStore } from 'pinia';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: isBrowser ? localStorage.getItem('token') : null,
    userRole: isBrowser ? localStorage.getItem('userRole') : null,
    loading: false,
    error: null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.userRole === 'admin',
    isShipper: (state) => state.userRole === 'shipper',
    isCustomer: (state) => state.userRole === 'customer',
  },
  
  actions: {
    setUser(user) {
      this.user = user;
    },
    
    setToken(token) {
      this.token = token;
      if (isBrowser && token) {
        localStorage.setItem('token', token);
      } else if (isBrowser) {
        localStorage.removeItem('token');
      }
    },
    
    setUserRole(role) {
      this.userRole = role;
      if (isBrowser && role) {
        localStorage.setItem('userRole', role);
      } else if (isBrowser) {
        localStorage.removeItem('userRole');
      }
    },
    
    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authService.login(credentials);
        this.setToken(response.accessToken);
        this.setUserRole(response.role);
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
      this.setToken(null);
      this.setUserRole(null);
      
      if (isBrowser) {
        localStorage.removeItem('userId');
      }
    },
  },
});
