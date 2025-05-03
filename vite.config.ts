import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      include: ['**/*.jsx', '**/*.tsx']
    })
  ],
  resolve: {
    alias: { '@': '/src' },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    port: 3005,
    proxy: {
      // Any request to /api/analysis in Dev is forwarded to your Pages Function
      '/api/analysis': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
