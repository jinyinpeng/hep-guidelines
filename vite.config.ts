import { readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * 构建时产出版本清单 `version.json`：
 *   { "build": "index-a1b2c3d4.js", "built": "2026-09-20T10:15:30.000Z" }
 *
 * `build` 就是入口 chunk 的文件名，而 Vite 的文件名带内容哈希，
 * 所以「文件名字不同 = 内容不同 = 有新版本」。
 * 运行时会用 `cache: 'no-store'` 拉这个文件，和正在跑的 chunk 名对比，
 * 不一致就说明线上已经更新，直接重载到最新版。
 */
function buildVersion(): Plugin {
  return {
    name: 'hep-build-version',
    apply: 'build',
    writeBundle(options) {
      const outDir = options.dir ?? 'dist'
      let build = ''
      try {
        build =
          readdirSync(join(outDir, 'assets'))
            .filter((f) => f.startsWith('index-') && f.endsWith('.js'))
            .sort()
            .pop() ?? ''
      } catch {
        /* 极端情况下读不到产物也不应让构建失败 */
      }
      writeFileSync(
        join(outDir, 'version.json'),
        `${JSON.stringify({ build, built: new Date().toISOString() }, null, 0)}\n`,
      )
    },
  }
}

export default defineConfig({
  base: './',
  // 把构建时间注入到前端：即使在离线状态、还没做过版本检查，底部也能显示版本信息
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [react(), tailwindcss(), buildVersion()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1200,
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
})
