import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public', // Ensure Vite copies public/ (including _redirects) to dist/
  build: {
    rollupOptions: {
      input: './index.html', // Makes sure index.html is treated as the entry
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/test/**/*.test.{js,jsx,ts,tsx}'],
    css: true,
    deps: {
      inline: [
        '@testing-library/react',
        '@testing-library/jest-dom',
        'react-router-dom',
      ],
    },
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
});
