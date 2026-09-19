import { useMemo, useState } from 'react'
import GuidelineCard from '../components/GuidelineCard'
import SearchBar from '../components/SearchBar'
import { DISEASES, GUIDELINES, search } from '../data'
import type { DiseaseId } from '../data/types'

const REGIONS = [
  { key: 'all', label: '全部' },
  { key: 'cn', label: '国内' },
  { key: 'intl', label: '国际' },
] as const

type RegionKey = (typeof REGIONS)[number]['key']

export default function LibraryPage({ initialDisease }: { initialDisease?: string }) {
  const [region, setRegion] = useState<RegionKey>('all')
  const [disease, setDisease] = useState<string>(initialDisease ?? 'all')
  const [q, setQ] = useState('')

  const base = useMemo(
    () =>
      GUIDELINES.filter(
        (g) => (region === 'all' || g.region === region) && (disease === 'all' || g.disease === disease),
      ),
    [region, disease],
  )

  const list = useMemo(() => (q.trim() ? search(q, base).map((h) => h.guideline) : base), [q, base])

  return (
    <div className="space-y-4">
      <SearchBar
        value={q}
        onChange={setQ}
        autoFocus={false}
        placeholder="在当前筛选结果中检索"
      />

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
            onClick={() => setDisease(d.id as DiseaseId)}
            className="chip-btn shrink-0"
          >
            {d.short}
          </button>
        ))}
      </div>

      <p className="text-[12.5px] text-ink-3">
        共 <strong className="font-semibold text-ink">{list.length}</strong> 部
        {region !== 'all' && ` · ${REGIONS.find((r) => r.key === region)?.label}`}
        {disease !== 'all' && ` · ${DISEASES.find((d) => d.id === disease)?.name}`}
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
