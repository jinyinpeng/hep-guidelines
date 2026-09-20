import { Star } from 'lucide-react'
import { DEPT_MAP, LEVEL_LABEL, TIER_LABEL, journalMeta, topicsOf } from '../data'
import type { Finding, JournalTier } from '../data'
import { href } from '../lib/router'
import { useStore } from '../lib/store'

/** '2026-05' → '2026.05' */
export function fmtDate(date: string): string {
  return date.replace('-', '.')
}

/** 期刊层级配色：综合顶刊（蓝）> 本领域顶刊（品牌绿）> 权威期刊（中性） */
export const TIER_CHIP: Record<JournalTier, string> = {
  top: 'bg-accent-soft text-accent',
  field: 'bg-brand-soft text-brand-ink',
  major: 'bg-surface-3 text-ink-2',
}

const LEVEL_STYLE: Record<Finding['level'], string> = {
  practice: 'bg-brand-soft text-brand-ink',
  promising: 'bg-accent-soft text-accent',
  exploratory: 'bg-surface-3 text-ink-3',
}

export default function FindingCard({ f }: { f: Finding }) {
  const { rfavorites } = useStore()
  const fav = rfavorites.has(f.id)
  const dept = DEPT_MAP[f.dept]
  const topic = topicsOf(f.dept).find((t) => t.id === f.topic)
  const meta = journalMeta(f.journal)

  return (
    <a
      href={href(`/finding/${f.id}`)}
      className="card group block cursor-pointer p-4 transition-colors duration-200 hover:border-brand/60 active:bg-surface-2"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`round-chip font-semibold ${TIER_CHIP[meta.tier]}`}>{f.journal}</span>
        <span className="round-chip bg-surface-3 tabular-nums text-ink-3">{fmtDate(f.date)}</span>
        <span className={`round-chip ${LEVEL_STYLE[f.level]}`}>{LEVEL_LABEL[f.level]}</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            rfavorites.toggle(f.id)
          }}
          aria-label={fav ? '取消收藏' : '收藏'}
          className="ml-auto -mr-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-surface-3"
        >
          <Star
            size={17}
            className={fav ? 'text-warn' : 'text-ink-3'}
            fill={fav ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <h3 className="mt-2 text-[15.5px] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-brand">
        {f.title}
      </h3>
      <p className="mt-1 text-[12px] leading-relaxed text-ink-3">
        {f.design}
        {f.n ? ` · ${f.n}` : ''}
      </p>
      {f.method?.endpoint && (
        <p className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-ink-3">
          主要终点：{f.method.endpoint}
        </p>
      )}
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{f.impact}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="round-chip bg-surface-3 text-ink-2">{dept?.short}</span>
        {topic && <span className="round-chip bg-brand-soft text-brand-ink">{topic.short}</span>}
        {meta.tier !== 'major' && (
          <span className={`round-chip ${TIER_CHIP[meta.tier]}`}>{TIER_LABEL[meta.tier]}</span>
        )}
        {f.tags.slice(0, 2).map((t) => (
          <span key={t} className="round-chip bg-surface-2 text-ink-3">
            {t}
          </span>
        ))}
      </div>
    </a>
  )
}
