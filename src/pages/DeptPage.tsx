import { useMemo, useState } from 'react'
import { FilterGroup } from '../components/FilterBar'
import GuidelineCard from '../components/GuidelineCard'
import {
  DEPT_MAP,
  byDept,
  countByDept,
  countByTopic,
  latestYearOf,
  pointCount,
  topicOf,
  topicsOf,
} from '../data'
import type { DeptId } from '../data/types'

const REGIONS = [
  { key: 'all', label: '全部' },
  { key: 'cn', label: '国内' },
  { key: 'intl', label: '国际' },
] as const

type RegionKey = (typeof REGIONS)[number]['key']

interface Props {
  deptId: string
  initialTopic?: string
}

export default function DeptPage({ deptId, initialTopic }: Props) {
  const dept = DEPT_MAP[deptId as DeptId]
  const [region, setRegion] = useState<RegionKey>('all')
  const [topic, setTopic] = useState<string>(initialTopic ?? 'all')

  const all = useMemo(() => byDept(deptId as DeptId), [deptId])

  /** 只展示本科室实际收录过的病种，避免出现空分组 */
  const topics = useMemo(
    () => topicsOf(deptId as DeptId).filter((t) => countByTopic(deptId as DeptId, t.id) > 0),
    [deptId],
  )

  const list = useMemo(
    () =>
      all.filter(
        (g) => (region === 'all' || g.region === region) && (topic === 'all' || g.topic === topic),
      ),
    [all, region, topic],
  )

  if (!dept) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[15px] font-medium text-ink">未找到该科室</p>
      </div>
    )
  }

  const count = countByDept(dept.id)
  const activeTopic = topicOf(dept.id, topic === 'all' ? undefined : topic)

  return (
    <div className="animate-rise space-y-5">
      <section className="card p-5">
        <h2 className="text-[20px] font-bold leading-[1.4] text-ink">{dept.name}</h2>
        <p className="mt-2 text-[15px] leading-[1.7] text-ink-2">{dept.desc}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3.5 text-[13.5px] tabular-nums text-ink-3">
          <span>收录 {count} 部</span>
          <span>病种 {topics.length} 类</span>
          <span>要点 {pointCount(dept.id)} 条</span>
          <span>最新版次 {latestYearOf(dept.id) || '—'}</span>
        </div>
      </section>

      {count === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-[15px] font-medium text-ink">该科室的指南正在录入中</p>
          <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-3">
            欢迎提供你关注的指南名称，我们会优先补充
          </p>
        </div>
      ) : (
        <>
          <section className="card p-5">
            <div className="space-y-5">
              <FilterGroup label="地区">
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
              </FilterGroup>

              {/* 病种筛选：每个科室都有自己的一套病种 */}
              {topics.length > 0 && (
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
                        {countByTopic(dept.id, t.id)}
                      </span>
                    </button>
                  ))}
                </FilterGroup>
              )}
            </div>
          </section>

          {activeTopic && (
            <section className="rounded-[14px] border border-line bg-surface-2 px-5 py-4">
              <p className="text-[15px] font-semibold text-ink">{activeTopic.name}</p>
              {activeTopic.desc && (
                <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-3">{activeTopic.desc}</p>
              )}
            </section>
          )}

          <p className="text-[13.5px] text-ink-3">
            共 <strong className="font-semibold text-ink">{list.length}</strong> 部
            {activeTopic && ` · ${activeTopic.short}`}
            {region !== 'all' && ` · ${REGIONS.find((r) => r.key === region)?.label}`}
          </p>

          {list.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-[15px] text-ink-2">当前筛选下没有结果</p>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((g) => (
                <GuidelineCard key={g.id} g={g} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
