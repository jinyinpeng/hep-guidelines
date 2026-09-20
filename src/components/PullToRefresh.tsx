import { AlertCircle, ArrowDown, Check, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { checkForUpdate } from '../lib/update'

/** 触发刷新的下拉距离 */
const THRESHOLD = 68
/** 最大可下拉距离 */
const MAX_PULL = 112
/** 阻尼系数，让下拉跟手但不过分 */
const RESISTANCE = 0.55
/** 结果提示停留时长 */
const HOLD_MS = 900

type Phase = 'idle' | 'pulling' | 'busy' | 'done' | 'fail'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 顶部下拉刷新。
 * 只有在页面已经滚到最顶部、并且是竖直方向下拉时才会接管手势，
 * 松手越过阈值即检查线上版本：有新版本就直接重载到最新版，没有则提示「已是最新版本」。
 */
export default function PullToRefresh({ children }: { children: ReactNode }) {
  const [pull, setPull] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [message, setMessage] = useState('')

  const gesture = useRef<'idle' | 'armed' | 'pull' | 'busy'>('idle')
  const origin = useRef({ x: 0, y: 0 })
  const pullRef = useRef(0)

  useEffect(() => {
    const move = (value: number) => {
      pullRef.current = value
      setPull(value)
    }

    const onStart = (e: TouchEvent) => {
      if (gesture.current === 'busy') return
      if (window.scrollY > 1) return
      const t = e.touches[0]
      if (!t) return
      origin.current = { x: t.clientX, y: t.clientY }
      gesture.current = 'armed'
    }

    const onMove = (e: TouchEvent) => {
      const mode = gesture.current
      if (mode !== 'armed' && mode !== 'pull') return
      const t = e.touches[0]
      if (!t) return

      const dy = t.clientY - origin.current.y
      const dx = Math.abs(t.clientX - origin.current.x)

      if (mode === 'armed') {
        if (dy < -6) {
          gesture.current = 'idle'
          return
        }
        if (dy < 6) return
        // 横向滑动（病种筛选条等）或页面已经滚下去，都不算下拉刷新
        if (dx > dy || window.scrollY > 1) {
          gesture.current = 'idle'
          return
        }
        gesture.current = 'pull'
        setPhase('pulling')
      }

      // 只在真正下拉时阻止默认行为，避免影响正常滚动
      if (e.cancelable) e.preventDefault()
      move(Math.min(MAX_PULL, dy * RESISTANCE))
    }

    const onEnd = () => {
      if (gesture.current === 'armed') {
        gesture.current = 'idle'
        return
      }
      if (gesture.current !== 'pull') return

      if (pullRef.current < THRESHOLD) {
        gesture.current = 'idle'
        setPhase('idle')
        move(0)
        return
      }

      gesture.current = 'busy'
      setPhase('busy')
      move(THRESHOLD)
      void settle()
    }

    const settle = async () => {
      const result = await checkForUpdate()
      // 有新版本时页面马上会重载，这里不需要再收起
      if (result === 'updated') return

      setMessage(
        result === 'offline'
          ? '当前离线，无法检查更新'
          : result === 'error'
            ? '检查更新失败，请稍后再试'
            : '已是最新版本',
      )
      setPhase(result === 'latest' || result === 'skipped' ? 'done' : 'fail')
      await sleep(HOLD_MS)
      setPhase('idle')
      move(0)
      gesture.current = 'idle'
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd, { passive: true })
    window.addEventListener('touchcancel', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
    }
  }, [])

  const progress = Math.min(1, pull / THRESHOLD)
  const open = pull > 0 || phase === 'busy' || phase === 'done' || phase === 'fail'

  let icon = (
    <ArrowDown
      size={14}
      className="text-ink-3"
      style={{ transform: `rotate(${progress * 180}deg)` }}
    />
  )
  let label = '下拉更新'

  if (phase === 'busy') {
    icon = <Loader2 size={14} className="animate-spin text-brand" />
    label = '正在检查更新…'
  } else if (phase === 'done') {
    icon = <Check size={14} className="text-brand" />
    label = message
  } else if (phase === 'fail') {
    icon = <AlertCircle size={14} className="text-warn" />
    label = message
  } else if (pull >= THRESHOLD) {
    label = '松开更新到最新版'
  }

  return (
    <>
      <div
        aria-hidden={!open}
        className="pointer-events-none fixed left-1/2 top-0 z-50"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          transform: `translate(-50%, ${Math.round(pull) - 56}px)`,
          opacity: open ? Math.min(1, Math.max(0.2, pull / 28)) : 0,
          transition:
            phase === 'pulling' ? 'none' : 'transform 0.26s ease, opacity 0.26s ease',
        }}
      >
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-2 shadow-[0_8px_24px_-12px_rgba(16,32,44,0.45)]"
        >
          {icon}
          <span>{label}</span>
        </div>
      </div>

      {children}
    </>
  )
}
