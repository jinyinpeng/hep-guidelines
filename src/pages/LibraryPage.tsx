import { useMemo, useState } from 'react'
import GuidelineCard from '../components/GuidelineCard'
import SearchBar from '../components/SearchBar'
import {
  DEPT_GROUPS,
  DEPARTMENTS,
  GUIDELINES,
  countByDept,
  countByTopic,
  search,
  topicsOf,
} from '../data'
import type { DeptGroup, DeptId } from '../data/types'

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
  const [topic, setTopic] = useState<string>('all')
  const [q, setQ] = useState('')

  const deptOptions = useMemo(
    () => (group === 'all' ? DEPARTMENTS : DEPARTMENTS.filter((d) => d.group === group)),
    [group],
  )

  /** 只有选中具体科室时才展示该科室的病种 */
  const topics = useMemo(
    () =>
      dept === 'all'
        ? []
        : topicsOf(dept as DeptId).filter((t) => countByTopic(dept as DeptId, t.id) > 0),
    [dept],
  )

  const base = useMemo(
    () =>
      GUIDELINES.filter(
        (g) =>
          (region === 'all' || g.region === region) &&
          (dept === 'all' || g.dept === dept) &&
          (topic === 'all' || g.topic === topic),
      ),
    [region, dept, topic],
  )

  const list = useMemo(() => (q.trim() ? search(q, base).map((h) => h.guideline) : base), [q, base])

  const activeDept = DEPARTMENTS.find((d) => d.id === dept)
  const activeTopic = topics.find((t) => t.id === topic)

  /** 切换科室时清空病种选择，避免残留无效筛选 */
  const pickDept = (id: string) => {
    setDept(id)
    setTopic('all')
  }

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
            pickDept('all')
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
              pickDept('all')
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
          onClick={() => pickDept('all')}
          className="chip-btn shrink-0"
        >
          {group === 'all' ? '全部科室' : '该组全部'}
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
            <span className="ml-1 tabular-nums opacity-60">{countByDept(d.id)}</span>
          </button>
        ))}
      </div>

      {topics.length > 0 && (
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
          <button
            type="button"
            data-on={topic === 'all'}
            onClick={() => setTopic('all')}
            className="chip-btn shrink-0"
          >
            全部病种
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
              <span className="ml-1 tabular-nums opacity-60">
                {countByTopic(dept as DeptId, t.id)}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="text-[12.5px] text-ink-3">
        共 <strong className="font-semibold text-ink">{list.length}</strong> 部
        {region !== 'all' && ` · ${REGIONS.find((r) => r.key === region)?.label}`}
        {activeDept && ` · ${activeDept.short}`}
        {activeTopic && ` · ${activeTopic.short}`}
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
