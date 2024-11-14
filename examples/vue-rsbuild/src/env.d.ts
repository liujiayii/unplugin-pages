/// <reference types="@rsbuild/core/types" />
/// <reference types="unplugin-convention-routes/client-vue.d.ts" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // biome-ignore lint/complexity/noBannedTypes: reason
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
