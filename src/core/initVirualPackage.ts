import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

export function initVirtualPackage(): void {
  copyFile('node_modules/unplugin-convention-routes/virtual-package', 'node_modules/~unplugin-convention-routes')
}

/**
 *
 * @param {string} copiedPath (被复制文件的地址，相对地址)
 * @param {string} resultPath (放置复制文件的地址，相对地址)
 */
function copyFile(copiedPath: string, resultPath: string): void {
  const _copiedPath = path.join(process.cwd(), copiedPath)
  const _resultPath = path.join(process.cwd(), resultPath)
  fs.cpSync(_copiedPath, _resultPath, { recursive: true })
}
