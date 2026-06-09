import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base defaults to '/' (Railway serves at root). The GitHub Pages workflow sets
// VITE_BASE=/client-demos/ so assets resolve under the project Pages sub-path.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
