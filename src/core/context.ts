// import type { ViteDevServer } from 'vite'
import type { PageOptions, ResolvedOptions, UserOptions } from './types'
import { existsSync, writeFileSync } from 'node:fs'

import path, { join, resolve } from 'node:path'
import process from 'node:process'

import { slash, toArray } from '@antfu/utils'
import chokidar, { type FSWatcher } from 'chokidar'
import { getPageFiles } from './files'
import { initVirtualPackage } from './initVirualPackage'
import { resolveOptions } from './options'
import { debug, isTarget } from './utils'
// 定义要监听的目录
const directoryToWatch = 'src/pages'

export interface PageRoute {
  path: string
  route: string
}

export class PageContext {
  // private _server: ViteDevServer | undefined
  private _pageRouteMap = new Map<string, PageRoute>()

  rawOptions: UserOptions
  root: string
  options: ResolvedOptions

  // 创建一个 Chokidar 观察者
  watcher?: FSWatcher

  constructor(userOptions: UserOptions, projectRoot: string = process.cwd()) {
    this.rawOptions = userOptions
    this.root = slash(projectRoot)
    debug.env('root', this.root)
    this.options = resolveOptions(userOptions, this.root)
    debug.options(this.options)
    if (this.rawOptions.watcher) {
      this.watcher = chokidar.watch(directoryToWatch, {
        ignored: /(^|[/\\])\../, // 忽略隐藏文件
        persistent: true, // 持续监视
        ignoreInitial: true, // 忽略初始扫描
      })
      this.setupWatcher(this.watcher)
    }
    this.searchGlob().then(() => {
      this.writeFile()
    })
  }

  // setupViteServer(server: ViteDevServer) {
  //   if (this._server === server)
  //     return

  //   this._server = server
  //   this.setupWatcher(server.watcher)
  // }

  setupWatcher(watcher: FSWatcher): void {
    // console.log('setupWatcher')
    watcher
      .on('unlink', async (path) => {
      //  console.log('unlink', path)
        path = `${process.cwd()}\\${path}`
        path = slash(path)
        //  console.log('isTarget', isTarget(path, this.options))
        if (!isTarget(path, this.options))
          return
        await this.removePage(path)
        this.onUpdate()
      })
    watcher
      .on('add', async (path) => {
        // console.log('add', path)
        path = `${process.cwd()}\\${path}`
        path = slash(path)
        if (!isTarget(path, this.options))
          return
        const page = this.options.dirs.find(i => path.startsWith(slash(resolve(this.root, i.dir))))!
        await this.addPage(path, page)
        this.onUpdate()
      })

    // watcher
    //   .on('change', async (path) => {
    //  console.log('change', path)
    // path = `${process.cwd()}\\${path}`
    // path = slash(path)
    // if (!isTarget(path, this.options))
    //  return
    // const page = this._pageRouteMap.get(path)
    // if (page)
    //   await this.options.resolver.hmr?.changed?.(this, path)
    // })
  }

  async addPage(path: string | string[], pageDir: PageOptions): Promise<void> {
    // debug.pages('add', path)
    for (const p of toArray(path)) {
      const pageDirPath = slash(resolve(this.root, pageDir.dir))
      const extension = this.options.extensions!.find(ext => p.endsWith(`.${ext}`))
      if (!extension)
        continue

      const route = slash(join(pageDir.baseRoute, p.replace(`${pageDirPath}/`, '').replace(`.${extension}`, '')))
      this._pageRouteMap.set(p, {
        path: p,
        route,
      })
      //  console.log('addPage', this._pageRouteMap)
    //  await this.options.resolver.hmr?.added?.(this, p)
    }
  }

  async removePage(path: string): Promise<void> {
    debug.pages('remove', path)
    this._pageRouteMap.delete(path)
    // await this.options.resolver.hmr?.removed?.(this, path)
  }

  onUpdate(): void {
    this.writeFile()
    // if (!this._server)
    //   return

    // invalidatePagesModule(this._server)
    // debug.hmr('Reload generated pages.')
    // this._server.ws.send({
    //   type: 'full-reload',
    // })
  }

  async writeFile(): Promise<void> {
    const fullPath = path.join(process.cwd(), 'node_modules', '~unplugin-convention-routes')
    // console.log('writeFile', fullPath, existsSync(fullPath))
    if (!existsSync(fullPath)) {
      //   console.log('create dir', fullPath)
      initVirtualPackage()
      // mkdirSync(fullPath, { recursive: true })
    }
    const result = await this.resolveRoutes()
    const resolver = this.rawOptions.resolver
    writeFileSync(path.join(fullPath, `${resolver}.js`), result)
  }

  async resolveRoutes(): Promise<any> {
    return this.options.resolver.resolveRoutes(this)
  }

  async searchGlob(): Promise<void> {
    const pageDirFiles = this.options.dirs.map((page) => {
      const pagesDirPath = slash(resolve(this.options.root, page.dir))
      const files = getPageFiles(pagesDirPath, this.options, page)
      debug.search(page.dir, files)
      return {
        ...page,
        files: files.map(file => slash(file)),
      }
    })

    for (const page of pageDirFiles)
      await this.addPage(page.files, page)

    debug.cache(this.pageRouteMap)
  }

  get debug(): any {
    return debug
  }

  get pageRouteMap(): any {
    return this._pageRouteMap
  }
}
