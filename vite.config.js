import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Generate sourcemaps for production build
    sourcemap: false,
    // Reduce the file size
    minify: 'terser',
    // Configure optimization
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Fix issues with Render's build process
  optimizeDeps: {
    exclude: [],
  },
  server: {
    port: process.env.PORT || 5173,
    host: true, // This is needed for Docker/Render to work properly
  }
});
