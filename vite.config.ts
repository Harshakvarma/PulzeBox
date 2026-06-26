import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// For GitLab Pages, set base to '/<project-name>/' when deploying to a project subpath
// Use process.env.CI_PROJECT_NAME for dynamic project name in CI, fallback to '/' for local dev
const base = process.env.CI_PROJECT_NAME ? `/${process.env.CI_PROJECT_NAME}/` : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'PulseBox - Box Breathing',
        short_name: 'PulseBox',
        description: 'Box breathing (4-4-4-4) breathing technique with vibration and visual timer',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: base,
        start_url: base,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
