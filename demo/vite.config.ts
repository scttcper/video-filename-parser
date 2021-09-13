import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '../dist',
  },
  resolve: {
    alias: {
      '@ctrl/video-filename-parser': '../src/index.ts',
    },
  },
  optimizeDeps: {
    include: ['@ctrl/video-filename-parser'],
  },
});
