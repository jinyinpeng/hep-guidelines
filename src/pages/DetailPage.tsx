import { Bookmark, CircleDot, ExternalLink, Star } from 'lucide-react'
import Disclaimer from '../components/Disclaimer'
import { DEPT_MAP, getGuideline } from '../data'
import { useDeptSections } from '../lib/data-hooks'
import { href } from '../lib/router'
import { pointKey, useStore } from '../lib/store'

export default function DetailPage({ id }: { id: string }) {
  const g = getGuideline(id)
  // 要点正文按科室分片：本页只等这一个科室的分片，加载完成后自动渲染
  const ready = useDeptSections(g?.dept)
  const { favorites, marks } = useStore()

  if (!g) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[15px] font-medium text-ink">未找到这部指南</p>
        <a href={href('/library')} className="mt-2 inline-block cursor-pointer text-[15px] text-brand">
          返回指南库
        </a>
      </div>
    )
  }

  const fav = favorites.has(g.id)
  const dept = DEPT_MAP[g.dept]
  const markCount = ready
    ? g.sections.reduce(
        (n, s, si) => n + s.points.filter((_, pi) => marks.has(pointKey(g.id, si, pi))).length,
        0,
      )
    : 0
  const graded = g.graded

  return (
    <article className="animate-rise space-y-6">
      <header className="card p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`round-chip ${
              g.region === 'cn' ? 'bg-brand-soft text-brand-ink' : 'bg-accent-soft text-accent'
            }`}
          >
            {g.region === 'cn' ? '国内指南' : '国际指南'}
          </span>
          <span className="round-chip bg-surface-3 text-ink-3">{g.year}</span>
          {g.latest && <span className="round-chip bg-warn-soft text-warn">当前最新版本</span>}
          {graded > 0 && (
            <span className="round-chip bg-brand-soft text-brand-ink">
              含证据等级 {graded} 条
            </span>
          )}
        </div>

        <h2 className="mt-2.5 text-[20px] font-bold leading-[1.45] tracking-tight text-ink">
          {g.title}
        </h2>
        <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-3">{g.org}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <a
            href={href(`/dept/${g.dept}`)}
            className="round-chip cursor-pointer bg-brand-soft text-brand-ink transition-opacity duration-200 hover:opacity-80"
          >
            {dept?.short}
          </a>
          {g.tags.map((t) => (
            <span key={t} className="round-chip bg-surface-2 text-ink-3">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => favorites.toggle(g.id)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[15px] font-medium transition-colors duration-200 ${
              fav
                ? 'border-warn/40 bg-warn-soft text-warn'
                : 'border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink'
            }`}
          >
            <Star size={16} fill={fav ? 'currentColor' : 'none'} />
            {fav ? '已收藏' : '收藏本指南'}
          </button>
          {markCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3.5 text-[13.5px] text-ink-2">
              <Bookmark size={14} className="text-brand" />
              已标记 {markCount}
            </span>
          )}
        </div>
      </header>

      <section className="rounded-[14px] border border-line bg-surface-2 p-4">
        <h3 className="text-[13.5px] font-semibold uppercase tracking-wide text-ink-3">一句话定位</h3>
        <p className="mt-1.5 text-[15px] leading-[1.7] text-ink">{g.summary}</p>
      </section>

      {!ready ? (
        <section className="card p-6 text-center">
          <p className="text-[15px] font-medium text-ink">正在载入要点正文…</p>
          <p className="mt-1.5 text-[13.5px] leading-[1.7] text-ink-3">
            按科室分片加载，完成后自动显示，无需刷新
          </p>
        </section>
      ) : (
        g.sections.map((s, si) => (
          <section key={s.title} className="card overflow-hidden">
            <h3 className="border-b border-line bg-surface-2 px-5 py-3.5 text-[16.5px] font-semibold text-ink">
              {s.title}
            </h3>
            <ul className="row-divide">
              {s.points.map((p, pi) => {
                const key = pointKey(g.id, si, pi)
                const marked = marks.has(key)
                return (
                  <li key={key} className="flex gap-3 px-5 py-4">
                    <CircleDot
                      size={15}
                      className={`mt-[3px] shrink-0 ${p.key ? 'text-brand' : 'text-line-strong'}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[15px] leading-[1.7] ${
                          p.key ? 'font-medium text-ink' : 'text-ink-2'
                        }`}
                      >
                        {p.key && (
                          <span className="mr-1 align-[1px] text-[12.5px] font-semibold text-brand">
                            核心
                          </span>
                        )}
                        {p.t}
                      </p>
                      {(p.tag || p.rec || p.ev) && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {p.rec && (
                            <span className="round-chip bg-brand-soft font-medium text-brand-ink">
                              推荐 {p.rec}
                            </span>
                          )}
                          {p.ev && (
                            <span className="round-chip bg-accent-soft font-medium text-accent">
                              证据 {p.ev}
                            </span>
                          )}
                          {p.tag && (
                            <span className="round-chip bg-surface-3 text-ink-3">{p.tag}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => marks.toggle(key)}
                      aria-label={marked ? '取消标记该要点' : '标记该要点'}
                      className="-mr-1 h-7 w-7 shrink-0 cursor-pointer rounded-full transition-colors duration-200 hover:bg-surface-3"
                    >
                      <Bookmark
                        size={15}
                        className={`mx-auto ${marked ? 'text-brand' : 'text-line-strong'}`}
                        fill={marked ? 'currentColor' : 'none'}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))
      )}

      {(g.ref || g.url) && (
        <section className="rounded-[14px] border border-line bg-surface p-4">
          <h3 className="text-[13.5px] font-semibold uppercase tracking-wide text-ink-3">
            来源与版本
          </h3>
          {g.ref && <p className="mt-1.5 text-[13.5px] leading-[1.7] text-ink-2">{g.ref}</p>}
          {g.grading && (
            <p className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-[13.5px] leading-[1.7] text-ink-2">
              <span className="font-medium text-ink">证据分级体系　</span>
              {g.grading}
            </p>
          )}
          {g.url && (
            <a
              href={g.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[13.5px] text-accent transition-colors duration-200 hover:underline"
            >
              查看原文
              <ExternalLink size={13} />
            </a>
          )}
          <p className="mt-2 text-[12.5px] leading-[1.7] text-ink-3">
            提示：本页为要点摘编，推荐等级与证据级别按原文照录、不作推断；未标注者表示摘编时未从原文取得该等级，不代表该条推荐没有等级。引用剂量、阈值或等级前，请核对官方发布的原文与最新版本。
          </p>
        </section>
      )}

      <Disclaimer compact />
    </article>
  )
}
