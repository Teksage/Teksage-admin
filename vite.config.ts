import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import bundleAnalyzer from 'vite-bundle-analyzer';

// https://vite.dev/config/
export default defineConfig({
// plugins: [react()],
  plugins: [bundleAnalyzer()],
})
