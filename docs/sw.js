/* eslint-env serviceworker */
/**
 * 离线优先的 Service Worker
 * 策略：
 *  - 导航请求：网络优先（绕过 HTTP 缓存），失败回退缓存的 index.html
 *  - 静态资源：缓存优先，首次成功后写入缓存（文件名带内容哈希，所以缓存不会过期）
 *  - version.json / index.html / sw.js 永不缓存，保证「检查更新」拿到的一定是线上最新版
 *  - 支持主线程把首屏已加载的资源列表推送进来做「预热缓存」
 */
const VERSION = 'v2'
const CACHE = `hep-guidelines-${VERSION}`
const APP_SHELL = ['./', './index.html', './manifest.json', './icon.svg', './icon-maskable.svg']

/** 这些文件必须每次都走网络，否则用户会卡在旧版本 */
const NEVER_CACHE = /(?:^|\/)(?:sw\.js|index\.html|version\.json)$/

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      await Promise.all(
        APP_SHELL.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }))
          } catch (e) {
            /* 单个资源失败不影响整体安装 */
          }
        }),
      )
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.disable()
        } catch (e) {}
      }
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event) => {
  const data = event.data
  if (!data) return

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting()
    return
  }

  if (data.type === 'CACHE_URLS' && Array.isArray(data.urls)) {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE)
        await Promise.all(
          data.urls
            .filter((url) => !NEVER_CACHE.test(new URL(url, self.location.href).pathname))
            .map(async (url) => {
              try {
                const req = new Request(url, { cache: 'reload' })
                const hit = await cache.match(req)
                if (hit) return
                const res = await fetch(req)
                if (res && res.ok) await cache.put(req, res.clone())
              } catch (e) {}
            }),
        )
        const clients = await self.clients.matchAll()
        clients.forEach((c) => c.postMessage({ type: 'PRECACHE_DONE' }))
      })(),
    )
  }
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  // 更新相关的入口文件一律交给浏览器直连网络，不缓存、不拦截
  if (NEVER_CACHE.test(url.pathname)) return

  // 页面导航
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // cache: 'reload' 绕过 HTTP 缓存，确保拿到最新一版 index.html
          const fresh = await fetch(new Request(req, { cache: 'reload' }))
          const cache = await caches.open(CACHE)
          cache.put('./index.html', fresh.clone())
          return fresh
        } catch (e) {
          const cache = await caches.open(CACHE)
          return (
            (await cache.match('./index.html')) ||
            (await cache.match('./')) ||
            new Response('<h1>离线中</h1>', {
              status: 200,
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            })
          )
        }
      })(),
    )
    return
  }

  // 其余同源资源
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)
      const cached = await cache.match(req)
      if (cached) return cached
      try {
        const fresh = await fetch(req)
        if (fresh && fresh.ok && fresh.type === 'basic') {
          cache.put(req, fresh.clone())
        }
        return fresh
      } catch (e) {
        return new Response('', { status: 504, statusText: 'Offline' })
      }
    })(),
  )
})
