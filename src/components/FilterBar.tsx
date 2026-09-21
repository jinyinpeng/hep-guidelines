import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useState, type ReactNode } from 'react'

/**
 * 筛选区统一容器。
 *
 * 之前是一排排悬浮的芯片行，既看不出「这一排筛的是什么」，纵向也很挤。
 * 现在改为「一张卡片 + 带标签的分组 + 组间分隔」，
 * 并且默认收起：收起时只显示一行筛选摘要，展开后才出现完整分组。
 */
export function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[12.5px] leading-[1.5] text-ink-3">{label}</p>
      <div className="no-scrollbar -mx-1.5 flex gap-2 overflow-x-auto px-1.5 pb-0.5">{children}</div>
    </div>
  )
}

/** 组间分隔：一条细分隔线 + 上下间距 */
export function FilterDivider() {
  return <div className="border-t border-line" />
}

export function FilterPanel({
  summary,
  children,
  defaultOpen = false,
  onReset,
}: {
  /** 收起时显示的一行摘要，例如「近一年 · 全部科室 · 全部期刊」 */
  summary: string
  children: ReactNode
  defaultOpen?: boolean
  onReset?: () => void
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left"
        >
          <SlidersHorizontal size={15} className="shrink-0 text-brand" />
          <span className="shrink-0 text-[15px] font-medium text-ink">筛选</span>
          <span className="min-w-0 flex-1 truncate text-[12.5px] leading-[1.5] text-ink-3">
            {summary}
          </span>
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 cursor-pointer text-[12.5px] text-ink-3 transition-colors duration-200 hover:text-danger"
          >
            重置
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? '收起筛选' : '展开筛选'}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-3 transition-colors duration-200 hover:bg-surface-3 hover:text-ink"
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-line px-5 py-5">
          <div className="space-y-5">{children}</div>
        </div>
      )}
    </section>
  )
}
