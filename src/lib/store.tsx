import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { usePersistentSet } from './storage'

type SetApi = ReturnType<typeof usePersistentSet>

interface StoreValue {
  /** 收藏的指南 id */
  favorites: SetApi
  /** 标记的要点 id，格式 guid:sectionIndex:pointIndex */
  marks: SetApi
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const favorites = usePersistentSet('favorites')
  const marks = usePersistentSet('marks')
  const value = useMemo<StoreValue>(() => ({ favorites, marks }), [favorites, marks])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore 必须在 StoreProvider 内使用')
  return ctx
}

export function pointKey(guid: string, s: number, p: number) {
  return `${guid}:${s}:${p}`
}

export function parsePointKey(key: string): [string, number, number] | null {
  const parts = key.split(':')
  if (parts.length !== 3) return null
  const [g, s, p] = parts
  const si = Number(s)
  const pi = Number(p)
  if (!Number.isInteger(si) || !Number.isInteger(pi)) return null
  return [g, si, pi]
}
