import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Allow access from outside the container
    port: 4000, 
  },
  define: {
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false
  }
});
