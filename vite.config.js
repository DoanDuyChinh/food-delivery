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
    // Use esbuild for minification instead of terser
    minify: 'esbuild',
    // esbuild options
    esbuildOptions: {
      target: ['esnext', 'edge88', 'firefox78', 'chrome87', 'safari14'],
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
