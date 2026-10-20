import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
const repository = fileURLToPath(new URL('../..', import.meta.url));

// Isolated browser tests only. This entry is outside Next.js routes and has no production login bypass.
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  publicDir: fileURLToPath(new URL('../../public', import.meta.url)),
  plugins: [react()],
  define: {
    'process.env.NEXTAUTH_URL': 'undefined',
    'process.env.NEXTAUTH_URL_INTERNAL': 'undefined',
    'process.env.VERCEL_URL': 'undefined',
  },
  resolve: {
    alias: {
      '@': repository,
      'next/image': fileURLToPath(new URL('./image.tsx', import.meta.url)),
    },
  },
  server: { host: '127.0.0.1', port: 3100, strictPort: true, fs: { allow: [repository] } },
});
