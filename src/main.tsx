import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initData } from './data'
import { registerServiceWorker } from './lib/pwa'

const container = document.getElementById('root')

/**
 * 指南数据不在 JS 包里，而是构建期生成的静态分片：
 * 先取回卡片索引（列表立刻可用），各科室要点正文随后在后台补齐。
 */
if (container) {
  const root = createRoot(container)

  root.render(
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-6">
      <p className="text-[14px] text-ink-3">正在载入指南数据…</p>
    </div>,
  )

  initData()
    .then(() => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      )
    })
    .catch((error: unknown) => {
      console.error(error)
      root.render(
        <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-canvas px-6 text-center">
          <p className="text-[15px] font-medium text-ink">指南数据加载失败</p>
          <p className="text-[13.5px] leading-[1.7] text-ink-3">
            请检查网络连接后重试；已安装到主屏幕的设备可断开网络再打开一次（首次需联网完成缓存）。
          </p>
          <button
            type="button"
            onClick={() => location.reload()}
            className="cursor-pointer rounded-xl bg-brand px-4 py-2 text-[15px] font-medium text-white"
          >
            重新载入
          </button>
        </div>,
      )
    })
}

registerServiceWorker()
