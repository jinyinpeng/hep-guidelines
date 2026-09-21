import { House, Info, Library, Star } from 'lucide-react'
import { useMode } from '../lib/mode'
import { href } from '../lib/router'
import { useStore } from '../lib/store'

const TABS = [
  { key: 'home', to: '/', label: '首页', Icon: House },
  { key: 'library', to: '/library', label: '指南库', Icon: Library },
  { key: 'favorites', to: '/favorites', label: '收藏', Icon: Star },
  { key: 'about', to: '/about', label: '说明', Icon: Info },
] as const

/** 「顶刊前沿」模式下第二栏改为顶刊库 */
const RESEARCH_LABEL: Record<string, string> = { library: '顶刊库' }

export default function TabBar({ active }: { active: string }) {
  const { favorites, rfavorites, marks } = useStore()
  const mode = useMode()
  const badge = favorites.size + rfavorites.size + marks.size

  return (
    <nav className="safe-bottom no-print fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-surface/92 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[680px] items-stretch">
        {TABS.map(({ key, to, label, Icon }) => {
          const on =
            active === key ||
            (key === 'library' && (active === 'detail' || active === 'finding'))
          const text = mode === 'research' ? (RESEARCH_LABEL[key] ?? label) : label
          return (
            <a
              key={key}
              href={href(to)}
              aria-current={on ? 'page' : undefined}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-1 pb-2 pt-2.5 transition-colors duration-200 ${
                on ? 'text-brand' : 'text-ink-3 hover:text-ink-2'
              }`}
            >
              <span className="relative">
                <Icon size={21} strokeWidth={on ? 2.3 : 1.9} />
                {key === 'favorites' && badge > 0 && (
                  <span className="absolute -right-2.5 -top-1 min-w-[15px] rounded-full bg-brand px-[4px] text-center text-[10px] font-semibold leading-[15px] text-white">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </span>
              <span className="text-[12.5px] font-medium leading-[1.3]">{text}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
