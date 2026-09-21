import { ArrowUpRight, CalendarClock, Layers } from 'lucide-react'
import { useMemo } from 'react'
import Disclaimer from '../components/Disclaimer'
import FindingCard from '../components/FindingCard'
import SearchBar from '../components/SearchBar'
import {
  DATA_CUTOFF,
  DEPT_GROUPS,
  RESEARCH_STATS,
  countFindingsByDept,
  deptsByGroup,
  latestFindingDateOf,
  researchTopicIds,
  searchFindings,
  topicsOf,
} from '../data'
import { href } from '../lib/router'

const HOT = ['GLP-1', '取栓', '免疫治疗', '生物制剂', '脓毒症', '微创', 'ADC', '降压']

interface Props {
  query: string
  onQueryChange: (v: string) => void
}

export default function ResearchHomePage({ query, onQueryChange }: Props) {
  const q = query.trim()
  const hits = useMemo(() => (q ? searchFindings(q) : []), [q])

  return (
    <div className="space-y-6">
      {!q && (
        <section className="animate-rise pt-1">
          <h2 className="text-[23px] font-bold leading-[1.35] tracking-tight text-ink">
            顶刊前沿
            <br />
            各科室临床研究
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat value={RESEARCH_STATS.inWindow} label="条近一年研究" />
            <Stat value={RESEARCH_STATS.practice} label="条可能改变实践" />
            <Stat value={RESEARCH_STATS.journals} label="种期刊来源" />
          </div>

          <p className="mt-2.5 flex items-center gap-1.5 text-[12.5px] text-ink-3">
            <CalendarClock size={13} className="shrink-0" />
            数据截至 {DATA_CUTOFF.replace('-', ' 年 ')} 月，按发表时间由近及远排列
          </p>
        </section>
      )}

      <section className="space-y-4">
        <SearchBar
          value={query}
          onChange={onQueryChange}
          placeholder="检索科室、疾病、药物或研究名称"
        />
        {!q && (
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
            {HOT.map((w) => (
              <button key={w} type="button" onClick={() => onQueryChange(w)} className="chip-btn shrink-0">
                {w}
              </button>
            ))}
          </div>
        )}
      </section>

      {q ? (
        <section className="space-y-4">
          <p className="text-[13.5px] text-ink-3">
            找到 <strong className="font-semibold text-ink">{hits.length}</strong> 条相关研究
          </p>
          {hits.length === 0 && (
            <div className="card p-6 text-center">
              <p className="text-[15px] font-medium text-ink">没有匹配的研究或结果</p>
              <p className="mt-1 text-[13.5px] text-ink-3">试试更短的词，例如「心衰」「卒中」「减重」</p>
            </div>
          )}
          {hits.map((h) => (
            <div key={h.finding.id} className="space-y-1.5">
              <FindingCard f={h.finding} />
              {h.matches.length > 0 && (
                <ul className="space-y-1 rounded-[12px] border border-line bg-surface-2 p-3">
                  {h.matches.map((m) => (
                    <li key={m} className="flex gap-2 text-[13.5px] leading-[1.7] text-ink-2">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      ) : (
        <>
          <section>
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-accent" />
              <h2 className="text-[16.5px] font-semibold text-ink">按科室浏览</h2>
              <a
                href={href('/library')}
                className="ml-auto flex cursor-pointer items-center gap-0.5 text-[13.5px] text-ink-3 transition-colors duration-200 hover:text-brand"
              >
                顶刊库
                <ArrowUpRight size={13} />
              </a>
            </div>

            {DEPT_GROUPS.map((group) => (
              <div key={group.id} className="mt-4">
                <p className="text-[12.5px] font-medium tracking-wide text-ink-3">{group.name}</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {deptsByGroup(group.id).map((d) => {
                    const names = researchTopicIds(d.id)
                      .map((id) => topicsOf(d.id).find((t) => t.id === id)?.short)
                      .filter(Boolean)
                    return (
                      <a
                        key={d.id}
                        href={href(`/dept/${d.id}`)}
                        className="card group cursor-pointer p-3.5 transition-colors duration-200 hover:border-brand/60 active:bg-surface-2"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-[15px] font-semibold text-ink transition-colors duration-200 group-hover:text-brand">
                            {d.short}
                          </span>
                          <span className="shrink-0 text-[12.5px] tabular-nums text-ink-3">
                            {countFindingsByDept(d.id)} 条
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[12.5px] leading-[1.7] text-ink-3">
                          {names.join(' · ') || '录入中'}
                        </p>
                        <p className="mt-1 text-[12.5px] tabular-nums text-ink-3">
                          最近 {latestFindingDateOf(d.id).replace('-', '.') || '—'}
                        </p>
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>

          <Disclaimer compact />
        </>
      )}
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="card px-3 py-2.5">
      <div className="text-[20px] font-bold leading-[1.3] tabular-nums text-accent">{value}</div>
      <div className="mt-1 text-[12.5px] text-ink-3">{label}</div>
    </div>
  )
}
