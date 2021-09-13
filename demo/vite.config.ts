import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '../build',
  },
  optimizeDeps: {
    include: ['@ctrl/video-filename-parser'],
  },
});
