import type { DeptId } from '../types'
import { CRITICAL_FINDINGS } from './critical'
import { INTERNAL_FINDINGS } from './internal'
import { TIER_LABEL, TIER_RANK, journalMeta, journalTier } from './journals'
import { SPECIALTY_FINDINGS } from './specialty'
import { SURGERY_FINDINGS } from './surgery'
import type { Finding, ImpactLevel, JournalTier } from './types'
import { WOMEN_CHILD_FINDINGS } from './women-child'

const RAW: Finding[] = [
  ...INTERNAL_FINDINGS,
  ...SURGERY_FINDINGS,
  ...WOMEN_CHILD_FINDINGS,
  ...CRITICAL_FINDINGS,
  ...SPECIALTY_FINDINGS,
]

/** 'YYYY-MM' → 可比较的月序号 */
export function dateNum(date: string): number {
  const m = date.match(/^(\d{4})-(\d{2})$/)
  if (!m) return 0
  return Number(m[1]) * 12 + (Number(m[2]) - 1)
}

export const FINDINGS: Finding[] = [...RAW].sort(
  (a, b) =>
    dateNum(b.date) - dateNum(a.date) ||
    TIER_RANK[journalTier(a.journal)] - TIER_RANK[journalTier(b.journal)] ||
    a.journal.localeCompare(b.journal),
)

export const FINDING_MAP = new Map(FINDINGS.map((f) => [f.id, f]))

export function getFinding(id: string): Finding | undefined {
  return FINDING_MAP.get(id)
}

/** 条目的期刊层级（由 journals.ts 统一决定） */
export function tierOf(f: Finding): JournalTier {
  return journalTier(f.journal)
}

export function fieldOf(f: Finding): string {
  return journalMeta(f.journal).field
}

/* ----------------------------- 时间窗口 ----------------------------- */

/** 数据中最新一条研究的月份，作为「近一年」的计算基准 */
export const DATA_CUTOFF = FINDINGS[0]?.date ?? '2026-09'

/** 「近一年」默认窗口的月份数（含当月，共 12 个月） */
export const WINDOW_MONTHS = 12

const CUTOFF_NUM = dateNum(DATA_CUTOFF)

/** 是否落在以最新数据为基准的最近 N 个月内 */
export function withinMonths(f: Finding, months = WINDOW_MONTHS): boolean {
  return dateNum(f.date) > CUTOFF_NUM - months
}

export interface WindowOption {
  id: string
  label: string
  months: number
}

export const WINDOWS: WindowOption[] = [
  { id: 'm12', label: '近一年', months: 12 },
  { id: 'm24', label: '近两年', months: 24 },
  { id: 'm36', label: '近三年', months: 36 },
  { id: 'all', label: '全部', months: 0 },
]

/* ----------------------------- 维度定义 ----------------------------- */

export const IMPACT_LEVELS: { id: ImpactLevel; label: string; desc: string }[] = [
  { id: 'practice', label: '可能改变实践', desc: '阳性结果、硬终点、样本量足够，指南很可能据此更新' },
  { id: 'promising', label: '有前景待验证', desc: '早期或单臂、替代终点，或需要更长随访' },
  { id: 'exploratory', label: '探索性', desc: '机制/Ⅱ 期信号，暂不改变当前做法' },
]

export const LEVEL_LABEL: Record<ImpactLevel, string> = {
  practice: '可能改变实践',
  promising: '有前景待验证',
  exploratory: '探索性',
}

/** 期刊层级筛选项 */
export const TIERS: { id: JournalTier; label: string }[] = [
  { id: 'top', label: TIER_LABEL.top },
  { id: 'field', label: TIER_LABEL.field },
  { id: 'major', label: TIER_LABEL.major },
]

/* ----------------------------- 查询 ----------------------------- */

export function findingsByDept(dept: DeptId): Finding[] {
  return FINDINGS.filter((f) => f.dept === dept)
}

export function countFindingsByDept(dept: DeptId): number {
  return findingsByDept(dept).length
}

export function findingsByTopic(dept: DeptId, topic: string): Finding[] {
  return findingsByDept(dept).filter((f) => f.topic === topic)
}

export function countFindingsByTopic(dept: DeptId, topic: string): number {
  return findingsByTopic(dept, topic).length
}

/** 某科室实际有研究收录的病种 id，顺序与 topics.ts 一致 */
export function researchTopicIds(dept: DeptId): string[] {
  const seen: string[] = []
  for (const f of findingsByDept(dept)) {
    if (f.topic && !seen.includes(f.topic)) seen.push(f.topic)
  }
  return seen
}

export function latestFindingDateOf(dept: DeptId): string {
  return findingsByDept(dept)[0]?.date ?? ''
}

export interface JournalStat {
  journal: string
  count: number
  tier: JournalTier
  field: string
}

/** 期刊条目统计，按「综合顶刊 → 本领域顶刊 → 权威期刊」再按条目数排序 */
export function journalStats(pool: Finding[] = FINDINGS): JournalStat[] {
  const map = new Map<string, number>()
  for (const f of pool) map.set(f.journal, (map.get(f.journal) ?? 0) + 1)
  return [...map]
    .map(([journal, count]) => ({ journal, count, ...journalMeta(journal) }))
    .sort(
      (a, b) =>
        TIER_RANK[a.tier] - TIER_RANK[b.tier] ||
        b.count - a.count ||
        a.journal.localeCompare(b.journal),
    )
}

