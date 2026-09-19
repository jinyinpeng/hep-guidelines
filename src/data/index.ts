import { CN_GUIDELINES } from './cn'
import { INTL_GUIDELINES } from './intl'
import type { DiseaseId, Guideline, Point } from './types'

export const GUIDELINES: Guideline[] = [...CN_GUIDELINES, ...INTL_GUIDELINES].sort(
  (a, b) => b.year - a.year || a.short.localeCompare(b.short, 'zh'),
)

export const GUIDELINE_MAP = new Map(GUIDELINES.map((g) => [g.id, g]))

export function getGuideline(id: string): Guideline | undefined {
  return GUIDELINE_MAP.get(id)
}

export interface Stats {
  total: number
  cn: number
  intl: number
  points: number
  latest: number
  year: number
}

export const STATS: Stats = (() => {
  let points = 0
  let latest = 0
  let year = 0
  for (const g of GUIDELINES) {
    points += g.sections.reduce((n, s) => n + s.points.length, 0)
    if (g.latest) latest++
    if (g.year > year) year = g.year
  }
  return {
    total: GUIDELINES.length,
    cn: GUIDELINES.filter((g) => g.region === 'cn').length,
    intl: GUIDELINES.filter((g) => g.region === 'intl').length,
    points,
    latest,
    year,
  }
})()

export function countByDisease(id: DiseaseId): number {
  return GUIDELINES.filter((g) => g.disease === id).length
}

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
 * 轻量全文检索：标题/机构/标签权重最高，要点正文次之。
 * 支持空格分隔的多关键词，所有关键词均需在某处命中。
 */
export function search(query: string, pool: Guideline[] = GUIDELINES): Hit[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []

  const hits: Hit[] = []

  for (const g of pool) {
    const hayTitle = norm(`${g.title} ${g.short} ${g.org} ${g.tags.join(' ')}`)
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

export type { Guideline, Point, DiseaseId }
export { DISEASES, DISEASE_MAP } from './diseases'
