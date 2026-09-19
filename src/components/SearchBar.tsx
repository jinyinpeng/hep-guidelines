import { Search, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  autoFocus?: boolean
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  autoFocus,
  placeholder = '搜索指南、病种或要点，如「SBP」「FIB-4」',
}: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
      />
      <input
        ref={ref}
        type="search"
        inputMode="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="搜索指南与要点"
        className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-10 text-[14.5px] text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            ref.current?.focus()
          }}
          aria-label="清空搜索"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-3 transition-colors duration-200 hover:bg-surface-3 hover:text-ink"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
