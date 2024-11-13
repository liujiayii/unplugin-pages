import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Markdown from 'vite-plugin-vue-markdown'
import Pages from '../../dist/vite.js'

const config = defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Pages({
      resolver: 'vue',
      dirs: [
        { dir: 'src/pages', baseRoute: '' },
        { dir: 'src/features/**/pages', baseRoute: 'features' },
        { dir: 'src/admin/pages', baseRoute: 'admin' },
      ],
      extensions: ['vue', 'md'],
      syncIndex: false,
      routeStyle: 'nuxt',
    }),
    Markdown(),
  ],
})

export default config
