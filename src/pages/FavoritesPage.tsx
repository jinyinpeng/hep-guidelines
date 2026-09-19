import { Bookmark, Star } from 'lucide-react'
import GuidelineCard from '../components/GuidelineCard'
import { getGuideline } from '../data'
import { href } from '../lib/router'
import { parsePointKey, useStore } from '../lib/store'

export default function FavoritesPage() {
  const { favorites, marks } = useStore()

  const favList = favorites.items
    .map((id) => getGuideline(id))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  const markedPoints = marks.items
    .map((key) => {
      const parsed = parsePointKey(key)
      if (!parsed) return null
      const [gid, si, pi] = parsed
      const g = getGuideline(gid)
      const section = g?.sections[si]
      const point = section?.points[pi]
      if (!g || !section || !point) return null
      return { key, g, section: section.title, point }
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  return (
    <div className="space-y-5">
      {favList.length === 0 && markedPoints.length === 0 && (
        <div className="card p-8 text-center">
          <Star size={26} className="mx-auto text-line-strong" />
          <p className="mt-3 text-[14.5px] font-medium text-ink">还没有收藏内容</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">
            在指南卡片或详情页点击星标即可收藏
            <br />
            在要点右侧点击书签图标可标记重点条款
          </p>
          <a
            href={href('/library')}
            className="mt-4 inline-block cursor-pointer rounded-xl bg-brand px-4 py-2 text-[13px] font-medium text-white transition-opacity duration-200 hover:opacity-90"
          >
            去指南库看看
          </a>
        </div>
      )}

      {favList.length > 0 && (
        <section>
          <div className="flex items-center gap-2">
            <Star size={15} className="text-warn" />
            <h2 className="text-[14.5px] font-semibold text-ink">
              收藏的指南
              <span className="ml-1.5 text-[12px] font-normal text-ink-3">{favList.length}</span>
            </h2>
            <button
              type="button"
              onClick={() => favorites.clear()}
              className="ml-auto cursor-pointer text-[12px] text-ink-3 transition-colors duration-200 hover:text-danger"
            >
              清空
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {favList.map((g) => (
              <GuidelineCard key={g.id} g={g} />
            ))}
          </div>
        </section>
      )}

      {markedPoints.length > 0 && (
        <section>
          <div className="flex items-center gap-2">
            <Bookmark size={15} className="text-brand" />
            <h2 className="text-[14.5px] font-semibold text-ink">
              标记的要点
              <span className="ml-1.5 text-[12px] font-normal text-ink-3">
                {markedPoints.length}
              </span>
            </h2>
            <button
              type="button"
              onClick={() => marks.clear()}
              className="ml-auto cursor-pointer text-[12px] text-ink-3 transition-colors duration-200 hover:text-danger"
            >
              清空
            </button>
          </div>

          <ul className="mt-3 space-y-2.5">
            {markedPoints.map((m) => (
              <li key={m.key}>
                <a
                  href={href(`/detail/${m.g.id}`)}
                  className="card block cursor-pointer p-3.5 transition-colors duration-200 hover:border-brand/60 active:bg-surface-2"
                >
                  <p className="text-[11.5px] text-ink-3">
                    {m.g.short} · {m.section}
                  </p>
                  <p
                    className={`mt-1.5 text-[13.5px] leading-relaxed ${
                      m.point.key ? 'font-medium text-ink' : 'text-ink-2'
                    }`}
                  >
                    {m.point.t}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
