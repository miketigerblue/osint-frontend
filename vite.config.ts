// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ include: ['**/*.jsx', '**/*.tsx'] })],
  resolve: {
    alias: { '@': '/src' },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    port: 3005,
    proxy: {
      '/mv_threat_frontend': {
        target: 'https://tigerblue.app',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/analysis.json'   
      }
    }
  }
});
