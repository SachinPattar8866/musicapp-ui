import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    svgr({ exportAsDefault: false }), // must come BEFORE react()
    react(),
  ],
});
