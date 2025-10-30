import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
    coverage: {
      include: ['src/**'],
      reporter: ['text', 'json', 'html'],
    },
  },
});
