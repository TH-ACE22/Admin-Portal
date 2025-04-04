import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      global: 'globalthis', // 👈 define global for browser
    },
  },
  define: {
    global: 'globalThis', // 👈 explicitly define global
  },
  optimizeDeps: {
    include: ['sockjs-client'], // force Vite to prebundle it
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
});