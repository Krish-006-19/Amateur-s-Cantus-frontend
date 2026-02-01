/* global process */

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = String(env.VITE_API_URL || 'https://amateur-s-cantus-backend-1.onrender.com').replace(/\/$/, '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: true,
        },
        '/upload': {
          target,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
