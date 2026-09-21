import { Bookmark, FlaskConical, Star } from 'lucide-react'
import { useMemo } from 'react'
import FindingCard from '../components/FindingCard'
import GuidelineCard from '../components/GuidelineCard'
import { getFinding, getGuideline } from '../data'
import type { DeptId } from '../data'
import { useDataVersion, useDeptsSections } from '../lib/data-hooks'
import { href } from '../lib/router'
import { parsePointKey, useStore } from '../lib/store'

export default function FavoritesPage() {
  const { favorites, rfavorites, marks } = useStore()
  // 标记的要点正文按科室分片，订阅数据版本以便分片到位后自动补全
  useDataVersion()

  const favList = favorites.items
    .map((id) => getGuideline(id))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  const favFindings = rfavorites.items
    .map((id) => getFinding(id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))

  /** 收藏的指南与标记的要点可能分散在多个科室，按需补齐这些科室的正文 */
  const depts = useMemo(() => {
    const set = new Set<DeptId>()
    for (const g of favList) set.add(g.dept)
    for (const key of marks.items) {
      const parsed = parsePointKey(key)
      const gid = parsed?.[0]
      if (!gid) continue
      const dept = getGuideline(gid)?.dept
      if (dept) set.add(dept)
    }
    return [...set]
  }, [favList, marks.items])

  useDeptsSections(depts)

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
    <div className="space-y-6">
      {favList.length === 0 && favFindings.length === 0 && markedPoints.length === 0 && (
        <div className="card p-8 text-center">
          <Star size={26} className="mx-auto text-line-strong" />
          <p className="mt-3 text-[15px] font-medium text-ink">还没有收藏内容</p>
          <p className="mt-1.5 text-[13.5px] leading-[1.7] text-ink-3">
            在指南卡片或详情页点击星标即可收藏
            <br />
            切到「顶刊前沿」也能收藏顶刊研究，在要点右侧点击书签图标可标记重点条款
          </p>
          <a
            href={href('/library')}
            className="mt-4 inline-block cursor-pointer rounded-xl bg-brand px-4 py-2 text-[15px] font-medium text-white transition-opacity duration-200 hover:opacity-90"
          >
            去内容库看看
          </a>
        </div>
      )}

      {favList.length > 0 && (
        <section>
          <div className="flex items-center gap-2">
            <Star size={15} className="text-warn" />
            <h2 className="text-[16.5px] font-semibold text-ink">
              收藏的指南
              <span className="ml-1.5 text-[13.5px] font-normal text-ink-3">{favList.length}</span>
            </h2>
            <button
              type="button"
              onClick={() => favorites.clear()}
              className="ml-auto cursor-pointer text-[13.5px] text-ink-3 transition-colors duration-200 hover:text-danger"
            >
              清空
            </button>
          </div>
          <div className="mt-3 space-y-4">
            {favList.map((g) => (
              <GuidelineCard key={g.id} g={g} />
            ))}
          </div>
        </section>
      )}

      {favFindings.length > 0 && (
        <section>
          <div className="flex items-center gap-2">
            <FlaskConical size={15} className="text-accent" />
            <h2 className="text-[16.5px] font-semibold text-ink">
              收藏的研究
              <span className="ml-1.5 text-[13.5px] font-normal text-ink-3">{favFindings.length}</span>
            </h2>
            <button
              type="button"
              onClick={() => rfavorites.clear()}
              className="ml-auto cursor-pointer text-[13.5px] text-ink-3 transition-colors duration-200 hover:text-danger"
            >
              清空
            </button>
          </div>
          <div className="mt-3 space-y-4">
            {favFindings.map((f) => (
              <FindingCard key={f.id} f={f} />
            ))}
          </div>
        </section>
      )}

      {markedPoints.length > 0 && (
        <section>
          <div className="flex items-center gap-2">
            <Bookmark size={15} className="text-brand" />
            <h2 className="text-[16.5px] font-semibold text-ink">
              标记的要点
              <span className="ml-1.5 text-[13.5px] font-normal text-ink-3">
                {markedPoints.length}
              </span>
            </h2>
            <button
              type="button"
              onClick={() => marks.clear()}
              className="ml-auto cursor-pointer text-[13.5px] text-ink-3 transition-colors duration-200 hover:text-danger"
            >
              清空
            </button>
          </div>

          <ul className="mt-3 space-y-3">
            {markedPoints.map((m) => (
              <li key={m.key}>
                <a
                  href={href(`/detail/${m.g.id}`)}
                  className="card block cursor-pointer p-3.5 transition-colors duration-200 hover:border-brand/60 active:bg-surface-2"
                >
                  <p className="text-[12.5px] text-ink-3">
                    {m.g.short} · {m.section}
                  </p>
                  <p
                    className={`mt-1.5 text-[15px] leading-[1.7] ${
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
