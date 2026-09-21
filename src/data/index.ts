import { DEPARTMENTS, DEPT_GROUPS, DEPT_MAP, deptsByGroup } from './departments'
import { CARDS_URL, DEPT_URLS } from './generated/urls'
import { TOPICS, topicOf, topicsOf } from './topics'
import type { DeptId, Guideline, GuidelineSummary, GuidelineView, Section } from './types'

/**
 * 指南数据的运行时装配层。
 *
 * 数据本身不再打进 JS 包，而是由 scripts/gen-data.mjs 切成两类静态分片：
 *   - 卡片索引 `data/cards.<hash>.json`：所有指南的卡片级字段，首屏一次性取回，
 *     列表/筛选/检索立刻可用；
 *   - 科室正文 `data/dept/<dept>.<hash>.json`：含要点正文，按需（详情页）
 *     或后台补齐（全文检索）加载。
 *
 * 因此「加内容」只会让对应科室的正文分片变大，入口 chunk 不再随内容膨胀。
 * 分片文件名带内容哈希，Service Worker 的缓存优先策略不会命中旧内容。
 */

/* ------------------------------ 状态 ------------------------------ */

/** 全部指南的卡片级字段（构建期已算好条数与等级数），按年份倒序 */
export const CARDS: GuidelineSummary[] = []

/** 卡片索引，按 id 查 */
export const CARDS_MAP = new Map<string, GuidelineSummary>()

/**
 * 运行时指南视图。`sections` 为空数组表示该科室正文尚未加载；
 * 正文到位后原地填充同一对象，引用不变。
 */
export const GUIDELINES: GuidelineView[] = []
export const GUIDELINE_MAP = new Map<string, GuidelineView>()

const deptCards = new Map<DeptId, GuidelineSummary[]>()
const deptLoaded = new Set<DeptId>()
const deptLoading = new Map<DeptId, Promise<void>>()

let version = 0
const listeners = new Set<() => void>()

/** 数据变化订阅（配合 useSyncExternalStore 让「正文补齐后」自动重渲染） */
export function subscribeData(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function dataVersion(): number {
  return version
}

function bump(): void {
  version += 1
  for (const listener of listeners) listener()
}

/* ------------------------------ 读取分片 ------------------------------ */

function assetUrl(path: string): string {
  return new URL(path, new URL(import.meta.env.BASE_URL, location.href)).href
}

/** 走默认 fetch（由 Service Worker 缓存优先），离线时可直接命中缓存 */
async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(assetUrl(path))
  if (!res.ok) throw new Error(`数据分片加载失败：${path}（HTTP ${res.status}）`)
  return (await res.json()) as T
}

/** 数据分片清单：交给 Service Worker 预热缓存，保证首次访问后即可离线 */
export function dataAssetUrls(): string[] {
  return [assetUrl(CARDS_URL), ...Object.values(DEPT_URLS).map(assetUrl)]
}

/* ------------------------------ 初始化 ------------------------------ */

const byYearThenShort = (a: GuidelineSummary, b: GuidelineSummary) =>
  b.year - a.year || a.short.localeCompare(b.short, 'zh')

export interface Stats {
  total: number
  cn: number
  intl: number
  points: number
  latest: number
  year: number
  depts: number
  covered: number
  /** 已标注证据等级的要点数 */
  gradedPoints: number
  /** 含证据等级标注的指南数 */
  graded: number
}

/** 就地更新（保持引用不变，页面可直接读 STATS.xxx） */
export const STATS: Stats = {
  total: 0,
  cn: 0,
  intl: 0,
  points: 0,
  latest: 0,
  year: 0,
  depts: DEPARTMENTS.length,
  covered: 0,
  gradedPoints: 0,
  graded: 0,
}

function rebuildIndex(): void {
  CARDS.sort(byYearThenShort)
  CARDS_MAP.clear()
  deptCards.clear()
  GUIDELINES.length = 0
  GUIDELINE_MAP.clear()

  for (const card of CARDS) {
    CARDS_MAP.set(card.id, card)
    const list = deptCards.get(card.dept)
    if (list) list.push(card)
    else deptCards.set(card.dept, [card])

    const existing = GUIDELINE_MAP.get(card.id)
    if (existing) {
      Object.assign(existing, card)
      continue
    }
    const view: GuidelineView = { ...card, sections: [] }
    GUIDELINES.push(view)
    GUIDELINE_MAP.set(view.id, view)
  }

  let points = 0
  let gradedPoints = 0
  let graded = 0
  let latest = 0
  let year = 0
  const covered = new Set<DeptId>()
  for (const c of CARDS) {
    points += c.points
    gradedPoints += c.graded
    if (c.graded > 0) graded += 1
    if (c.latest) latest += 1
    if (c.year > year) year = c.year
    covered.add(c.dept)
  }
  Object.assign(STATS, {
    total: CARDS.length,
    cn: CARDS.filter((c) => c.region === 'cn').length,
    intl: CARDS.filter((c) => c.region === 'intl').length,
    points,
    latest,
    year,
    covered: covered.size,
    gradedPoints,
    graded,
  })
}

/**
 * 启动装配：取回卡片索引后即可渲染首页与全部列表；
 * 各科室正文随后在后台补齐（不阻塞首屏）。
 */
