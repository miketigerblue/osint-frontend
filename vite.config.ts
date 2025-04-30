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
      // In dev, any fetch('/analysis.json') is forwarded to your Pages Function
      '/analysis.json': {
        target: 'https://tigerblue.app',
        changeOrigin: true,
        secure: true
      }
    }
  }
});
