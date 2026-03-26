import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {      // enable HTTPS without custom cert
    port: 5173,
    // optional, auto opens browser
  },
});