/**
 * 自行声明 Vite 注入的 import.meta.env，
 * 避免依赖 vite/client 类型解析（不同主版本下的声明位置有差异）。
 */
interface ImportMetaEnv {
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
