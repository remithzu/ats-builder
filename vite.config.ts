import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Detect if building for GitHub Pages
const isGhPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: isGhPages ? '/ats-builder/' : '/',
  plugins: [react()],
  server: {
    port: 3000,
  }
});
