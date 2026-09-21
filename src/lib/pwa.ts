import { useEffect, useState } from 'react'
import { dataAssetUrls } from '../data'

/**
 * 注册 Service Worker（仅生产构建）。
 * 注册完成后把首屏已加载的同源资源推送给 SW 预热缓存，
 * 这样「第一次访问结束」即可完全离线使用。
 *
 * 用 `updateViaCache: 'none'` 保证 sw.js 自己不做 HTTP 缓存，
 * 否则浏览器可能拿 10 分钟前的旧脚本，导致更新迟迟不生效。
 */
export function registerServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  if (!import.meta.env.PROD) return

  const start = async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', {
        scope: './',
        updateViaCache: 'none',
      })
      // 立刻检查一次 sw.js 是否有新版本
      void reg.update().catch(() => {})

      const ready = await navigator.serviceWorker.ready

      // 版本清单与 SW 自身不进缓存
      const skip = /(?:\/sw\.js|\/version\.json)$/
      const resources = performance
        .getEntriesByType('resource')
        .map((e) => e.name)
        .filter((u) => u.startsWith(location.origin) && !skip.test(u))

      // 指南数据分片由 fetch 取回，performance 里未必及时出现，
      // 这里显式加入，保证「首次访问结束」后连数据一起离线可用
      const urls = Array.from(
        new Set([...resources, ...dataAssetUrls(), location.origin + location.pathname]),
      )

      ready.active?.postMessage({ type: 'CACHE_URLS', urls })
    } catch {
      /* 离线能力注册失败不影响主流程 */
    }
  }

  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })
}

export function useOnline(): boolean {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  return online
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvt(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setEvt(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async () => {
    if (!evt) return false
    await evt.prompt()
    const choice = await evt.userChoice
    setEvt(null)
    return choice.outcome === 'accepted'
  }

  const dismiss = () => setEvt(null)

  return { canInstall: !!evt, installed, install, dismiss }
}

/** 是否以「添加到主屏幕」的独立应用方式运行 */
export function useStandalone(): boolean {
  const [standalone] = useState(() => {
    if (typeof window === 'undefined') return false
    const mq = window.matchMedia('(display-mode: standalone)').matches
    const ios = (window.navigator as unknown as { standalone?: boolean }).standalone === true
    return mq || ios
  })
  return standalone
}
