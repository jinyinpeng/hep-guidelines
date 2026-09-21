import { useMemo, useState } from 'react'
import { FilterDivider, FilterGroup, FilterPanel } from '../components/FilterBar'
import FindingCard from '../components/FindingCard'
import SearchBar from '../components/SearchBar'
import {
  DEPARTMENTS,
  DEPT_GROUPS,
  FINDINGS,
  IMPACT_LEVELS,
  TIERS,
  WINDOWS,
  countFindingsByDept,
  countFindingsByTopic,
  journalStats,
  researchTopicIds,
  searchFindings,
  tierOf,
  topicsOf,
  withinMonths,
} from '../data'
import type { ImpactLevel, JournalTier } from '../data'
import type { DeptGroup, DeptId } from '../data/types'
import { href } from '../lib/router'

type WindowKey = (typeof WINDOWS)[number]['id']

export default function ResearchLibraryPage() {
  const [win, setWin] = useState<WindowKey>('m12')
  const [group, setGroup] = useState<DeptGroup | 'all'>('all')
  const [dept, setDept] = useState<string>('all')
  const [journal, setJournal] = useState('all')
  const [tier, setTier] = useState<JournalTier | 'all'>('all')
  const [levels, setLevels] = useState<ImpactLevel[]>([])
  const [topic, setTopic] = useState('all')
  const [q, setQ] = useState('')

  const activeWindow = WINDOWS.find((w) => w.id === win) ?? WINDOWS[0]

  const deptOptions = useMemo(
    () => (group === 'all' ? DEPARTMENTS : DEPARTMENTS.filter((d) => d.group === group)),
    [group],
  )

  const journals = useMemo(() => journalStats(FINDINGS), [])

  /** 只在选定具体科室时展示该科室的病种 */
  const topics = useMemo(
    () =>
      dept === 'all'
        ? []
        : researchTopicIds(dept as DeptId)
            .map((id) => topicsOf(dept as DeptId).find((t) => t.id === id))
            .filter((t): t is NonNullable<typeof t> => Boolean(t)),
    [dept],
  )

  const base = useMemo(
    () =>
      FINDINGS.filter((f) => {
        if (activeWindow.months > 0 && !withinMonths(f, activeWindow.months)) return false
        if (dept !== 'all' && f.dept !== dept) return false
        if (group !== 'all' && dept === 'all') {
          const g = DEPARTMENTS.find((d) => d.id === f.dept)?.group
          if (g !== group) return false
        }
        if (journal !== 'all' && f.journal !== journal) return false
        if (tier !== 'all' && tierOf(f) !== tier) return false
        if (levels.length > 0 && !levels.includes(f.level)) return false
        if (topic !== 'all' && f.topic !== topic) return false
        return true
      }),
    [activeWindow, group, dept, journal, tier, levels, topic],
  )

  const list = useMemo(
    () => (q.trim() ? searchFindings(q, base).map((h) => h.finding) : base),
    [q, base],
  )

  const activeDept = DEPARTMENTS.find((d) => d.id === dept)

  const pickDept = (id: string) => {
    setDept(id)
    setTopic('all')
  }

  const toggleLevel = (id: ImpactLevel) => {
    setLevels((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const reset = () => {
    setWin('m12')
    setGroup('all')
    pickDept('all')
    setJournal('all')
    setTier('all')
    setLevels([])
  }

  return (
    <div className="space-y-6">
      <SearchBar value={q} onChange={setQ} placeholder="在当前筛选结果中检索" />

      <FilterPanel
        summary={[
          activeWindow.label,
          tier === 'all' ? '全部层级' : TIERS.find((t) => t.id === tier)?.label,
          DEPT_GROUPS.find((x) => x.id === group)?.name ?? '全部科室',
          dept !== 'all' ? activeDept?.short : null,
          journal !== 'all' ? journal : null,
          levels.length > 0 ? `影响程度 ${levels.length} 项` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
        onReset={reset}
      >
        <FilterGroup label="时间范围">
          {WINDOWS.map((w) => {
            const n =
              w.months === 0
                ? FINDINGS.length
                : FINDINGS.filter((f) => withinMonths(f, w.months)).length
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

        <FilterGroup label="影响程度（可多选）">
          {IMPACT_LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              data-on={levels.includes(l.id)}
              onClick={() => toggleLevel(l.id)}
              className="chip-btn shrink-0"
            >
              {l.label}
              <span className="tabular-nums opacity-60">
                {FINDINGS.filter((f) => f.level === l.id).length}
              </span>
            </button>
          ))}
        </FilterGroup>

        <FilterDivider />

        <FilterGroup label="科室分组">
          <button
            type="button"
            data-on={group === 'all'}
            onClick={() => {
              setGroup('all')
              pickDept('all')
            }}
            className="chip-btn shrink-0"
          >
            全部
          </button>
          {DEPT_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              data-on={group === g.id}
              onClick={() => {
                setGroup(g.id)
                pickDept('all')
              }}
              className="chip-btn shrink-0"
            >
              {g.name}
            </button>
          ))}
        </FilterGroup>

        <FilterGroup label="科室">
          <button
            type="button"
            data-on={dept === 'all'}
            onClick={() => pickDept('all')}
            className="chip-btn shrink-0"
          >
            {group === 'all' ? '全部' : '该组全部'}
          </button>
          {deptOptions.map((d) => (
            <button
              key={d.id}
              type="button"
              data-on={dept === d.id}
              onClick={() => pickDept(d.id)}
              className="chip-btn shrink-0"
            >
              {d.short}
              <span className="tabular-nums opacity-60">{countFindingsByDept(d.id)}</span>
            </button>
          ))}
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
          {TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              data-on={tier === t.id}
              onClick={() => setTier(t.id)}
              className="chip-btn shrink-0"
            >
              {t.label}
              <span className="tabular-nums opacity-60">
                {FINDINGS.filter((f) => tierOf(f) === t.id).length}
              </span>
            </button>
          ))}
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

        {topics.length > 0 && (
          <>
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
                    {countFindingsByTopic(dept as DeptId, t.id)}
                  </span>
                </button>
              ))}
            </FilterGroup>
          </>
        )}
      </FilterPanel>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13.5px] leading-[1.6] text-ink-3">
        <span>
          共 <strong className="font-semibold text-ink">{list.length}</strong> 条
          {activeWindow.months > 0 && ` · ${activeWindow.label}`}
          {activeDept && ` · ${activeDept.short}`}
          {tier !== 'all' && ` · ${TIERS.find((t) => t.id === tier)?.label}`}
          {journal !== 'all' && ` · ${journal}`}
        </span>
        <a
          href={href('/issues')}
          className="ml-auto shrink-0 cursor-pointer text-accent transition-opacity duration-200 hover:opacity-80"
        >
          按期次浏览 →
        </a>
      </p>

      {list.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-[15px] font-medium text-ink">当前筛选下没有结果</p>
          <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-3">试着放宽时间范围或减少筛选条件</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((f) => (
            <FindingCard key={f.id} f={f} />
          ))}
        </div>
      )}
    </div>
  )
}
