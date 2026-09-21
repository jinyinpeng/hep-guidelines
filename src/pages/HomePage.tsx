import { ArrowUpRight, Layers, ShieldCheck, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import Disclaimer from '../components/Disclaimer'
import GuidelineCard from '../components/GuidelineCard'
import SearchBar from '../components/SearchBar'
import {
  DEPT_GROUPS,
  DEPARTMENTS,
  GUIDELINES,
  STATS,
  countByDept,
  deptsByGroup,
  latestYearOf,
  search,
  topicNamesOf,
} from '../data'
import { href } from '../lib/router'

const HOT = ['乙肝', '房颤', '糖尿病', '慢阻肺', '脓毒症', '卒中', '癌痛', '骨关节炎']

interface Props {
  query: string
  onQueryChange: (v: string) => void
}

export default function HomePage({ query, onQueryChange }: Props) {
  const q = query.trim()
  const hits = useMemo(() => (q ? search(q) : []), [q])
  const latest = useMemo(() => GUIDELINES.filter((g) => g.latest).slice(0, 6), [])

  return (
    <div className="space-y-6">
      {!q && (
        <section className="animate-rise pt-1">
          <h2 className="text-[23px] font-bold leading-[1.35] tracking-tight text-ink">
            临床指南共识
            <br />
            要点速查
          </h2>
          <p className="mt-2 text-[15px] leading-[1.7] text-ink-2">
            覆盖 {STATS.depts} 个临床科室的国内外最新指南与共识要点，手机随时查、断网也能看。
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat value={STATS.depts} label="个临床科室" />
            <Stat value={STATS.total} label="部指南共识" />
            <Stat value={STATS.points} label="条要点" />
          </div>
        </section>
      )}

      <section className="space-y-4">
        <SearchBar value={query} onChange={onQueryChange} />
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
            找到 <strong className="font-semibold text-ink">{hits.length}</strong> 部相关指南
          </p>
          {hits.length === 0 && (
            <div className="card p-6 text-center">
              <p className="text-[15px] font-medium text-ink">没有匹配的指南或要点</p>
              <p className="mt-1 text-[13.5px] text-ink-3">试试更短的词，例如「心衰」「肺炎」「输血」</p>
            </div>
          )}
          {hits.map((h) => (
            <div key={h.guideline.id} className="space-y-1.5">
              <GuidelineCard g={h.guideline} />
              {h.matches.length > 0 && (
                <ul className="space-y-1 rounded-[12px] border border-line bg-surface-2 p-3">
                  {h.matches.map((m) => (
                    <li key={m.text} className="flex gap-2 text-[13.5px] leading-[1.7] text-ink-2">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span>
                        <span className="text-ink-3">[{m.section}] </span>
                        {m.text}
                      </span>
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
              <Layers size={15} className="text-brand" />
              <h2 className="text-[16.5px] font-semibold text-ink">按科室浏览</h2>
              <a
                href={href('/library')}
                className="ml-auto flex cursor-pointer items-center gap-0.5 text-[13.5px] text-ink-3 transition-colors duration-200 hover:text-brand"
              >
                全部指南
                <ArrowUpRight size={13} />
              </a>
            </div>

            {DEPT_GROUPS.map((group) => (
              <div key={group.id} className="mt-4">
                <p className="text-[12.5px] font-medium tracking-wide text-ink-3">{group.name}</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {deptsByGroup(group.id).map((d) => (
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
                          {countByDept(d.id)} 部
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-[1.7] text-ink-3">{d.desc}</p>
                      <p className="mt-1.5 line-clamp-1 text-[12.5px] leading-[1.7] text-brand/85">
                        {topicNamesOf(d.id).join(' · ') || '录入中'}
                      </p>
                      <p className="mt-1 text-[12.5px] tabular-nums text-ink-3">
                        最新 {latestYearOf(d.id) || '—'}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section>
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-brand" />
              <h2 className="text-[16.5px] font-semibold text-ink">当前最新版本</h2>
            </div>
            <div className="mt-3 space-y-4">
              {latest.map((g) => (
                <GuidelineCard key={g.id} g={g} />
              ))}
            </div>
          </section>

          <section className="flex items-start gap-3 rounded-[14px] border border-line bg-surface p-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand" />
            <div>
              <h3 className="text-[15px] font-semibold text-ink">完全离线可用</h3>
              <p className="mt-1 text-[13.5px] leading-[1.7] text-ink-2">
                首次打开后所有内容会被缓存到本机，之后断网、飞行模式、地铁里都能正常查阅与检索。可「添加到主屏幕」当
                App 使用。
              </p>
            </div>
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
      <div className="text-[20px] font-bold leading-[1.3] tabular-nums text-brand">{value}</div>
      <div className="mt-1 text-[12.5px] text-ink-3">{label}</div>
    </div>
  )
}
