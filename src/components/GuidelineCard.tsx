import { Star } from 'lucide-react'
import { DEPT_MAP, topicOf } from '../data'
import type { GuidelineCardData } from '../data/types'
import { href } from '../lib/router'
import { useStore } from '../lib/store'

/**
 * 指南卡片。
 * 密度控制：一行状态芯片 → 标题 → 机构 → 摘要 → 分隔线 → 归属信息。
 * 摘要限制两行、标签最多两个，避免列表页出现「一屏一条也读不完」的堆叠感。
 *
 * 只依赖卡片级字段，不含要点正文，因此列表页无需等待科室正文分片。
 */
export default function GuidelineCard({ g }: { g: GuidelineCardData }) {
  const { favorites } = useStore()
  const fav = favorites.has(g.id)
  const dept = DEPT_MAP[g.dept]
  const topic = topicOf(g.dept, g.topic)

  return (
    <a
      href={href(`/detail/${g.id}`)}
      className="card group block cursor-pointer p-5 transition-colors duration-200 hover:border-brand/60 active:bg-surface-2"
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <span
            className={`round-chip ${
              g.region === 'cn' ? 'bg-brand-soft text-brand-ink' : 'bg-accent-soft text-accent'
            }`}
          >
            {g.region === 'cn' ? '国内' : '国际'}
          </span>
          <span className="round-chip bg-surface-3 tabular-nums text-ink-3">{g.year}</span>
          {g.latest && <span className="round-chip bg-warn-soft text-warn">最新版</span>}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            favorites.toggle(g.id)
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
        {g.short}
      </h3>
      <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-3">{g.org}</p>
      <p className="mt-3 line-clamp-2 text-[15px] leading-[1.7] text-ink-2">{g.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3.5">
        <span className="round-chip bg-surface-2 text-ink-3">{dept?.short}</span>
        {topic && <span className="round-chip bg-brand-soft text-brand-ink">{topic.short}</span>}
        {g.tags.slice(0, 2).map((t) => (
          <span key={t} className="round-chip bg-surface-2 text-ink-3">
            {t}
          </span>
        ))}
        {g.tags.length > 2 && <span className="text-[12.5px] text-ink-3">+{g.tags.length - 2}</span>}
      </div>
    </a>
  )
}
