import { useMemo, useState } from 'react'
import { FilterDivider, FilterGroup } from '../components/FilterBar'
import FindingCard from '../components/FindingCard'
import {
  DEPT_MAP,
  DATA_CUTOFF,
  TIERS,
  WINDOWS,
  countFindingsByDept,
  countFindingsByTopic,
  findingsByDept,
  journalStats,
  latestFindingDateOf,
  researchTopicIds,
  tierOf,
  topicsOf,
  withinMonths,
} from '../data'
import type { JournalTier } from '../data'
import type { DeptId } from '../data/types'

type WindowKey = (typeof WINDOWS)[number]['id']

const TIER_CHIP: Record<JournalTier, string> = {
  top: 'bg-accent-soft text-accent',
  field: 'bg-brand-soft text-brand-ink',
  major: 'bg-surface-3 text-ink-2',
}

interface Props {
  deptId: string
}

export default function ResearchDeptPage({ deptId }: Props) {
  const dept = DEPT_MAP[deptId as DeptId]
  const [win, setWin] = useState<WindowKey>('m12')
  const [journal, setJournal] = useState('all')
  const [tier, setTier] = useState<JournalTier | 'all'>('all')
  const [topic, setTopic] = useState('all')

  const all = useMemo(() => findingsByDept(deptId as DeptId), [deptId])

  const topics = useMemo(
    () =>
      researchTopicIds(deptId as DeptId)
        .map((id) => topicsOf(deptId as DeptId).find((t) => t.id === id))
        .filter((t): t is NonNullable<typeof t> => Boolean(t)),
    [deptId],
  )

  const journals = useMemo(() => journalStats(all), [all])

  const activeWindow = WINDOWS.find((w) => w.id === win) ?? WINDOWS[0]

  const list = useMemo(
    () =>
      all.filter((f) => {
        if (activeWindow.months > 0 && !withinMonths(f, activeWindow.months)) return false
        if (journal !== 'all' && f.journal !== journal) return false
        if (tier !== 'all' && tierOf(f) !== tier) return false
        if (topic !== 'all' && f.topic !== topic) return false
        return true
      }),
    [all, activeWindow, journal, tier, topic],
  )

  if (!dept) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[15px] font-medium text-ink">未找到该科室</p>
      </div>
    )
  }

  const count = countFindingsByDept(dept.id)
  const activeTopic = topics.find((t) => t.id === topic)

  return (
    <div className="animate-rise space-y-5">
      <section className="card p-5">
        <h2 className="text-[20px] font-bold leading-[1.4] text-ink">{dept.name}</h2>
        <p className="mt-2 text-[15px] leading-[1.7] text-ink-2">{dept.desc}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3.5 text-[13.5px] tabular-nums text-ink-3">
          <span>研究 {count} 条</span>
          <span>病种 {topics.length} 类</span>
          <span>期刊 {journals.length} 种</span>
          <span>最近 {latestFindingDateOf(dept.id).replace('-', '.') || '—'}</span>
        </div>
        <p className="mt-3 text-[12.5px] leading-[1.6] text-ink-3">
          数据口径：截至 {DATA_CUTOFF.replace('-', '.')} 已公开发表的临床研究
        </p>
      </section>

      {count === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-[15px] font-medium text-ink">该科室的研究正在录入中</p>
          <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-3">
            欢迎提供你关注的顶刊研究，我们会优先补充
          </p>
        </div>
      ) : (
        <>
          <section className="card p-5">
            <div className="space-y-5">
              <FilterGroup label="时间范围">
                {WINDOWS.map((w) => {
                  const n =
                    w.months === 0
                      ? all.length
                      : all.filter((f) => withinMonths(f, w.months)).length
                  return (
                    <button
                      key={w.id}
                      type="button"
                      data-on={win === w.id}
                      onClick={() => setWin(w.id)}
                      className="chip-btn shrink-0"
                    >
                      {w.label}
                      <span className="tabular-nums opacity-60">{n}</span>
                    </button>
                  )
                })}
              </FilterGroup>

              <FilterDivider />

              <FilterGroup label="期刊层级">
                <button
                  type="button"
                  data-on={tier === 'all'}
                  onClick={() => setTier('all')}
                  className="chip-btn shrink-0"
                >
                  全部
                </button>
                {TIERS.map((t) => {
                  const n = all.filter((f) => tierOf(f) === t.id).length
                  if (!n) return null
                  return (
                    <button
                      key={t.id}
                      type="button"
                      data-on={tier === t.id}
                      onClick={() => setTier(t.id)}
                      className="chip-btn shrink-0"
                    >
                      {t.label}
                      <span className="tabular-nums opacity-60">{n}</span>
                    </button>
                  )
                })}
              </FilterGroup>

              <FilterGroup label="期刊">
                <button
                  type="button"
                  data-on={journal === 'all'}
                  onClick={() => setJournal('all')}
                  className="chip-btn shrink-0"
                >
                  全部
                </button>
                {journals.map((j) => (
                  <button
                    key={j.journal}
                    type="button"
                    data-on={journal === j.journal}
                    onClick={() => setJournal(j.journal)}
                    className="chip-btn shrink-0"
                  >
                    {j.journal}
                    <span className="tabular-nums opacity-60">{j.count}</span>
                  </button>
                ))}
              </FilterGroup>

              <FilterDivider />

              <FilterGroup label="病种">
                <button
                  type="button"
                  data-on={topic === 'all'}
                  onClick={() => setTopic('all')}
                  className="chip-btn shrink-0"
                >
                  全部
                </button>
                {topics.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    data-on={topic === t.id}
                    onClick={() => setTopic(t.id)}
                    className="chip-btn shrink-0"
                  >
                    {t.short}
                    <span className="tabular-nums opacity-60">
                      {countFindingsByTopic(dept.id, t.id)}
                    </span>
                  </button>
                ))}
              </FilterGroup>
            </div>
          </section>

          {activeTopic?.desc && (
            <section className="rounded-[14px] border border-line bg-surface-2 px-5 py-4">
              <p className="text-[15px] font-semibold text-ink">{activeTopic.name}</p>
              <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-3">{activeTopic.desc}</p>
            </section>
          )}

          <p className="text-[13.5px] text-ink-3">
            共 <strong className="font-semibold text-ink">{list.length}</strong> 条
            {activeWindow.months > 0 && ` · ${activeWindow.label}`}
            {journal !== 'all' && ` · ${journal}`}
            {activeTopic && ` · ${activeTopic.short}`}
          </p>

          {list.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-[15px] text-ink-2">当前筛选下没有结果</p>
              <p className="mt-1 text-[13.5px] text-ink-3">
                试试把时间范围放宽到「近两年」或「全部」（最近一条为{' '}
                {latestFindingDateOf(dept.id).replace('-', '.')}）
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((f) => (
                <FindingCard key={f.id} f={f} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
