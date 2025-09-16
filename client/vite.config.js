import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // PWA temporarily disabled - missing icon files
    // VitePWA will be re-enabled after adding proper icons
  ],
  server: {
    host: true, // listen on 0.0.0.0 for LAN access
    port: 5173,
  },
})
