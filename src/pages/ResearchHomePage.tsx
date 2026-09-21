import {
  ArrowUpRight,
  CalendarClock,
  CalendarDays,
  FlaskConical,
  Layers,
  Microscope,
  Sparkles,
} from 'lucide-react'
import { useMemo } from 'react'
import Disclaimer from '../components/Disclaimer'
import FindingCard from '../components/FindingCard'
import SearchBar from '../components/SearchBar'
import {
  DATA_CUTOFF,
  DEPT_GROUPS,
  RESEARCH_STATS,
  TIERS,
  TIER_LABEL,
  countFindingsByDept,
  deptsByGroup,
  featuredFindings,
  journalStats,
  latestFindingDateOf,
  researchTopicIds,
  searchFindings,
  topicsOf,
} from '../data'
import { href } from '../lib/router'

const HOT = ['GLP-1', '取栓', '免疫治疗', '生物制剂', '脓毒症', '微创', 'ADC', '降压']

const TIER_CHIP = {
  top: 'bg-accent-soft text-accent',
  field: 'bg-brand-soft text-brand-ink',
  major: 'bg-surface-3 text-ink-2',
} as const

interface Props {
  query: string
  onQueryChange: (v: string) => void
}

export default function ResearchHomePage({ query, onQueryChange }: Props) {
  const q = query.trim()
  const hits = useMemo(() => (q ? searchFindings(q) : []), [q])
  const featured = useMemo(() => featuredFindings(6), [])
  const journals = useMemo(() => journalStats(), [])

  return (
    <div className="space-y-6">
      {!q && (
        <section className="animate-rise pt-1">
          <h2 className="text-[23px] font-bold leading-[1.35] tracking-tight text-ink">
            顶刊前沿
            <br />
            各科室临床研究
          </h2>
          <p className="mt-2 text-[15px] leading-[1.7] text-ink-2">
            覆盖 {RESEARCH_STATS.depts} 个临床科室、{RESEARCH_STATS.journals} 种期刊：
            既有 NEJM / Lancet / JAMA / BMJ 等综合顶刊，也有各专科自己的顶刊
            （肝病科的 Hepatology、J Hepatol，血液科的 Blood，消化科的 Gut，心血管的 Circulation 等）。
          </p>

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

          <section>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              <h2 className="text-[16.5px] font-semibold text-ink">近一年值得关注</h2>
            </div>
            <div className="mt-3 space-y-4">
              {featured.map((f) => (
                <FindingCard key={f.id} f={f} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2">
              <FlaskConical size={15} className="text-accent" />
              <h2 className="text-[16.5px] font-semibold text-ink">期刊体系</h2>
              <span className="ml-auto text-[12.5px] tabular-nums text-ink-3">
                共 {RESEARCH_STATS.journals} 种
              </span>
            </div>

            <div className="mt-3 space-y-4">
              {TIERS.map((t) => {
                const list = journals.filter((j) => j.tier === t.id)
                if (!list.length) return null
                const total = list.reduce((n, j) => n + j.count, 0)
                const shown = list.slice(0, 12)
                return (
                  <div key={t.id} className="rounded-[12px] border border-line bg-surface p-3">
                    <p className="flex items-baseline gap-2">
                      <span className={`round-chip ${TIER_CHIP[t.id]}`}>{t.label}</span>
                      <span className="text-[12.5px] tabular-nums text-ink-3">
                        {list.length} 种 · {total} 条
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {shown.map((j) => (
                        <span key={j.journal} className="round-chip bg-surface-2 text-ink-2">
                          {j.journal}
                          <span className="ml-1 tabular-nums opacity-60">{j.count}</span>
                        </span>
                      ))}
                      {list.length > shown.length && (
                        <a
                          href={href('/library')}
                          className="round-chip cursor-pointer bg-brand-soft text-brand-ink transition-opacity duration-200 hover:opacity-80"
                        >
                          还有 {list.length - shown.length} 种，去顶刊库按层级筛选
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="flex items-start gap-3 rounded-[14px] border border-line bg-surface p-4">
            <CalendarDays size={20} className="mt-0.5 shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold text-ink">按期次浏览</h3>
              <p className="mt-1 text-[13.5px] leading-[1.7] text-ink-2">
                按
                <strong className="font-semibold text-ink">期刊 × 期次</strong>
                逐期查看：选定一本顶刊就看到它各期收录的临床研究；也可以「按时间」把同一期各刊的研究放在一起看。
                周刊每月约 4 期、月刊每月 1 期。
              </p>
              <a
                href={href('/issues')}
                className="mt-2 inline-flex cursor-pointer items-center gap-0.5 text-[13.5px] text-accent transition-opacity duration-200 hover:opacity-80"
              >
                进入按期次浏览
                <ArrowUpRight size={13} />
              </a>
            </div>
          </section>

          <section className="flex items-start gap-3 rounded-[14px] border border-line bg-surface p-4">
            <Microscope size={20} className="mt-0.5 shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold text-ink">研究方法怎么读</h3>
              <p className="mt-1 text-[13.5px] leading-[1.7] text-ink-2">
                每条研究都写了<strong className="font-semibold text-ink">入组人群</strong>、
                <strong className="font-semibold text-ink">干预与对照</strong>、
                <strong className="font-semibold text-ink">主要终点</strong>、
                <strong className="font-semibold text-ink">统计与分析</strong>四项方法学要素——
                同样的阳性结果，在优效性与非劣效性设计、硬终点与替代终点之间分量完全不同。
              </p>
              <a
                href={href('/methods')}
                className="mt-2 inline-flex cursor-pointer items-center gap-0.5 text-[13.5px] text-accent transition-opacity duration-200 hover:opacity-80"
              >
                研究方法速读
                <ArrowUpRight size={13} />
              </a>
            </div>
          </section>

          <section className="flex items-start gap-3 rounded-[14px] border border-line bg-surface p-4">
            <FlaskConical size={20} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <h3 className="text-[15px] font-semibold text-ink">收录口径</h3>
              <p className="mt-1 text-[13.5px] leading-[1.7] text-ink-2">
                收录公开发表于同行评议期刊的临床研究：综合顶刊、各专科本领域顶刊与领域权威期刊都收，
                按期刊层级标注（{TIER_LABEL.top} / {TIER_LABEL.field} / {TIER_LABEL.major}）。
                避免只看阳性结果，中性/阴性研究一并收录；条目为编辑摘编，具体数值与亚组请以原文为准。
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
      <div className="text-[20px] font-bold leading-[1.3] tabular-nums text-accent">{value}</div>
      <div className="mt-1 text-[12.5px] text-ink-3">{label}</div>
    </div>
  )
}
