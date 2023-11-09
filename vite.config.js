import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

// api 自动引入
import AutoImport from 'unplugin-auto-import/vite'

// elementplus 自动导入
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

function resolve(...paths) {
  return path.resolve(__dirname, ...paths)
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': resolve('src') + '/'
    }
  },
  server: {
    port: 8899
  },
  sourcemap: true,
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue']
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    ElementPlus()
  ],
})
