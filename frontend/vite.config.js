import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Fix for libraries (like sockjs-client) that expect a Node-style global
    global: 'window',
  },
});

