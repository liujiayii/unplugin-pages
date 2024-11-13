// import type { ModuleNode, ViteDevServer } from 'vite'
import type { ImportMode, ResolvedOptions } from './types'
import { resolve, win32 } from 'node:path'
import { URLSearchParams } from 'node:url'
import { slash } from '@antfu/utils'
import Debug from 'debug'

import { cacheAllRouteRE, countSlashRE, dynamicRouteRE, nuxtCacheAllRouteRE, nuxtDynamicRouteRE, replaceDynamicRouteRE, replaceIndexRE } from './constants'

export const debug = {
  // hmr: Debug('unplugin-convention-routes:hmr'),
  routeBlock: Debug('unplugin-convention-routes:routeBlock'),
  options: Debug('unplugin-convention-routes:options'),
  pages: Debug('unplugin-convention-routes:pages'),
  search: Debug('unplugin-convention-routes:search'),
  env: Debug('unplugin-convention-routes:env'),
  cache: Debug('unplugin-convention-routes:cache'),
  resolver: Debug('unplugin-convention-routes:resolver'),
}

export function extsToGlob(extensions: string[]): string {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

export function countSlash(value: string): number {
  return (value.match(countSlashRE) || []).length
}

function isPagesDir(path: string, options: ResolvedOptions): boolean {
  for (const page of options.dirs) {
    const dirPath = slash(resolve(options.root, page.dir))
    // console.log(dirPath, 'dirPath', path)
    if (path.startsWith(dirPath))
      return true
  }
  return false
}

export function isTarget(path: string, options: ResolvedOptions): boolean {
  return isPagesDir(path, options) && options.extensionsRE.test(path)
}

export function isDynamicRoute(routePath: string, nuxtStyle = false): boolean {
  return nuxtStyle
    ? nuxtDynamicRouteRE.test(routePath)
    : dynamicRouteRE.test(routePath)
}

export function isCatchAllRoute(routePath: string, nuxtStyle = false): boolean {
  return nuxtStyle
    ? nuxtCacheAllRouteRE.test(routePath)
    : cacheAllRouteRE.test(routePath)
}

export function resolveImportMode(
  filepath: string,
  options: ResolvedOptions,
): ImportMode {
  const mode = options.importMode
  if (typeof mode === 'function')
    return mode(filepath, options)
  return mode
}

// export function invalidatePagesModule(server: ViteDevServer) {
//   const { moduleGraph } = server
//   const mods = moduleGraph.getModulesByFile(MODULE_ID_VIRTUAL)
//   if (mods) {
//     const seen = new Set<ModuleNode>()
//     mods.forEach((mod) => {
//       moduleGraph.invalidateModule(mod, seen)
//     })
//   }
// }

export function normalizeCase(str: string, caseSensitive: boolean): string {
  if (!caseSensitive)
    return str.toLocaleLowerCase()
  return str
}

export function normalizeName(name: string, isDynamic: boolean, nuxtStyle = false): string {
  if (!isDynamic)
    return name

  return nuxtStyle
    ? name.replace(nuxtDynamicRouteRE, '$1') || 'all'
    : name.replace(replaceDynamicRouteRE, '$1')
}

export function buildReactRoutePath(node: string, nuxtStyle = false): string | undefined {
  const isDynamic = isDynamicRoute(node, nuxtStyle)
  const isCatchAll = isCatchAllRoute(node, nuxtStyle)
  const normalizedName = normalizeName(node, isDynamic, nuxtStyle)

  if (isDynamic) {
    if (isCatchAll)
      return '*'

    return `:${normalizedName}`
  }

  return `${normalizedName}`
}

// https://github.dev/remix-run/remix/blob/264e3f8884c5cafd8d06acc3e01153b376745b7c/packages/remix-dev/config/routesConvention.ts#L105
export function buildReactRemixRoutePath(node: string): string | undefined {
  const escapeStart = '['
  const escapeEnd = ']'
  let result = ''
  let rawSegmentBuffer = ''

  let inEscapeSequence = 0
  let skipSegment = false
  for (let i = 0; i < node.length; i++) {
    const char = node.charAt(i)
    const lastChar = i > 0 ? node.charAt(i - 1) : undefined
    const nextChar = i < node.length - 1 ? node.charAt(i + 1) : undefined

    function isNewEscapeSequence(): boolean {
      return (
        !inEscapeSequence && char === escapeStart && lastChar !== escapeStart
      )
    }

    function isCloseEscapeSequence(): boolean | 0 {
      return inEscapeSequence && char === escapeEnd && nextChar !== escapeEnd
    }

    function isStartOfLayoutSegment(): boolean {
      return char === '_' && nextChar === '_' && !rawSegmentBuffer
    }

    if (skipSegment) {
      if (char === '/' || char === '.' || char === win32.sep)
        skipSegment = false

      continue
    }

    if (isNewEscapeSequence()) {
      inEscapeSequence++
      continue
    }

    if (isCloseEscapeSequence()) {
      inEscapeSequence--
      continue
    }

    if (inEscapeSequence) {
      result += char
      continue
    }

    if (char === '/' || char === win32.sep || char === '.') {
      if (rawSegmentBuffer === 'index' && result.endsWith('index'))
        result = result.replace(replaceIndexRE, '')
      else result += '/'

      rawSegmentBuffer = ''
      continue
    }

    if (isStartOfLayoutSegment()) {
      skipSegment = true
      continue
    }

    rawSegmentBuffer += char

    if (char === '$') {
      result += typeof nextChar === 'undefined' ? '*' : ':'
      continue
    }

    result += char
  }

  if (rawSegmentBuffer === 'index' && result.endsWith('index'))
    result = result.replace(replaceIndexRE, '')

  return result || undefined
}

export function parsePageRequest(id: string): {
  moduleId: string
  query: URLSearchParams
  pageId: string | null
} {
  const [moduleId, rawQuery] = id.split('?', 2)
  const query = new URLSearchParams(rawQuery)
  const pageId = query.get('id')
  return {
    moduleId,
    query,
    pageId,
  }
}
