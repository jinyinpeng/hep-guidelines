import { useEffect, useSyncExternalStore } from 'react'

/**
 * 「永远用最新版」的更新逻辑。
 *
 * 判断依据是构建产物本身：Vite 输出的入口 chunk 带内容哈希（index-xxxxxxxx.js），
 * 构建时同时产出一份 `version.json` 记录这个文件名。
 * 运行时用 `cache: 'no-store'` 拉一次 version.json，
 * 只要和本机正在运行的 chunk 名不一样，就说明线上已经是新版本 —— 直接重载。
 *
 * 这样不依赖 Service Worker 的版本号，也不需要服务端接口，
 * 纯静态托管（GitHub Pages / 任意静态空间）都能用。
 */

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'latest'
  | 'updating'
  /** 线上版本与本机不同，但为它重载过一次仍未生效（常见于 CDN 还没刷新） */
  | 'stale'
  | 'offline'
  | 'error'

export type UpdateResult = 'latest' | 'updated' | 'skipped' | 'offline' | 'error'

export interface UpdateState {
  status: UpdateStatus
  /** 本机正在运行的入口 chunk 名 */
  localId: string | null
  /** 线上最新版本的入口 chunk 名 */
  remoteId: string | null
  /** 线上版本的构建时间（ISO 字符串） */
  builtAt: string | null
  /** 最近一次检查完成的时间戳 */
  checkedAt: number | null
}

const VERSION_FILE = 'version.json'
const GUARD_KEY = 'hep.update.guard'
const STASH_KEY = 'hep.update.stash'
/** 同一次会话里为某个版本重载过就不再重载，避免反复刷新 */
const GUARD_TTL_MS = 10 * 60_000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** 从页面的 module script 标签反推正在运行的入口 chunk */
function readLocalBuild(): string | null {
  if (typeof document === 'undefined') return null
  const el = document.querySelector<HTMLScriptElement>('script[type="module"][src]')
  const file = (el?.getAttribute('src') ?? '').split('/').pop() ?? ''
  return /^index-[\w-]+\.js$/.test(file) ? file : null
}

let state: UpdateState = {
  status: 'idle',
  localId: readLocalBuild(),
  remoteId: null,
  builtAt: null,
  checkedAt: null,
}

const listeners = new Set<() => void>()

function setState(patch: Partial<UpdateState>) {
  state = { ...state, ...patch }
  for (const fn of listeners) fn()
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

const getSnapshot = () => state

/** 订阅更新状态（说明页用） */
export function useUpdateState(): UpdateState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/* ------------------------------ 存储小工具 ------------------------------ */

function readGuard(): string | null {
  try {
    const raw = sessionStorage.getItem(GUARD_KEY)
    if (!raw) return null
    const rec = JSON.parse(raw) as { build?: string; t?: number }
    if (!rec.build || typeof rec.t !== 'number') return null
    return Date.now() - rec.t > GUARD_TTL_MS ? null : rec.build
  } catch {
    return null
  }
}

function writeGuard(build: string) {
  try {
    sessionStorage.setItem(GUARD_KEY, JSON.stringify({ build, t: Date.now() }))
  } catch {
    /* 隐私模式下不可写，忽略即可 */
  }
}

function clearGuard() {
  try {
    sessionStorage.removeItem(GUARD_KEY)
  } catch {
    /* 同上 */
  }
}

/** 重载前记下滚动位置，重载后恢复（hash 路由由浏览器自己保留） */
function stashScroll() {
  try {
    sessionStorage.setItem(
      STASH_KEY,
      JSON.stringify({ hash: location.hash, y: window.scrollY, t: Date.now() }),
    )
  } catch {
    /* 同上 */
  }
}

interface ScrollStash {
  hash?: string
  y?: number
  t?: number
}

/** 应用启动时调用：如果刚才是因为自动更新才重载的，恢复原来的滚动位置 */
export function restoreAfterUpdate() {
  let rec: ScrollStash | null = null
  try {
    const raw = sessionStorage.getItem(STASH_KEY)
    sessionStorage.removeItem(STASH_KEY)
    if (!raw) return
    rec = JSON.parse(raw) as ScrollStash
  } catch {
    return
  }
  if (!rec || typeof rec.y !== 'number' || typeof rec.t !== 'number') return
  if (Date.now() - rec.t > 60_000) return
  if (rec.hash !== location.hash || rec.y <= 0) return
  const top = rec.y
  requestAnimationFrame(() => window.scrollTo({ top, behavior: 'auto' }))
}

/* ------------------------------ 检查更新 ------------------------------ */

/** 让 Service Worker 也去拉一次最新的 sw.js，保证新版本能接管缓存 */
async function refreshServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    await reg?.update()
  } catch {
    /* 更新失败不影响主流程 */
  }
}

/** 若已有等待中的新 Service Worker，让它立刻接管，避免用旧缓存重新加载 */
async function activateWaiting() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    if (!reg) return
    reg.waiting?.postMessage({ type: 'SKIP_WAITING' })
    const deadline = Date.now() + 1500
    while (Date.now() < deadline && (reg.installing || reg.waiting)) await sleep(100)
  } catch {
    /* 同上 */
  }
}

