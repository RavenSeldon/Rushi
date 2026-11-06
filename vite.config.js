import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Served at the root of https://maitrism.com (public/CNAME). Was '/Rushi/'
  // for https://ravenseldon.github.io/Rushi/, which now redirects here.
  base: '/',
  build: {
    // three.js is most of the weight; keeping it in its own chunk means data
    // and interface updates don't make returning visitors re-download it.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
