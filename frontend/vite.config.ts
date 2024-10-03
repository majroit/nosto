import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: process.env.VITE_HOST || '0.0.0.0', // Explicitly set the host via environment variables
    port: process.env.VITE_PORT || 4000,      // Set the port from environment variables
  },
  define: {
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false
  }
});
