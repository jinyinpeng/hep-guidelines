import { useMemo, useState } from 'react'
import GuidelineCard from '../components/GuidelineCard'
import SearchBar from '../components/SearchBar'
import { DEPT_GROUPS, DEPARTMENTS, GUIDELINES, countByDept, search } from '../data'
import type { DeptGroup } from '../data/types'

const REGIONS = [
  { key: 'all', label: '全部' },
  { key: 'cn', label: '国内' },
  { key: 'intl', label: '国际' },
] as const

type RegionKey = (typeof REGIONS)[number]['key']

export default function LibraryPage() {
  const [region, setRegion] = useState<RegionKey>('all')
  const [group, setGroup] = useState<DeptGroup | 'all'>('all')
  const [dept, setDept] = useState<string>('all')
  const [q, setQ] = useState('')

  const deptOptions = useMemo(
    () => (group === 'all' ? DEPARTMENTS : DEPARTMENTS.filter((d) => d.group === group)),
    [group],
  )

  const base = useMemo(
    () =>
      GUIDELINES.filter(
        (g) =>
          (region === 'all' || g.region === region) && (dept === 'all' || g.dept === dept),
      ),
    [region, dept],
  )

  const list = useMemo(() => (q.trim() ? search(q, base).map((h) => h.guideline) : base), [q, base])

  const activeDept = DEPARTMENTS.find((d) => d.id === dept)

  return (
    <div className="space-y-4">
      <SearchBar value={q} onChange={setQ} placeholder="在当前筛选结果中检索" />

      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
        {REGIONS.map((r) => (
          <button
            key={r.key}
            type="button"
            data-on={region === r.key}
            onClick={() => setRegion(r.key)}
            className="chip-btn shrink-0"
          >
            {r.label}
          </button>
        ))}
        <span className="mx-1 w-px shrink-0 bg-line" />
        <button
          type="button"
          data-on={group === 'all'}
          onClick={() => {
            setGroup('all')
            setDept('all')
          }}
          className="chip-btn shrink-0"
        >
          全部科室
        </button>
        {DEPT_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            data-on={group === g.id}
            onClick={() => {
              setGroup(g.id)
              setDept('all')
            }}
            className="chip-btn shrink-0"
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
        <button
          type="button"
          data-on={dept === 'all'}
          onClick={() => setDept('all')}
          className="chip-btn shrink-0"
        >
          {group === 'all' ? '全部科室' : '该组全部'}
        </button>
        {deptOptions.map((d) => (
          <button
            key={d.id}
            type="button"
            data-on={dept === d.id}
            onClick={() => setDept(d.id)}
            className="chip-btn shrink-0"
          >
            {d.short}
            <span className="ml-1 tabular-nums opacity-60">{countByDept(d.id)}</span>
          </button>
        ))}
      </div>

      <p className="text-[12.5px] text-ink-3">
        共 <strong className="font-semibold text-ink">{list.length}</strong> 部
        {region !== 'all' && ` · ${REGIONS.find((r) => r.key === region)?.label}`}
        {activeDept && ` · ${activeDept.short}`}
      </p>

      {list.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-[14px] font-medium text-ink">当前筛选下没有结果</p>
          <p className="mt-1 text-[12.5px] text-ink-3">试着放宽筛选条件或调整关键词</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((g) => (
            <GuidelineCard key={g.id} g={g} />
          ))}
        </div>
      )}
    </div>
  )
}
