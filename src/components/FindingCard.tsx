import { Star } from 'lucide-react'
import { DEPT_MAP, LEVEL_LABEL, topicsOf } from '../data'
import type { Finding, JournalTier } from '../data'
import { journalMeta } from '../data'
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

/**
 * 研究卡片。
 * 密度控制：一行「期刊 + 期次」→ 标题 → 设计与样本量 → 结论 → 分隔线 → 归属信息。
 * 期刊层级用颜色表达（不再额外占一个芯片），主要终点等细节留给详情页，避免卡片过载。
 */
export default function FindingCard({ f }: { f: Finding }) {
  const { rfavorites } = useStore()
  const fav = rfavorites.has(f.id)
  const dept = DEPT_MAP[f.dept]
  const topic = topicsOf(f.dept).find((t) => t.id === f.topic)
  const meta = journalMeta(f.journal)

  return (
    <a
      href={href(`/finding/${f.id}`)}
      className="card group block cursor-pointer p-5 transition-colors duration-200 hover:border-brand/60 active:bg-surface-2"
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <span className={`round-chip font-semibold ${TIER_CHIP[meta.tier]}`}>{f.journal}</span>
          <span className="round-chip bg-surface-3 tabular-nums text-ink-3">{fmtDate(f.date)}</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            rfavorites.toggle(f.id)
          }}
          aria-label={fav ? '取消收藏' : '收藏'}
          className="-mr-2 -mt-1.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-surface-3"
        >
          <Star
            size={18}
            className={fav ? 'text-warn' : 'text-ink-3'}
            fill={fav ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <h3 className="mt-3 text-[18px] font-semibold leading-[1.45] text-ink transition-colors duration-200 group-hover:text-brand">
        {f.title}
      </h3>
      <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-3">
        {f.design}
        {f.n ? ` · ${f.n}` : ''}
      </p>
      <p className="mt-3 line-clamp-2 text-[15px] leading-[1.7] text-ink-2">{f.impact}</p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3.5">
        <span className="round-chip bg-surface-2 text-ink-3">{dept?.short}</span>
        {topic && <span className="round-chip bg-surface-2 text-ink-3">{topic.short}</span>}
        <span className={`round-chip ${LEVEL_STYLE[f.level]}`}>{LEVEL_LABEL[f.level]}</span>
      </div>
    </a>
  )
}
