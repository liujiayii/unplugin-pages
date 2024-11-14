import type { UnpluginFactory } from 'unplugin'
import type { Options, UserOptions } from './core/types'

import path from 'node:path'

import process from 'node:process'
import { createUnplugin } from 'unplugin'
import { PageContext } from './core/context'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (userOptions: UserOptions = {
  resolver: 'vue',
}) => {
  const ctx: PageContext = new PageContext(userOptions)
  //  ctx.setLogger(config.logger)
  return ({
    name: 'unplugin-convention-routes',
    buildEnd() {
      ctx.watcher?.close()
    },
    resolveId(id) {
      //  console.log('resolveId', id)
      if (['~unplugin-convention-routes/react', '~unplugin-convention-routes/vue', '~unplugin-convention-routes/solid'].includes(id)) {
        return path.resolve(process.cwd(), 'node_modules', '~unplugin-convention-routes', `${id.split('/')[1]}.js`)
      }
      return null
    },
  })
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
