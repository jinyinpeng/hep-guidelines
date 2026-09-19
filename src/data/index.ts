import { DEPARTMENTS, DEPT_GROUPS, DEPT_MAP, deptsByGroup } from './departments'
import { CN_GUIDELINES } from './hepatology-cn'
import { INTL_GUIDELINES } from './hepatology-intl'
import { INTERNAL_1 } from './internal-1'
import { INTERNAL_2 } from './internal-2'
import { INTERNAL_3 } from './internal-3'
import { SPECIALTY } from './specialty'
import { SURGERY } from './surgery'
import type { DeptId, Guideline } from './types'
import { WOMEN_CHILD_CRITICAL } from './womenchild-critical'

export const GUIDELINES: Guideline[] = [
  ...CN_GUIDELINES,
  ...INTL_GUIDELINES,
  ...INTERNAL_1,
  ...INTERNAL_2,
  ...INTERNAL_3,
  ...SURGERY,
  ...WOMEN_CHILD_CRITICAL,
  ...SPECIALTY,
].sort((a, b) => b.year - a.year || a.short.localeCompare(b.short, 'zh'))

export const GUIDELINE_MAP = new Map(GUIDELINES.map((g) => [g.id, g]))

export function getGuideline(id: string): Guideline | undefined {
  return GUIDELINE_MAP.get(id)
}

export function byDept(dept: DeptId): Guideline[] {
  return GUIDELINES.filter((g) => g.dept === dept)
}

export function countByDept(dept: DeptId): number {
  return byDept(dept).length
}

/** 科室下指南的最新版次年，用于卡片展示 */
export function latestYearOf(dept: DeptId): number {
  return byDept(dept).reduce((y, g) => Math.max(y, g.year), 0)
}

export function pointCount(dept?: DeptId): number {
  const pool = dept ? byDept(dept) : GUIDELINES
  return pool.reduce((n, g) => n + g.sections.reduce((m, s) => m + s.points.length, 0), 0)
}

export interface Stats {
  total: number
  cn: number
  intl: number
  points: number
  latest: number
  year: number
  depts: number
  covered: number
}

export const STATS: Stats = (() => {
  let points = 0
  let latest = 0
  let year = 0
  const seen = new Set<DeptId>()
  for (const g of GUIDELINES) {
    points += g.sections.reduce((n, s) => n + s.points.length, 0)
    if (g.latest) latest++
    if (g.year > year) year = g.year
    seen.add(g.dept)
  }
  return {
    total: GUIDELINES.length,
    cn: GUIDELINES.filter((g) => g.region === 'cn').length,
    intl: GUIDELINES.filter((g) => g.region === 'intl').length,
    points,
    latest,
    year,
    depts: DEPARTMENTS.length,
    covered: seen.size,
  }
})()

/* ----------------------------- 检索 ----------------------------- */

export interface Hit {
  guideline: Guideline
  score: number
  /** 命中的要点（最多 3 条） */
  matches: { text: string; section: string }[]
}

function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '')
}

/**
 * 轻量全文检索：科室名/标题/机构/标签权重最高，要点正文次之。
 * 支持空格分隔的多关键词，所有关键词均需在某处命中。
 */
export function search(query: string, pool: Guideline[] = GUIDELINES): Hit[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []

  const hits: Hit[] = []

  for (const g of pool) {
    const dept = DEPT_MAP[g.dept]
    const hayTitle = norm(
      `${g.title} ${g.short} ${g.org} ${g.tags.join(' ')} ${dept?.name ?? ''} ${dept?.short ?? ''}`,
    )
    const haySummary = norm(g.summary)
    const hayYear = String(g.year)

    let score = 0
    const matches: { text: string; section: string }[] = []

    for (const term of terms) {
      const t = norm(term)
      let found = false

      if (hayTitle.includes(t)) {
        score += 12
        found = true
      } else if (haySummary.includes(t)) {
        score += 5
        found = true
      } else if (hayYear.includes(t)) {
        score += 2
        found = true
      }

      for (const s of g.sections) {
        for (const p of s.points) {
          if (norm(p.t).includes(t)) {
            if (!found) score += p.key ? 5 : 2
            found = true
            if (matches.length < 3 && !matches.some((m) => m.text === p.t)) {
              matches.push({ text: p.t, section: s.title })
            }
          }
        }
      }

      if (!found) {
        // 有任一关键词完全未命中 → 该指南不计入结果
        score = -1
        break
      }
    }

    if (score < 0) continue
    hits.push({ guideline: g, score, matches })
  }

  return hits.sort((a, b) => b.score - a.score || b.guideline.year - a.guideline.year)
}

export type { Guideline, Point, DeptId } from './types'
export { DISEASES, DISEASE_MAP } from './diseases'
export { DEPARTMENTS, DEPT_GROUPS, DEPT_MAP, deptsByGroup }
