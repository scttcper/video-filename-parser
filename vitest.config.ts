import { defineConfig, type ViteUserConfig } from 'vitest/config';

const config: ViteUserConfig = defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
  },
});

export default config;
