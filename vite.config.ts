import { defineConfig } from 'vite';

// On GitHub Pages the site is served from /<repo-name>/, so assets need that
// prefix. The deploy workflow sets VITE_BASE. Locally it stays at '/'.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
