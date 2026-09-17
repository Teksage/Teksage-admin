/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'; // Use vitest/config, not vite
import react from '@vitejs/plugin-react';
import bundleAnalyzer from 'vite-bundle-analyzer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'analyze' ? [bundleAnalyzer()] : []),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
}));
