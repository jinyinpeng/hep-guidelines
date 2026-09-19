import { useMemo, useState } from 'react'
import GuidelineCard from '../components/GuidelineCard'
import { DEPT_MAP, DISEASES, byDept, countByDept, latestYearOf, pointCount } from '../data'
import type { DeptId } from '../data/types'

const REGIONS = [
  { key: 'all', label: '全部' },
  { key: 'cn', label: '国内' },
  { key: 'intl', label: '国际' },
] as const

type RegionKey = (typeof REGIONS)[number]['key']

interface Props {
  deptId: string
  initialDisease?: string
}

export default function DeptPage({ deptId, initialDisease }: Props) {
  const dept = DEPT_MAP[deptId as DeptId]
  const [region, setRegion] = useState<RegionKey>('all')
  const [disease, setDisease] = useState<string>(initialDisease ?? 'all')

  const all = useMemo(() => byDept(deptId as DeptId), [deptId])

  const list = useMemo(
    () =>
      all.filter(
        (g) => (region === 'all' || g.region === region) && (disease === 'all' || g.disease === disease),
      ),
    [all, region, disease],
  )

  if (!dept) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[14px] font-medium text-ink">未找到该科室</p>
      </div>
    )
  }

  const count = countByDept(dept.id)

  return (
    <div className="animate-rise space-y-4">
      <section className="card p-4">
        <h2 className="text-[17px] font-bold leading-snug tracking-tight text-ink">{dept.name}</h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">{dept.desc}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] tabular-nums text-ink-3">
          <span>收录 {count} 部</span>
          <span>要点 {pointCount(dept.id)} 条</span>
          <span>最新版次 {latestYearOf(dept.id) || '—'}</span>
        </div>
      </section>

      {count === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-[14px] font-medium text-ink">该科室的指南正在录入中</p>
          <p className="mt-1 text-[12.5px] text-ink-3">欢迎提供你关注的指南名称，我们会优先补充</p>
        </div>
      ) : (
        <>
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
            {dept.id === 'hepatology' && (
              <>
                <span className="mx-1 w-px shrink-0 bg-line" />
                <button
                  type="button"
                  data-on={disease === 'all'}
                  onClick={() => setDisease('all')}
                  className="chip-btn shrink-0"
                >
                  全部病种
                </button>
                {DISEASES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    data-on={disease === d.id}
                    onClick={() => setDisease(d.id)}
                    className="chip-btn shrink-0"
                  >
                    {d.short}
                  </button>
                ))}
              </>
            )}
          </div>

          <p className="text-[12.5px] text-ink-3">
            共 <strong className="font-semibold text-ink">{list.length}</strong> 部
          </p>

          {list.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-[13.5px] text-ink-2">当前筛选下没有结果</p>
            </div>
          ) : (
            <div className="space-y-3">
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
