import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    singleThread: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
