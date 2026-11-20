import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        name: 'DuplicateCleaner',
        short_name: 'DupCleaner',
        description: 'Detecta y elimina archivos duplicados en tus unidades. 100% local y privado.',
        theme_color: '#6366f1',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'es',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          { src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'apple touch icon' },
        ],
        screenshots: [],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],

  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) return 'recharts';
            if (id.includes('papaparse')) return 'papaparse';
            if (id.includes('lucide-react')) return 'lucide';
            if (id.includes('react-dom') || id.includes('react/')) return 'react-core';
          }
        },
      },
    },
  },
})
