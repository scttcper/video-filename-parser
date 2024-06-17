// @ts-expect-error
import config from '@ctrl/eslint-config-biome';
import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
  includeIgnoreFile(gitignorePath),
  {
    ignores: ['tailwind.config.cjs', 'postcss.config.cjs', 'eslint.config.mjs', 'vite.config.ts'],
  },
  ...config,
];
