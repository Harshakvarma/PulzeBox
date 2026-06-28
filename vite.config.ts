import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// For GitHub Pages project pages, base should be '/<repo-name>/'
// GitHub Actions sets GITHUB_REPOSITORY env var (e.g., "user/repo")
// For local dev and user/org pages (username.github.io), use '/'
const getBase = () => {
  if (process.env.GITHUB_REPOSITORY) {
    // Extract repo name from "owner/repo"
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
    return `/${repoName}/`
  }
  // Check for BASE_PATH env var (set in GitHub Actions workflow)
  if (process.env.BASE_PATH) {
    return process.env.BASE_PATH
  }
  return '/'
}

const base = getBase()

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