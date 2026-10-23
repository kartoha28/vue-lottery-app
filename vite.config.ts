import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/vue-lottery-app/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name.replace(/^_+/, '')
          return `assets/${name}-[hash].js`
        },
        assetFileNames: (assetInfo) => {
          const rawName = assetInfo.name || 'asset'
          const name = rawName.replace(/^_+/, '')
          return `assets/${name}-[hash][extname]`
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'color-functions',
          'global-builtin',
          'import',
          'if-function',
        ],
      },
    },
  },
})
