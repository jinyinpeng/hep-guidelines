import { ArrowUpRight, Layers, ShieldCheck, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import Disclaimer from '../components/Disclaimer'
import GuidelineCard from '../components/GuidelineCard'
import SearchBar from '../components/SearchBar'
import { DISEASES, GUIDELINES, STATS, countByDisease, search } from '../data'
import { href } from '../lib/router'

const HOT = ['治疗适应证', '一线方案', '筛查', 'HCC 监测', '白蛋白', 'FIB-4', '再代偿', '门静脉高压']

interface Props {
  query: string
  onQueryChange: (v: string) => void
}

export default function HomePage({ query, onQueryChange }: Props) {
  const q = query.trim()
  const hits = useMemo(() => (q ? search(q) : []), [q])
  const latest = useMemo(
    () => GUIDELINES.filter((g) => g.latest).slice(0, 6),
    [],
  )

  return (
    <div className="space-y-5">
      {!q && (
        <section className="animate-rise pt-1">
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-ink">
            肝病科指南共识
            <br />
            要点速查
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
            收录国内外最新指南与共识的核心要点，手机随时查、断网也能看。
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat value={STATS.total} label="部指南共识" />
            <Stat value={STATS.points} label="条要点" />
            <Stat value={STATS.year} label="最新版本年份" />
          </div>
        </section>
      )}

      <section className="space-y-3">
        <SearchBar value={query} onChange={onQueryChange} />
        {!q && (
          <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
            {HOT.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => onQueryChange(w)}
                className="chip-btn shrink-0"
              >
                {w}
              </button>
            ))}
          </div>
        )}
      </section>

      {q ? (
        <section className="space-y-3">
          <p className="text-[12.5px] text-ink-3">
            找到 <strong className="font-semibold text-ink">{hits.length}</strong> 部相关指南
          </p>
          {hits.length === 0 && (
            <div className="card p-6 text-center">
              <p className="text-[14px] font-medium text-ink">没有匹配的指南或要点</p>
              <p className="mt-1 text-[12.5px] text-ink-3">
                试试更短的词，例如「乙肝」「腹水」「白蛋白」
              </p>
            </div>
          )}
          {hits.map((h) => (
            <div key={h.guideline.id} className="space-y-1.5">
              <GuidelineCard g={h.guideline} />
              {h.matches.length > 0 && (
                <ul className="space-y-1 rounded-[12px] border border-line bg-surface-2 p-3">
                  {h.matches.map((m) => (
                    <li key={m.text} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-2">
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
            <SectionTitle icon={<Layers size={15} />} title="按病种浏览" hrefTo="/library" />
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {DISEASES.map((d) => (
                <a
                  key={d.id}
                  href={href(`/library?d=${d.id}`)}
                  className="card group cursor-pointer p-3.5 transition-colors duration-200 hover:border-brand/60 active:bg-surface-2"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[14.5px] font-semibold text-ink transition-colors duration-200 group-hover:text-brand">
                      {d.short}
                    </span>
                    <span className="text-[11px] tabular-nums text-ink-3">
                      {countByDisease(d.id)} 部
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-ink-3">
                    {d.desc}
                  </p>
                </a>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              icon={<TrendingUp size={15} />}
              title="当前最新版本"
              hrefTo="/library"
            />
            <div className="mt-3 space-y-3">
              {latest.map((g) => (
                <GuidelineCard key={g.id} g={g} />
              ))}
            </div>
          </section>

          <section className="flex items-start gap-3 rounded-[14px] border border-line bg-surface p-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand" />
            <div>
              <h3 className="text-[13.5px] font-semibold text-ink">完全离线可用</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
                首次打开后所有内容会被缓存到本机，之后断网、飞行模式、地铁里都能正常查阅与检索。可「添加到主屏幕」当 App 使用。
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
      <div className="text-[19px] font-bold leading-none tabular-nums text-brand">{value}</div>
      <div className="mt-1 text-[11px] text-ink-3">{label}</div>
    </div>
  )
}

function SectionTitle({
  icon,
  title,
  hrefTo,
}: {
  icon: React.ReactNode
  title: string
  hrefTo: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-brand">{icon}</span>
      <h2 className="text-[14.5px] font-semibold text-ink">{title}</h2>
      <a
        href={href(hrefTo)}
        className="ml-auto flex cursor-pointer items-center gap-0.5 text-[12px] text-ink-3 transition-colors duration-200 hover:text-brand"
      >
        全部
        <ArrowUpRight size={13} />
      </a>
    </div>
  )
}
