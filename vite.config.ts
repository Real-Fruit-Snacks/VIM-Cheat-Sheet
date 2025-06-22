import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub/GitLab Pages, use the project name as base path
  base: '/VIM/',
  build: {
    // Optimize bundle size
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Ensure proper chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lucide-icons': ['lucide-react'],
          'search-utils': ['fuse.js', 'lodash.debounce'],
          'virtual-list': ['react-window', 'react-window-infinite-loader'],
          'vim-data': ['./src/data/vim-commands', './src/data/vim-examples'],
        },
        // Better naming for chunks
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
  // Development server configuration
  server: {
    headers: {
      // Enable CORS for development
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'fuse.js',
      'lodash.debounce',
      'react-window',
      'react-window-infinite-loader'
    ],
  },
})
