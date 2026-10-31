import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'
import { isCacheableStoriesRequest } from './src/lib/storiesCache.ts'

// The site is served from https://moharem.github.io/how-i-started/
const base = '/how-i-started/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      pwaAssets: { config: true },
      manifest: {
        name: 'بدأت إزاي؟ · How I Started',
        short_name: 'بدأت إزاي؟',
        description: 'قصص حقيقية عن بدايات أصحاب المشاريع، بالأرقام.',
        lang: 'ar',
        dir: 'rtl',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#faf7f2',
        theme_color: '#0f5c4d',
      },
      workbox: {
        // Single-page app: any page loads index.html when offline.
        navigateFallback: `${base}index.html`,
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Published stories are fetched fresh when online; the last copy is used offline.
        // Admin requests (which include unpublished stories) are never cached.
        runtimeCaching: [
          {
            urlPattern: isCacheableStoriesRequest,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'stories-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  test: { environment: 'node' },
})
