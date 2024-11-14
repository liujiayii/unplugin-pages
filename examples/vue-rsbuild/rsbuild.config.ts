import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import Pages from 'unplugin-convention-routes/rspack'
import {resolve} from 'path'

export default defineConfig({
  tools:{
    rspack:{
      plugins: [
        Pages({
          resolver: 'vue',
          dirs: [
            // issue #68
            { dir: resolve(__dirname, './src/pages'), baseRoute: '' },
            { dir: 'src/features/**/pages', baseRoute: 'features' },
            { dir: 'src/admin/pages', baseRoute: 'admin' },
          ],
          extensions: ['vue', 'jsx'],
          extendRoute(route: any) {
            if (route.name === 'about')
              route.props = (route: any) => ({ query: route.query.q })
    
            if (route.name === 'components') {
              return {
                ...route,
                beforeEnter: (route: any) => {
                  console.log(route)
                },
              }
            }
          },
        }),]
    }
  },
  plugins: [pluginVue()],
});
