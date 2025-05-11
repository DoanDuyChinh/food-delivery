import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import './assets/css/tailwind.css'
import App from './App.vue'
import router from './router'

// Load Google Maps API before initializing Vue
const loadGoogleMapsApi = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      return resolve();
    }
    
    // Create the script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA8Q6jEppe4cAlC4dXrZ8q6G1t_b3z53r0&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    
    document.head.appendChild(script);
  });
};

// Initialize app after Google Maps loads
loadGoogleMapsApi()
  .then(() => {
    const app = createApp(App)
    const pinia = createPinia()

    app.use(pinia)
    app.use(router)
    app.use(VueToast)

    app.mount('#app')
  })
  .catch((error) => {
    console.error('Failed to load Google Maps API:', error);
    // Start app anyway, but some features will be limited
    const app = createApp(App)
    const pinia = createPinia()

    app.use(pinia)
    app.use(router)
    app.use(VueToast)

    app.mount('#app')
  });
