import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
   port:4000,
    proxy: {
      '/api': {
        target: 'http://172.20.78.49:3000',
        changeOrigin: true,
         secure: false,
      },
    },
  },
});