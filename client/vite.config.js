import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, 'public/_redirects'),
          dest: '.', // Copy to root of dist/
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public', // Copy public files like favicon, images, etc.
  build: {
    rollupOptions: {
      input: './index.html',
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
