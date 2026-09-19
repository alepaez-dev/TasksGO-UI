import { defineConfig } from 'vitest/config';
import { dsTokensPlugin } from './vite-plugin-ds-tokens';

export default defineConfig({
  plugins: [dsTokensPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    exclude: ['node_modules', 'dist', 'e2e'],
  },
});
