import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'hep.'

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* 隐私模式或存储配额不足时静默降级 */
  }
}

/** 收藏 / 标记：集合型本地状态 */
export function usePersistentSet(key: string) {
  const [items, setItems] = useState<string[]>(() => readJSON<string[]>(key, []))

  useEffect(() => {
    writeJSON(key, items)
  }, [key, items])

  const has = useCallback((id: string) => items.includes(id), [items])

  const toggle = useCallback((id: string) => {
    setItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const add = useCallback((id: string) => {
    setItems((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  return { items, setItems, has, toggle, add, remove, clear, size: items.length }
}

export function useTheme() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem(PREFIX + 'theme', dark ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
    const meta = document.querySelector('meta[name="theme-color"]:not([media])')
    if (meta) meta.setAttribute('content', dark ? '#0a1118' : '#f4f7f8')
  }, [dark])

  return { dark, toggle: useCallback(() => setDark((d) => !d), []) }
}
