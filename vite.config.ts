import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/taxfirm/',
  appType: 'spa',
  define: {
    'process.env.API_KEY': JSON.stringify((process as any).env.API_KEY || "")
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});