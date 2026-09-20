import { useSyncExternalStore } from 'react'

/**
 * 全局内容模式：
 *   guide    —— 指南与共识要点（默认）
 *   research —— 各科室顶刊最新临床研究发现
 *
 * 用极简的外部 store 实现，不依赖 Provider，任何组件都能直接读写；
 * 选择结果写入 localStorage，下次打开保持同一视图。
 */
export type Mode = 'guide' | 'research'

const KEY = 'hep.mode'

function read(): Mode {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'research' ? 'research' : 'guide'
  } catch {
    return 'guide'
  }
}

let mode: Mode = typeof localStorage === 'undefined' ? 'guide' : read()
const listeners = new Set<() => void>()

function emit() {
  for (const fn of listeners) fn()
}

export function getMode(): Mode {
  return mode
}

export function setMode(next: Mode) {
  if (next === mode) return
  mode = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* 隐私模式下静默降级 */
  }
  emit()
}

/** 一键切换：指南 ⇄ 研究 */
export function toggleMode() {
  setMode(mode === 'guide' ? 'research' : 'guide')
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useMode(): Mode {
  return useSyncExternalStore(subscribe, getMode, () => 'guide' as Mode)
}

export const MODE_LABEL: Record<Mode, string> = {
  guide: '指南共识',
  research: '前沿研究',
}
