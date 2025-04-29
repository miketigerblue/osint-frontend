// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({ include: ['**/*.jsx','**/*.tsx'] })
  ],
  resolve: {
    extensions: ['.js','.jsx','.ts','.tsx'],
    alias: { '@': '/src' }
  },
  server: {
    port: 3005,
    proxy: {
      // Proxy all /mv_threat_frontend requests to port 3001
      '/mv_threat_frontend': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
