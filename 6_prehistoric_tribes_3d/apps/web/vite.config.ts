import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // Original game resources (res/, music/) are served as-is from assets/original.
  publicDir: fileURLToPath(new URL('../../assets/original', import.meta.url)),
  base: './',
  build: { chunkSizeWarningLimit: 1500 },
});
