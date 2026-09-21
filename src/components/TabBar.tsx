import { House, Info, Star } from 'lucide-react'
import { href } from '../lib/router'
import { useStore } from '../lib/store'

const TABS = [
  { key: 'home', to: '/', label: '首页', Icon: House },
  { key: 'favorites', to: '/favorites', label: '收藏', Icon: Star },
  { key: 'about', to: '/about', label: '说明', Icon: Info },
] as const

export default function TabBar({ active }: { active: string }) {
  const { favorites, rfavorites, marks } = useStore()
  const badge = favorites.size + rfavorites.size + marks.size

  return (
    <nav className="safe-bottom no-print fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-surface/92 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[680px] items-stretch">
        {TABS.map(({ key, to, label, Icon }) => {
          const on = active === key
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
              <span className="text-[12.5px] font-medium leading-[1.3]">{label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
