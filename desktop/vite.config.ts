import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.app/v1/api/config/#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],

  // Add base URL for Tauri
  base: './',

  build: {
    // Tauri supports es2021
    target: ['es2021', 'chrome100', 'safari13'],
    // don't minify for debug builds
    minify: mode === 'production' ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: mode !== 'production',
    // Disable code splitting completely
    rollupOptions: {
      output: {
        // Disable code splitting by creating a single bundle
        inlineDynamicImports: true,
        // Ensure assets are loaded relative to base URL
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Increase chunk size warning limit for development
    chunkSizeWarningLimit: 5000,
  },
  // Path aliases configuration
  // These must match the paths in tsconfig.json
  // See src/docs/import-aliases.md for more information
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@services': path.resolve(__dirname, './src/services'),
      '@data': path.resolve(__dirname, './src/data'),
      '@tests': path.resolve(__dirname, './src/tests'),
      '@store': path.resolve(__dirname, './src/store'),
      '@slices': path.resolve(__dirname, './src/store/slices'),
    },
  },
}));
