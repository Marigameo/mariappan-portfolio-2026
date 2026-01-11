import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-helmet-async'],
          'animation': ['framer-motion'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-icons',
          ],
          'icons': ['lucide-react'],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Use esbuild for minification (default, faster than terser)
    minify: 'esbuild',
  },
})
