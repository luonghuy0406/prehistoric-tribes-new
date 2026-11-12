import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // assets/ is served as-is: original/ (res/, music/ for the original engine) and hd/ (new art + manifest).
  publicDir: fileURLToPath(new URL('../../assets', import.meta.url)),
  base: './',
  build: { chunkSizeWarningLimit: 1500 },
});
