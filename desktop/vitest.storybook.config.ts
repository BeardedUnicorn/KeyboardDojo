import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./.storybook/vitest-setup.js'],
    include: ['**/src/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    deps: {
      inline: [/storybook-/],
    },
    // Enable Jest compatibility mode
    alias: {
      'jest': 'vitest',
    },
    // Environment options
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    // Increase timeout for Storybook tests
    testTimeout: 30000,
  },
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