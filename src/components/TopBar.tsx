import { ChevronLeft, Moon, Sun, WifiOff } from 'lucide-react'
import { useOnline } from '../lib/pwa'
import { useTheme } from '../lib/storage'
import ModeSwitch from './ModeSwitch'

interface Props {
  title?: string
  subtitle?: string
  onBack?: () => void
}

export default function TopBar({ title, subtitle, onBack }: Props) {
  const { dark, toggle } = useTheme()
  const online = useOnline()

  return (
    <header className="safe-top sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[760px] items-center gap-3 px-4 py-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="返回"
            className="-ml-2 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-2 transition-colors duration-200 hover:bg-surface-3 hover:text-ink"
          >
            <ChevronLeft size={22} />
          </button>
        ) : (
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand text-[15px] font-semibold text-white"
          >
            临
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold leading-tight tracking-tight text-ink">
            {title ?? '临床指南要点库'}
          </h1>
          <p className="truncate text-[11.5px] leading-tight text-ink-3">
            {subtitle ?? '国内外指南共识 · 要点速查'}
          </p>
        </div>

        {!online && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-warn-soft px-2 py-1 text-[11px] font-medium text-warn">
            <WifiOff size={13} />
            离线
          </span>
        )}

        <button
          type="button"
          onClick={toggle}
          aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-2 transition-colors duration-200 hover:bg-surface-3 hover:text-ink"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* 一键切换：指南共识 ⇄ 各科室顶刊最新研究 */}
      <div className="mx-auto w-full max-w-[760px] px-4 pb-2.5">
        <ModeSwitch />
      </div>
    </header>
  )
}
