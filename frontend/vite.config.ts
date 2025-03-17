import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: '',
    // Define environment variables to be used in the app
    define: {
      // Expose VITE_ environment variables to the application
      // This is optional as Vite automatically exposes VITE_* variables
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }
})
