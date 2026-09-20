import { BookOpenText, FlaskConical } from 'lucide-react'
import { MODE_LABEL, toggleMode, useMode, type Mode } from '../lib/mode'
import { navigate } from '../lib/router'

const OPTIONS: { id: Mode; Icon: typeof BookOpenText }[] = [
  { id: 'guide', Icon: BookOpenText },
  { id: 'research', Icon: FlaskConical },
]

/**
 * 「指南共识 / 顶刊前沿」一键切换。
 * 放在顶栏，任何页面都能一次点击切换全局内容视图。
 */
export default function ModeSwitch() {
  const mode = useMode()

  const pick = (next: Mode) => {
    if (next === mode) return
    toggleMode()
    // 处在内容详情页时，切换模式后回到首页，避免看到「另一套内容」的详情
    const hash = window.location.hash.replace(/^#/, '')
    if (/^\/(detail|finding)\//.test(hash)) navigate('/')
  }

  return (
    <div
      role="tablist"
      aria-label="内容模式切换"
      className="relative flex w-full rounded-full border border-line bg-surface-2 p-1"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-brand shadow-sm transition-transform duration-250 ease-out"
        style={{ transform: mode === 'research' ? 'translateX(calc(100% + 8px))' : 'none' }}
      />
      {OPTIONS.map(({ id, Icon }) => {
        const on = mode === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => pick(id)}
            className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full py-1.5 text-[12.5px] font-medium transition-colors duration-200 ${
              on ? 'text-white' : 'text-ink-2 hover:text-ink'
            }`}
          >
            <Icon size={14} strokeWidth={on ? 2.4 : 2} />
            {MODE_LABEL[id]}
          </button>
        )
      })}
    </div>
  )
}
