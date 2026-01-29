declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vite' {
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
