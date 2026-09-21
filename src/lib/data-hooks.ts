import { useEffect, useSyncExternalStore } from 'react'
import { allDeptsLoaded, dataVersion, isDeptLoaded, loadDept, subscribeData } from '../data'
import type { DeptId } from '../data'

/**
 * 数据分片是「分两步到手」的：
 *   1. 卡片索引（首屏）——列表、筛选、卡片信息立刻可用；
 *   2. 各科室正文（详情页按需 + 后台补齐）——要点正文与全文检索命中依赖它。
 *
 * 因此凡是会受到「正文补齐」影响的页面，都要订阅数据版本，
 * 数据到位后自动重渲染（检索结果、标记要点等）。
 */
export function useDataVersion(): number {
  return useSyncExternalStore(subscribeData, dataVersion, dataVersion)
}

/** 全库正文是否已补齐（用于提示「全文结果仍在载入」） */
export function useAllDeptsLoaded(): boolean {
  useDataVersion()
  return allDeptsLoaded()
}

/**
 * 确保某科室正文已加载，并返回是否就绪。
 * 详情页与「标记的要点」用它做占位与自动补全。
 */
export function useDeptSections(dept?: DeptId): boolean {
  const ready = dept ? isDeptLoaded(dept) : true
  useDataVersion()

  useEffect(() => {
    if (dept && !isDeptLoaded(dept)) void loadDept(dept)
  }, [dept])

  return ready
}

/** 批量确保若干科室正文已加载（收藏页：收藏与标记可能跨科室） */
export function useDeptsSections(depts: DeptId[]): void {
  const key = depts.join(',')
  useDataVersion()

  useEffect(() => {
    for (const dept of depts) {
      if (!isDeptLoaded(dept)) void loadDept(dept)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
