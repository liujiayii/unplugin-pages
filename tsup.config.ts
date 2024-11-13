import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/*.ts'],
  format: [
    'cjs',
    'esm',
  ],
  dts: true,
  clean: true,
  sourcemap: false,
  splitting: true,
  onSuccess: 'npm run build:fix',
  ignoreWatch: ['examples'],
  external: ['unplugin', 'chokidar', '@antfu/utils', '@nuxt/schema', 'dequal', 'picocolors', '@nuxt/kit'],
})
