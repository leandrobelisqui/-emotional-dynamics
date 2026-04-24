import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Build separado para a UI mobile (controle remoto).
// Gera em dist-mobile/ — servido pelo Electron HTTP server.
export default defineConfig({
  root: path.resolve(__dirname, 'mobile'),
  plugins: [react()],
  base: './',
  build: {
    outDir: path.resolve(__dirname, 'dist-mobile'),
    emptyOutDir: true,
    target: 'es2020',
  },
});