/** 某科室涉及的期刊，按层级排序 */
export function journalsOfDept(dept: DeptId): JournalStat[] {
  return journalStats(findingsByDept(dept))
}

/* ----------------------------- 期次（按期浏览） ----------------------------- */

/** '2026-05' → '2026 年 5 月期' */
export function issueLabel(date: string): string {
  const [y, m] = date.split('-')
  return `${y} 年 ${Number(m)} 月期`
}

export interface IssueGroup {
  key: string
  label: string
  /** 指定期刊时才有值 */
  journal?: string
  date: string
  findings: Finding[]
}

export function findingsByJournal(journal: string): Finding[] {
  return FINDINGS.filter((f) => f.journal === journal)
}

function groupByDate(list: Finding[], journal?: string): IssueGroup[] {
  const map = new Map<string, Finding[]>()
  for (const f of list) {
    const cur = map.get(f.date)
    if (cur) cur.push(f)
    else map.set(f.date, [f])
  }
  return [...map]
    .map(([date, findings]) => ({
      key: journal ? `${journal}@${date}` : date,
      label: issueLabel(date),
      journal,
      date,
      findings,
    }))
    .sort((a, b) => dateNum(b.date) - dateNum(a.date))
}

/** 某期刊的各期（按年月倒序），只保留本库有收录的期次 */
export function issuesOfJournal(journal: string): IssueGroup[] {
  return groupByDate(findingsByJournal(journal), journal)
}

/** 全部期刊按期次合并：同一个月视为同一期 */
export function allIssues(pool: Finding[] = FINDINGS): IssueGroup[] {
  return groupByDate(pool)
}

/** 某期刊的期次统计 */
export function issueStatsOfJournal(journal: string): {
  issues: number
  latest: string
  total: number
} {
  const list = findingsByJournal(journal)
  return {
    issues: new Set(list.map((f) => f.date)).size,
    latest: list[0]?.date ?? '',
    total: list.length,
  }
}

export interface ResearchStats {
  total: number
  inWindow: number
  depts: number
  journals: number
  top: number
  field: number
  practice: number
  cutoff: string
}

export const RESEARCH_STATS: ResearchStats = (() => {
  const depts = new Set<DeptId>()
  const journals = new Set<string>()
  let inWindow = 0
  let top = 0
  let field = 0
  let practice = 0
  for (const f of FINDINGS) {
    depts.add(f.dept)
    journals.add(f.journal)
    if (withinMonths(f)) inWindow++
    const t = journalTier(f.journal)
    if (t === 'top') top++
    if (t === 'field') field++
    if (f.level === 'practice') practice++
  }
  return {
    total: FINDINGS.length,
    inWindow,
    depts: depts.size,
    journals: journals.size,
    top,
    field,
    practice,
    cutoff: DATA_CUTOFF,
  }
})()

/** 首页重点推荐：优先「可能改变实践」且带 key 标记的条目 */
export function featuredFindings(limit = 6): Finding[] {
  const inWindow = FINDINGS.filter(withinMonths)
  const keyed = inWindow.filter((f) => f.key)
  const rest = inWindow.filter((f) => !f.key)
  return [...keyed, ...rest].slice(0, limit)
}

/* ----------------------------- 检索 ----------------------------- */

export interface FindingHit {
  finding: Finding
  score: number
  matches: string[]
}

function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '')
}

/** 研究检索：标题/期刊/标签权重最高，结果正文次之 */
export function searchFindings(query: string, pool: Finding[] = FINDINGS): FindingHit[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []

  const hits: FindingHit[] = []

  for (const f of pool) {
    const meta = journalMeta(f.journal)
    const m = f.method
    const hayTitle = norm(
      `${f.title} ${f.en ?? ''} ${f.journal} ${meta.field} ${f.tags.join(' ')} ${f.design} ${
        m ? `${m.population} ${m.arms} ${m.endpoint}` : ''
      }`,
    )
    const haySummary = norm(`${f.impact} ${f.vsGuide ?? ''} ${m?.stats ?? ''}`)

    let score = 0
    const matches: string[] = []

    for (const term of terms) {
      const t = norm(term)
      let found = false

      if (hayTitle.includes(t)) {
        score += 12
        found = true
      } else if (haySummary.includes(t)) {
        score += 5
        found = true
      }

      for (const r of f.results) {
        if (norm(r).includes(t)) {
          if (!found) score += 3
          found = true
          if (matches.length < 3 && !matches.includes(r)) matches.push(r)
        }
      }

      if (!found) {
        score = -1
        break
      }
    }

    if (score < 0) continue
    hits.push({ finding: f, score, matches })
  }

  return hits.sort(
    (a, b) =>
      b.score - a.score ||
      TIER_RANK[tierOf(a.finding)] - TIER_RANK[tierOf(b.finding)] ||
      dateNum(b.finding.date) - dateNum(a.finding.date),
  )
}

export type { Finding, ImpactLevel, JournalTier } from './types'
export type { Frequency, JournalMeta } from './journals'
export {
  FREQUENCY_LABEL,
  JOURNAL_NAMES,
  JOURNALS,
  TIER_LABEL,
  TIER_RANK,
  journalFrequency,
  journalMeta,
  journalTier,
  journalsByTier,
} from './journals'
