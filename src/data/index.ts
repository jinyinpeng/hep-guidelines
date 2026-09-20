import { CARDIO } from './cardio'
import { DEPARTMENTS, DEPT_GROUPS, DEPT_MAP, deptsByGroup } from './departments'
import { ENDO } from './endo'
import { GI } from './gi'
import { CN_GUIDELINES } from './hepatology-cn'
import { INTL_GUIDELINES } from './hepatology-intl'
import { INFECTIOUS } from './infectious'
import { INTERNAL_2 } from './internal-2'
import { INTERNAL_3 } from './internal-3'
import { NEURO } from './neuro'
import { ONCOLOGY } from './oncology'
import { RENAL } from './renal'
import { RESP } from './resp'
import { RHEUM } from './rheum'
import { SPECIALTY } from './specialty'
import { SURGERY } from './surgery'
import { TOPIC_OF } from './topic-map'
import { topicOf, topicsOf } from './topics'
import type { DeptId, Guideline } from './types'
import { WOMEN_CHILD_CRITICAL } from './womenchild-critical'

const RAW: Guideline[] = [
  ...CN_GUIDELINES,
  ...INTL_GUIDELINES,
  ...CARDIO,
  ...RESP,
  ...GI,
  ...ENDO,
  ...NEURO,
  ...RENAL,
  ...RHEUM,
  ...INFECTIOUS,
  ...ONCOLOGY,
  ...INTERNAL_2,
  ...INTERNAL_3,
  ...SURGERY,
  ...WOMEN_CHILD_CRITICAL,
  ...SPECIALTY,
]

/**
 * 统一补齐病种归属。
 * 数据文件可以完全不写 `topic`，由 topic-map.ts 集中登记，
 * 未登记的指南自动落到该科室的「其他」分组。
 */
export const GUIDELINES: Guideline[] = RAW.map((g) => {
  if (g.topic) return g
  const fallback = topicsOf(g.dept).find((t) => t.id === 'other')?.id
  return { ...g, topic: TOPIC_OF[g.id] ?? fallback }
}).sort((a, b) => b.year - a.year || a.short.localeCompare(b.short, 'zh'))

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

/** 某科室下某个病种的指南数 */
export function countByTopic(dept: DeptId, topicId: string): number {
  return byDept(dept).filter((g) => g.topic === topicId).length
}

/** 某科室实际有收录的病种，顺序与 topics.ts 一致；空病种不展示 */
export function usedTopicsOf(dept: DeptId) {
  return topicsOf(dept).filter((t) => countByTopic(dept, t.id) > 0)
}

/** 科室病种概览（首页卡片用） */
export function topicNamesOf(dept: DeptId, limit = 0): string[] {
  const names = usedTopicsOf(dept).map((t) => t.short)
  return limit > 0 ? names.slice(0, limit) : names
}

/** 全库病种总数 */
export function topicCount(): number {
  return DEPARTMENTS.reduce((n, d) => n + usedTopicsOf(d.id).length, 0)
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
    const topic = topicOf(g.dept, g.topic)
    const hayTitle = norm(
      `${g.title} ${g.short} ${g.org} ${g.tags.join(' ')} ${dept?.name ?? ''} ${dept?.short ?? ''} ${
        topic?.name ?? ''
      } ${topic?.short ?? ''}`,
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
export type { Topic } from './topics'
export { TOPICS, topicsOf, topicOf } from './topics'
export { DEPARTMENTS, DEPT_GROUPS, DEPT_MAP, deptsByGroup }
