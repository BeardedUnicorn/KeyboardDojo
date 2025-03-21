import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Cast the react plugin to avoid type conflicts
const viteReactPlugin = react();

export default defineConfig({
  plugins: [viteReactPlugin],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/src/test/**'],
    },
  },
  // Path aliases configuration for tests
  // These must match the paths in tsconfig.json and vite.config.ts
  // See src/docs/import-aliases.md for more information
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@pages': resolve(__dirname, './src/pages'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@services': resolve(__dirname, './src/services'),
      '@data': resolve(__dirname, './src/data'),
      '@tests': resolve(__dirname, './src/tests'),
      '@store': resolve(__dirname, './src/store'),
      '@slices': resolve(__dirname, './src/store/slices'),
    },
  },
});
