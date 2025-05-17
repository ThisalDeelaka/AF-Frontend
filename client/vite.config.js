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
    // This alias config is not needed here since it's already at the top level.
    // alias: {
    //   '@': path.resolve(__dirname, 'src'),
    // },
  },
});
