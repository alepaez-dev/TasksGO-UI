import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // In dev, resolve the design system to source so we get HMR
      '@all3hp/tasksgo-ui/styles.css': resolve(
        __dirname,
        '../../packages/ds/src/tokens/tokens.css',
      ),
      '@all3hp/tasksgo-ui': resolve(
        __dirname,
        '../../packages/ds/src/index.ts',
      ),
    },
  },
});
