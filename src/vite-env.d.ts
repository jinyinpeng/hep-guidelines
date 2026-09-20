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

/** 由 vite.config.ts 的 define 注入：本次构建的时间（ISO 字符串） */
declare const __BUILD_TIME__: string