export async function initData(): Promise<void> {
  const cards = await getJson<GuidelineSummary[]>(CARDS_URL)
  CARDS.length = 0
  CARDS.push(...cards)
  rebuildIndex()
  bump()
  // 后台补齐正文：全文检索与详情页会在数据到位后自动刷新
  void loadAllDepts()
}

/* ------------------------------ 正文加载 ------------------------------ */

/** 某科室正文是否已就绪 */
export function isDeptLoaded(dept: DeptId): boolean {
  return deptLoaded.has(dept)
}

/** 按需加载某科室正文（重复调用共享同一个 Promise） */
export function loadDept(dept: DeptId): Promise<void> {
  if (deptLoaded.has(dept)) return Promise.resolve()
  const running = deptLoading.get(dept)
  if (running) return running

  const path = DEPT_URLS[dept]
  const task = (path ? getJson<Guideline[]>(path) : Promise.resolve<Guideline[]>([]))
    .then((list) => {
      for (const g of list) {
        const view = GUIDELINE_MAP.get(g.id)
        if (view) {
          view.sections = g.sections
        } else {
          const points = g.sections.reduce((n, s) => n + s.points.length, 0)
          const graded = g.sections.reduce(
            (n, s) => n + s.points.filter((p) => p.rec || p.ev).length,
            0,
          )
          const created: GuidelineView = { ...g, points, graded, sections: g.sections }
          GUIDELINE_MAP.set(created.id, created)
          GUIDELINES.push(created)
        }
      }
      deptLoaded.add(dept)
      bump()
    })
    .finally(() => {
      deptLoading.delete(dept)
    })

  deptLoading.set(dept, task)
  return task
}

/** 后台把 30 个科室正文全部取回（失败不抛出，离线时自动跳过） */
export async function loadAllDepts(): Promise<void> {
  await Promise.all(DEPARTMENTS.map((d) => loadDept(d.id).catch(() => undefined)))
}

export function allDeptsLoaded(): boolean {
  return deptLoaded.size >= DEPARTMENTS.length
}

/* ------------------------------ 查询 ------------------------------ */

export function getGuideline(id: string): GuidelineView | undefined {
  return GUIDELINE_MAP.get(id)
}

/** 卡片级查询：列表/筛选都用它，不需要正文 */
export function getCard(id: string): GuidelineSummary | undefined {
  return CARDS_MAP.get(id)
}

export function byDept(dept: DeptId): GuidelineSummary[] {
  return deptCards.get(dept) ?? []
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
  const pool = dept ? byDept(dept) : CARDS
  return pool.reduce((n, g) => n + g.points, 0)
}

/** 某部指南中标注了证据等级（推荐等级或证据级别）的要点数 */
export function gradedPointCount(g: { sections?: Section[]; graded?: number }): number {
  const sections = g.sections
  if (sections && sections.length) {
    return sections.reduce((n, s) => n + s.points.filter((p) => p.rec || p.ev).length, 0)
  }
  return g.graded ?? 0
}

/* ----------------------------- 检索 ----------------------------- */

export interface Hit {
  guideline: GuidelineSummary
  score: number
  /** 命中的要点（最多 3 条）；正文未加载时仅能命中标题/摘要等信息 */
  matches: { text: string; section: string }[]
}

function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '')
}

/**
 * 轻量全文检索：科室名/标题/机构/标签权重最高，要点正文次之。
 * 支持空格分隔的多关键词，所有关键词均需在某处命中。
 */
export function search(query: string, pool: GuidelineSummary[] = CARDS): Hit[] {
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

      // 正文仅在对应科室已加载时可检索；未加载时该关键词按未命中处理，
      // 待后台补齐后由订阅者重新检索。
      for (const s of GUIDELINE_MAP.get(g.id)?.sections ?? []) {
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

export type { Guideline, GuidelineCardData, GuidelineSummary, GuidelineView, Point, Section } from './types'
export type { DeptId } from './types'
export type { Topic } from './topics'
export { TOPICS, topicsOf, topicOf } from './topics'
export { DEPARTMENTS, DEPT_GROUPS, DEPT_MAP, deptsByGroup }

/* --------------------- 顶刊前沿：各科室顶刊临床研究 --------------------- */

export type {
  Finding,
  FindingHit,
  Frequency,
  ImpactLevel,
  IssueGroup,
  JournalMeta,
  JournalStat,
  JournalTier,
} from './research'
export {
  DATA_CUTOFF,
  FINDINGS,
  FINDING_MAP,
  FREQUENCY_LABEL,
  IMPACT_LEVELS,
  JOURNAL_NAMES,
  JOURNALS,
  LEVEL_LABEL,
  RESEARCH_STATS,
  TIERS,
  TIER_LABEL,
  TIER_RANK,
  WINDOWS,
  WINDOW_MONTHS,
  allIssues,
  countFindingsByDept,
  countFindingsByTopic,
  dateNum,
  featuredFindings,
  fieldOf,
  findingsByDept,
  findingsByJournal,
  findingsByTopic,
  getFinding,
  issueLabel,
  issueStatsOfJournal,
  issuesOfJournal,
  journalFrequency,
  journalMeta,
  journalsByTier,
  journalsOfDept,
  journalStats,
  journalTier,
  latestFindingDateOf,
  researchTopicIds,
  searchFindings,
  tierOf,
  withinMonths,
} from './research'
