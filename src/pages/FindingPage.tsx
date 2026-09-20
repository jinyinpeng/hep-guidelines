import { ArrowRight, BookOpenText, ExternalLink, FlaskConical, Microscope, Star } from 'lucide-react'
import {
  DEPT_MAP,
  FREQUENCY_LABEL,
  LEVEL_LABEL,
  TIER_LABEL,
  getFinding,
  issueLabel,
  journalFrequency,
  journalMeta,
  topicOf,
} from '../data'
import { href } from '../lib/router'
import { useStore } from '../lib/store'

const LEVEL_STYLE: Record<string, string> = {
  practice: 'bg-brand-soft text-brand-ink',
  promising: 'bg-accent-soft text-accent',
  exploratory: 'bg-surface-3 text-ink-3',
}

function MethodRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 px-4 py-3">
      <dt className="w-[68px] shrink-0 text-[12px] font-medium text-ink-3">{label}</dt>
      <dd className="min-w-0 flex-1 text-[13px] leading-relaxed text-ink-2">{value}</dd>
    </div>
  )
}

export default function FindingPage({ id }: { id: string }) {
  const f = getFinding(id)
  const { rfavorites } = useStore()

  if (!f) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[14px] font-medium text-ink">未找到这条研究</p>
        <a href={href('/library')} className="mt-2 inline-block cursor-pointer text-[13px] text-brand">
          返回顶刊库
        </a>
      </div>
    )
  }

  const fav = rfavorites.has(f.id)
  const dept = DEPT_MAP[f.dept]
  const topic = topicOf(f.dept, f.topic)
  const meta = journalMeta(f.journal)

  return (
    <article className="animate-rise space-y-5">
      <header className="card p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`round-chip font-semibold ${
              meta.tier === 'top'
                ? 'bg-accent-soft text-accent'
                : meta.tier === 'field'
                  ? 'bg-brand-soft text-brand-ink'
                  : 'bg-surface-3 text-ink-2'
            }`}
          >
            {f.journal}
          </span>
          <span className="round-chip bg-surface-3 text-ink-3">
            {TIER_LABEL[meta.tier]} · {meta.field}
          </span>
          <span className="round-chip bg-surface-3 tabular-nums text-ink-3">{f.date.replace('-', '.')}</span>
          <span className={`round-chip ${LEVEL_STYLE[f.level]}`}>{LEVEL_LABEL[f.level]}</span>
        </div>

        <h2 className="mt-2.5 text-[19px] font-bold leading-snug tracking-tight text-ink">
          {f.title}
        </h2>
        {f.en && <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">{f.en}</p>}
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-2">
          {f.design}
          {f.n ? ` · ${f.n}` : ''}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <a
            href={href(`/dept/${f.dept}`)}
            className="round-chip cursor-pointer bg-brand-soft text-brand-ink transition-opacity duration-200 hover:opacity-80"
          >
            {dept?.short}
          </a>
          {topic && <span className="round-chip bg-surface-3 text-ink-2">{topic.short}</span>}
          {f.tags.map((t) => (
            <span key={t} className="round-chip bg-surface-2 text-ink-3">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => rfavorites.toggle(f.id)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[13.5px] font-medium transition-colors duration-200 ${
              fav
                ? 'border-warn/40 bg-warn-soft text-warn'
                : 'border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink'
            }`}
          >
            <Star size={16} fill={fav ? 'currentColor' : 'none'} />
            {fav ? '已收藏' : '收藏这条研究'}
          </button>
        </div>
      </header>

      <section className="card overflow-hidden">
        <h3 className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5 text-[13.5px] font-semibold text-ink">
          <Microscope size={15} className="text-accent" />
          研究方法
        </h3>
        <dl className="row-divide">
          <MethodRow label="研究设计" value={`${f.design}${f.n ? ` · ${f.n}` : ''}`} />
          {f.method?.population && <MethodRow label="入组人群" value={f.method.population} />}
          {f.method?.arms && <MethodRow label="干预与对照" value={f.method.arms} />}
          {f.method?.endpoint && <MethodRow label="主要终点" value={f.method.endpoint} />}
          {f.method?.stats && <MethodRow label="统计与分析" value={f.method.stats} />}
        </dl>
        <a
          href={href('/methods')}
          className="flex cursor-pointer items-center gap-1 border-t border-line bg-surface-2 px-4 py-2.5 text-[12px] text-accent transition-opacity duration-200 hover:opacity-80"
        >
          这些方法学信息该怎么读
          <ArrowRight size={13} />
        </a>
      </section>

      <section className="card overflow-hidden">
        <h3 className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5 text-[13.5px] font-semibold text-ink">
          <FlaskConical size={15} className="text-accent" />
          主要结果
        </h3>
        <ul className="row-divide">
          {f.results.map((r, i) => (
            <li key={r} className="flex gap-2.5 px-4 py-3.5">
              <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold tabular-nums text-accent">
                {i + 1}
              </span>
              <p className="text-[13.5px] leading-relaxed text-ink-2">{r}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[14px] border border-line bg-surface-2 p-4">
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-ink-3">临床意义</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">{f.impact}</p>
        {f.vsGuide && (
          <p className="mt-2.5 flex gap-2 rounded-xl bg-surface px-3 py-2 text-[12px] leading-relaxed text-ink-2">
            <BookOpenText size={14} className="mt-[2px] shrink-0 text-brand" />
            <span>
              <span className="font-medium text-ink">与现行指南的关系　</span>
              {f.vsGuide}
            </span>
          </p>
        )}
      </section>

      <section className="rounded-[14px] border border-line bg-surface p-4">
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-ink-3">
          来源与文献信息
        </h3>
        <ul className="mt-1.5 space-y-1 text-[12.5px] leading-relaxed text-ink-2">
          <li>
            期刊：{f.journal}（{TIER_LABEL[meta.tier]} · {meta.field} ·{' '}
            {FREQUENCY_LABEL[journalFrequency(f.journal)]}）
          </li>
          <li>
            期次：{issueLabel(f.date)}（按公开发表月份归期）
          </li>
          {f.en && <li>英文题名：{f.en}</li>}
        </ul>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {f.url && (
            <a
              href={f.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex cursor-pointer items-center gap-1 text-[12.5px] text-accent transition-colors duration-200 hover:underline"
            >
              检索原文
              <ExternalLink size={13} />
            </a>
          )}
          <a
            href={href('/issues')}
            className="inline-flex cursor-pointer items-center gap-1 text-[12.5px] text-accent transition-colors duration-200 hover:underline"
          >
            看向该期其他研究
            <ExternalLink size={13} />
          </a>
        </div>
        <p className="mt-2 text-[11.5px] leading-relaxed text-ink-3">
          提示：本条为研究结果的要点摘编，旨在提示「有什么新证据」；具体数值、亚组、安全性与适用人群请务必核对原文全文与期刊正式版本。
          研究结论不等同于临床推荐，是否改变本机构诊疗流程需经多学科讨论与指南更新确认。
        </p>
      </section>
    </article>
  )
}
