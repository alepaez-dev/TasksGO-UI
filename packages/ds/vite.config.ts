import { defineConfig } from 'vite';
import { resolve } from 'path';
import { dsTokensPlugin } from './vite-plugin-ds-tokens';

export default defineConfig({
  plugins: [dsTokensPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    cssCodeSplit: false,
  },
});