/**
 * 重载到最新版。
 * 带一个一次性查询参数，绕过 CDN / HTTP 缓存，否则刚发布的那几分钟
 * 拿到的还是旧 index.html，用户会以为「更新没用」。
 */
function reloadFresh() {
  try {
    const url = new URL(location.href)
    url.searchParams.set('t', String(Date.now()))
    location.replace(url.href)
  } catch {
    location.reload()
  }
}

async function fetchRemote(): Promise<{ build: string; built: string | null } | null> {
  try {
    const url = new URL(VERSION_FILE, location.href)
    url.searchParams.set('t', String(Date.now()))
    const res = await fetch(url.href, { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as { build?: unknown; built?: unknown }
    if (typeof data?.build !== 'string' || !data.build) return null
    return { build: data.build, built: typeof data.built === 'string' ? data.built : null }
  } catch {
    return null
  }
}

let inFlight: Promise<UpdateResult> | null = null

/**
 * 检查线上是否已有新版本。
 * 有 → 换上新 Service Worker 后重载页面（不会正常返回）；
 * 没有 → 返回 'latest'。并发调用会复用同一次检查。
 */
export function checkForUpdate(): Promise<UpdateResult> {
  if (!inFlight) {
    inFlight = doCheck().finally(() => {
      inFlight = null
    })
  }
  return inFlight
}

async function doCheck(): Promise<UpdateResult> {
  const localId = readLocalBuild()
  // 开发模式下入口是 /src/main.tsx，没有版本清单，直接跳过
  if (!localId) return 'skipped'

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    setState({ status: 'offline', localId })
    return 'offline'
  }

  setState({ status: 'checking', localId })
  void refreshServiceWorker()

  const remote = await fetchRemote()
  if (!remote) {
    setState({ status: 'error', localId, checkedAt: Date.now() })
    return 'error'
  }

  setState({
    status: remote.build === localId ? 'latest' : 'updating',
    localId,
    remoteId: remote.build,
    builtAt: remote.built,
    checkedAt: Date.now(),
  })

  if (remote.build === localId) {
    clearGuard()
    return 'latest'
  }

  // 已经为这个版本重载过一次，说明是缓存/CDN 还没跟上，不再重载以免循环
  if (readGuard() === remote.build) {
    setState({ status: 'stale' })
    return 'error'
  }

  writeGuard(remote.build)
  stashScroll()
  await activateWaiting()
  reloadFresh()
  return 'updated'
}

/* ------------------------------ 版本展示 ------------------------------ */

/** 本次构建时间（由 vite define 注入），离线也能用 */
export function buildTime(): string {
  return typeof __BUILD_TIME__ === 'string' ? __BUILD_TIME__ : ''
}

/** index-a1b2c3d4.js → a1b2c3d4，读起来更像版本号 */
export function shortBuild(id: string | null): string {
  if (!id) return '开发预览'
  return id.replace(/^index-/, '').replace(/\.js$/, '')
}

/** ISO 字符串 → '2026-09-21 07:51' */
function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function stamp(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`
}

export function formatBuildTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : stamp(d)
}

export function formatCheckedAt(ts: number | null): string {
  if (!ts) return '—'
  const d = new Date(ts)
  return Number.isNaN(d.getTime()) ? '—' : stamp(d)
}

export function statusText(u: UpdateState): string {
  switch (u.status) {
    case 'checking':
      return '正在检查…'
    case 'updating':
      return '发现新版本，正在更新…'
    case 'latest':
      return '已是最新版本'
    case 'stale':
      return '线上有新版本但还没生效，稍后可再试'
    case 'offline':
      return '当前离线，无法检查更新'
    case 'error':
      return '检查失败，请稍后再试'
    default:
      return u.localId ? '尚未检查' : '开发模式不检查版本'
  }
}

/* ------------------------------ 自动检查 ------------------------------ */

/** 回到前台后距上次检查不足这个间隔就跳过，避免频繁切后台时反复请求 */
const MIN_GAP_MS = 20_000
/** 长时间停留在前台时的兜底轮询 */
const POLL_MS = 5 * 60_000

/**
 * 应用启动即检查一次，之后在「切回前台 / 恢复联网 / 从 bfcache 恢复」时再检查。
 * 装在主屏的 PWA 常常是直接恢复上次的页面而不重新导航，
 * 只靠 Service Worker 不足以拿到新版本，所以这里主动比对版本清单。
 */
export function useAutoUpdate() {
  useEffect(() => {
    let last = 0

    const run = (force: boolean) => {
      if (document.visibilityState !== 'visible') return
      if (!force && Date.now() - last < MIN_GAP_MS) return
      last = Date.now()
      void checkForUpdate()
    }

    const onVisible = () => run(false)
    const timer = window.setInterval(() => run(false), POLL_MS)

    run(true)

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('online', onVisible)
    window.addEventListener('pageshow', onVisible)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('online', onVisible)
      window.removeEventListener('pageshow', onVisible)
    }
  }, [])
}
