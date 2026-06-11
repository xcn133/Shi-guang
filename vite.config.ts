import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    host: '0.0.0.0',
    port: 5176,
    allowedHosts: [
      'anew-collector-unlawful.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok.io'
    ]
  }
})
