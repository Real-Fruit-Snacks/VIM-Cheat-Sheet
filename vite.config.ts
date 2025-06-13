import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitLab Pages, use the project name as base path
  base: '/VIM/',
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  build: {
    // Ensure proper chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'vim-wasm': ['vim-wasm'],
          'monaco': ['monaco-editor', 'monaco-vim'],
        },
      },
    },
    // Copy headers file to dist
    assetsInlineLimit: 0, // Don't inline any assets
  },
  optimizeDeps: {
    include: ['monaco-editor', 'monaco-vim'],
  },
})
