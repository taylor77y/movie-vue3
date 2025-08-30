import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
       visualizer({
      filename: './dist/stats.html', // 打包报告输出路径
      open: true,                     // 打包完成自动打开
      gzipSize: true,                 // 显示 gzip 压缩体积
      brotliSize: true,               // 显示 brotli 压缩体积
    })
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
  build: {
    sourcemap: true, // 开启 sourcemap 更容易分析
  }

})
