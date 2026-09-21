import { CalendarDays, Info, Layers } from 'lucide-react'
import { useMemo, useState } from 'react'
import FindingCard, { TIER_CHIP } from '../components/FindingCard'
import {
  DEPARTMENTS,
  FINDINGS,
  FREQUENCY_LABEL,
  TIER_LABEL,
  allIssues,
  countFindingsByDept,
  issueStatsOfJournal,
  issuesOfJournal,
  journalFrequency,
  journalMeta,
  journalStats,
} from '../data'
import type { DeptId } from '../data/types'

type View = 'journal' | 'time'

/**
 * 按期次浏览：把顶刊「每一期」里的临床研究列出来。
 *
 * 两个方向：
 *   按期刊 —— 选定一本刊，逐期往下看该刊已收录的临床研究
 *   按时间 —— 不分期刊，按月把当期所有已收录的临床研究放在一起看
 *
 * 说明：本库按公开发表月份归期，只列已收录的临床研究（随机对照 / 队列 / 荟萃等），
 * 不含综述、述评、病例报告、基础研究与指南全文，因此不等于期刊完整目录。
 */
export default function IssuesPage() {
  const journals = useMemo(() => journalStats(), [])
  const [view, setView] = useState<View>('journal')
  const [dept, setDept] = useState<DeptId | 'all'>('all')
  const [journal, setJournal] = useState(() => journals[0]?.journal ?? 'NEJM')

  const pool = useMemo(
    () => (dept === 'all' ? FINDINGS : FINDINGS.filter((f) => f.dept === dept)),
    [dept],
  )

  const journalOptions = useMemo(() => journalStats(pool), [pool])

  const activeJournal = journalOptions.some((j) => j.journal === journal)
    ? journal
    : (journalOptions[0]?.journal ?? journal)

  const meta = journalMeta(activeJournal)
  const stats = useMemo(() => issueStatsOfJournal(activeJournal), [activeJournal])

  const journalIssues = useMemo(() => {
    const list = issuesOfJournal(activeJournal)
    if (dept === 'all') return list
    return list
      .map((g) => ({ ...g, findings: g.findings.filter((f) => f.dept === dept) }))
      .filter((g) => g.findings.length > 0)
  }, [activeJournal, dept])

  const timeIssues = useMemo(() => allIssues(pool), [pool])

  /** 科室按条目数从多到少，便于优先看内容多的科室 */
  const deptOptions = useMemo(
    () =>
      DEPARTMENTS.map((d) => ({ id: d.id, short: d.short, n: countFindingsByDept(d.id) }))
        .filter((d) => d.n > 0)
        .sort((a, b) => b.n - a.n),
    [],
  )

  return (
    <div className="space-y-5">
      <section className="card p-5">
        <h2 className="text-[18px] font-bold leading-[1.45] tracking-tight text-ink">
          顶刊每一期的临床研究
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-[1.7] text-ink-2">
          共收录 {journals.length} 种期刊、{FINDINGS.length} 条临床研究，按公开发表月份归入期次。
          周刊（NEJM / Lancet / JAMA / BMJ 等）每月约 4 期，月刊每月 1 期。
        </p>
        <p className="mt-2 flex gap-1.5 rounded-xl bg-surface-2 px-3 py-2 text-[12.5px] leading-[1.7] text-ink-3">
          <Info size={13} className="mt-[2px] shrink-0" />
          <span>
            收录口径：按期刊与发表月份逐期编排，
            <strong className="font-medium text-ink-2">同一期只列本库已收录的临床研究</strong>
            （随机对照、队列、荟萃等），不含综述、述评、病例报告、基础研究与指南全文，因此不等于期刊完整目录；
            标注的期次为发表月份，非期刊卷期号。
          </span>
        </p>
      </section>

      <div className="flex gap-1.5 rounded-full border border-line bg-surface-2 p-1">
        {(
          [
            { id: 'journal', label: '按期刊' },
            { id: 'time', label: '按时间' },
          ] as { id: View; label: string }[]
        ).map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full py-1.5 text-[13.5px] font-medium transition-colors duration-200 ${
              view === v.id ? 'bg-brand text-white' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {v.id === 'journal' ? <Layers size={14} /> : <CalendarDays size={14} />}
            {v.label}
          </button>
        ))}
      </div>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        <button
          type="button"
          data-on={dept === 'all'}
          onClick={() => setDept('all')}
          className="chip-btn shrink-0"
        >
          全部科室
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
            <span className="ml-1 tabular-nums opacity-60">{d.n}</span>
          </button>
        ))}
      </div>

      {view === 'journal' ? (
        <>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
            {journalOptions.map((j) => (
              <button
                key={j.journal}
                type="button"
                data-on={activeJournal === j.journal}
                onClick={() => setJournal(j.journal)}
                className="chip-btn shrink-0"
              >
                {j.journal}
                <span className="ml-1 tabular-nums opacity-60">{j.count}</span>
              </button>
            ))}
          </div>

          <section className="rounded-[14px] border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`round-chip font-semibold ${TIER_CHIP[meta.tier]}`}>
                {activeJournal}
              </span>
              <span className="round-chip bg-surface-3 text-ink-3">
                {TIER_LABEL[meta.tier]} · {meta.field}
              </span>
              <span className="round-chip bg-surface-3 text-ink-3">
                {FREQUENCY_LABEL[journalFrequency(activeJournal)]}
              </span>
            </div>
            <p className="mt-2 text-[13.5px] tabular-nums text-ink-3">
              收录 {stats.total} 条 · 涉及 {stats.issues} 期 · 最近 {stats.latest.replace('-', '.')}
            </p>
          </section>

          {journalIssues.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-[15px] text-ink-2">当前筛选下该刊没有条目</p>
            </div>
          ) : (
            journalIssues.map((g) => (
              <section key={g.key}>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[16.5px] font-semibold text-ink">{g.label}</h3>
                  <span className="text-[12.5px] tabular-nums text-ink-3">
                    {g.findings.length} 条
                  </span>
                </div>
                <div className="mt-2 space-y-4">
                  {g.findings.map((f) => (
                    <FindingCard key={f.id} f={f} />
                  ))}
                </div>
              </section>
            ))
          )}
        </>
      ) : (
        timeIssues.map((g) => (
          <section key={g.key}>
            <div className="flex items-baseline gap-2">
              <h3 className="text-[16.5px] font-semibold text-ink">{g.label}</h3>
              <span className="text-[12.5px] tabular-nums text-ink-3">{g.findings.length} 条</span>
            </div>
            <div className="mt-2 space-y-4">
              {g.findings.map((f) => (
                <FindingCard key={f.id} f={f} />
              ))}
            </div>
          </section>
        ))
      )}

      <p className="pb-2 text-center text-[12.5px] text-ink-3">
        已收录科室：{deptOptions.map((d) => d.short).join(' · ')}
      </p>
    </div>
  )
}
