import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub/GitLab Pages, use the project name as base path
  base: '/VIM/',
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    proxy: {
      // Proxy GitLab API requests to avoid CORS issues
      '/api/v4': {
        target: 'https://gitlab.com',
        changeOrigin: true,
        secure: true,
        headers: process.env.GITLAB_TOKEN ? {
          'Authorization': `Bearer ${process.env.GITLAB_TOKEN}`,
        } : {},
      },
      // Proxy to your GitLab Pages if needed
      '/gitlab-pages': {
        target: process.env.GITLAB_PAGES_URL || 'https://your-username.gitlab.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/gitlab-pages/, ''),
      },
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
