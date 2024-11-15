<p align="center">
  <a href="https://www.npmjs.org/package/unplugin-convention-routes">
    <img src="https://img.shields.io/npm/v/unplugin-convention-routes.svg">
  </a>
  <a href="https://npmcharts.com/compare/unplugin-convention-routes?minimal=true">
    <img src="https://img.shields.io/npm/dm/@unplugin-convention-routes.svg">
  </a>
  <br>
</p>

<p align="center">unplugin-convention-routes</p>

- 🔥 基于文件系统的约定式路由解决方案。
- 🔥 基于`unplugin`对`vite-plugin-pages`进行了移植，能同时支持`vite`、`webpack`、`rsbuild`、`farm`等构建框架，并同时支持`react`、`vue`、`solid`三大框架。
- ⚠️ 尚在开发中，可能有的框架无法正常使用，个人测试了`vue`+`vite`、`vue`+`rsbuild`、`react`+`vite`、`react`+`rsbuild`可用。

## 已知问题
- 新增路由无法热更，需要手动重启项目（可能是vite对js文件请求进行了缓存？）
- 配置文件可能有ts错误提示（比较影响体验，需要优先解决）
- 测试用例无法通过（影响GitHub观感，影响renovate automerge）

---

## 📦 安装 & 使用

```bash
pnpm i unplugin-convention-routes
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Routes from 'unplugin-convention-routes/vite'

export default defineConfig({
  plugins: [
    Routes({ /* options */ }),
  ],
})
```
</details>
<details>
<summary>Rsbuild</summary><br>

```ts
// rsbuild.config.ts
import Routes from 'unplugin-convention-routes/rspack'

export default defineConfig({
  tools: {
    rspack: {
      plugins: [
        Pages({ /* options */ }),
      ],
    },
  },
})
```
</details>
<details>
<summary>React</summary><br>

```ts
// env.d.ts
/// <reference types="unplugin-convention-routes/client-react.d.ts" />
```
```tsx
import routes from '~unplugin-convention-routes/react'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  useRoutes,
} from 'react-router-dom'

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {useRoutes(routes)}
    </Suspense>
  )
}

const app = createRoot(document.getElementById('root')!)

app.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```
</details>
<details>
<summary>Vue</summary><br/>

```ts
// env.d.ts
/// <reference types="unplugin-convention-routes/client-vue.d.ts" />
```
```ts
import routes from '~unplugin-convention-routes/vue'
import { createRouter } from 'vue-router'

const router = createRouter({
  // ...
  routes,
})
```
</details>

## 🔨 示例项目
- https://github.com/liujiayii/unplugin-convention-routes/tree/main/examples

## 友情链接

- [unplugin](https://github.com/unjs/unplugin)
- [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)
