import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: './',
  server: {
    host: '0.0.0.0', // 允许使用本机 IP 访问
    port: 5173,      // 你可以改成自己想要的端口
    proxy: {
      '/app-api': {
        target: 'https://xdv5i7kq.com/app-api/',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/app-api/, ''),
      },
      '/renren-api': {
        target: 'https://xdv5i7kq.com/renren-api/',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/renren-api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
