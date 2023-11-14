import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

// api 自动引入
import AutoImport from 'unplugin-auto-import/vite'

// elementplus 自动导入
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import ElementPlus from 'unplugin-element-plus/vite'

// import { visualizer } from 'rollup-plugin-visualizer'

import pkg from './package.json'

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
  build: {
    lib: {
      entry: resolve('src', 'lf-bpmn', 'index.js'),
      name: pkg.name,
      fileName: pkg.name
    },
    rollupOptions: {
      external: ['vue', 'element-plus', '@logicflow/core', '@logicflow/extension'],
      output: {
        exports: 'named',
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          '@logicflow/core': 'LogicFlow',
          '@logicflow/extension': 'LogicFlowExtension'
        }
      }
    }
  },
  sourcemap: false,
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue']
    })
    // Components({
    //   resolvers: [ElementPlusResolver()]
    // }),
    // ElementPlus(),
    // visualizer({
    //   emitFile: true,
    //   open: true,
    //   filename: 'bundle-size-visualizer.html'
    // })
  ]
})
