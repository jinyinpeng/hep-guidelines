import { Star } from 'lucide-react'
import { DISEASE_MAP } from '../data'
import type { Guideline } from '../data/types'
import { href } from '../lib/router'
import { useStore } from '../lib/store'

export default function GuidelineCard({ g }: { g: Guideline }) {
  const { favorites } = useStore()
  const fav = favorites.has(g.id)
  const disease = DISEASE_MAP[g.disease]

  return (
    <a
      href={href(`/detail/${g.id}`)}
      className="card group block cursor-pointer p-4 transition-colors duration-200 hover:border-brand/60 active:bg-surface-2"
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`round-chip ${
            g.region === 'cn'
              ? 'bg-brand-soft text-brand-ink'
              : 'bg-accent-soft text-accent'
          }`}
        >
          {g.region === 'cn' ? '国内' : '国际'}
        </span>
        <span className="round-chip bg-surface-3 text-ink-3">{g.year}</span>
        {g.latest && <span className="round-chip bg-warn-soft text-warn">最新版</span>}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            favorites.toggle(g.id)
          }}
          aria-label={fav ? '取消收藏' : '收藏'}
          className="ml-auto -mr-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-surface-3"
        >
          <Star
            size={17}
            className={fav ? 'text-warn' : 'text-ink-3'}
            fill={fav ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <h3 className="mt-2 text-[16px] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-brand">
        {g.short}
      </h3>
      <p className="mt-1 text-[12px] leading-relaxed text-ink-3">{g.org}</p>
      <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-ink-2">{g.summary}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="round-chip bg-surface-3 text-ink-2">{disease?.short}</span>
        {g.tags.slice(0, 3).map((t) => (
          <span key={t} className="round-chip bg-surface-2 text-ink-3">
            {t}
          </span>
        ))}
        {g.tags.length > 3 && <span className="text-[11px] text-ink-3">+{g.tags.length - 3}</span>}
      </div>
    </a>
  )
}
