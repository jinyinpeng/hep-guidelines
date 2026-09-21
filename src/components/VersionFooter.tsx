import { RefreshCw } from 'lucide-react'
import { href } from '../lib/router'
import {
  buildTime,
  checkForUpdate,
  formatBuildTime,
  shortBuild,
  statusText,
  useUpdateState,
} from '../lib/update'

/**
 * 页面底部的版本条。
 *
 * 版本号取自构建产物文件名里的内容哈希（index-<hash>.js），
 * 所以「看到什么版本号」就等于「本机正在跑哪份构建」，不需要服务端。
 * 构建时间由 vite 的 define 注入，离线、未联网检查时也能显示。
 */
export default function VersionFooter() {
  const update = useUpdateState()
  const checking = update.status === 'checking' || update.status === 'updating'

  const local = shortBuild(update.localId)
  const remote = update.remoteId ? shortBuild(update.remoteId) : null
  const behind = Boolean(remote && update.localId && update.remoteId !== update.localId)
  const built = formatBuildTime(update.builtAt ?? buildTime())

  return (
    <footer className="no-print mt-8 border-t border-line pb-28 pt-4 text-center">
      <p className="text-[12.5px] leading-[1.7] tabular-nums text-ink-3">
        版本 <span className="font-semibold text-ink-2">{local}</span>
        {behind && remote && (
          <>
            {' · '}线上 <span className="font-semibold text-ink-2">{remote}</span>
          </>
        )}
      </p>
      <p className="mt-1 text-[12.5px] leading-[1.7] tabular-nums text-ink-3">
        构建 {built} · {statusText(update)}
      </p>

      <div className="mt-2.5 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => void checkForUpdate()}
          disabled={checking}
          className="flex cursor-pointer items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium text-ink-2 transition-colors duration-200 hover:border-line-strong hover:text-ink disabled:cursor-default disabled:opacity-60"
        >
          <RefreshCw size={12} className={checking ? 'animate-spin' : undefined} />
          {checking ? '检查中…' : '检查更新'}
        </button>
        <a
          href={href('/about')}
          className="cursor-pointer rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium text-ink-2 transition-colors duration-200 hover:border-line-strong hover:text-ink"
        >
          版本与更新说明
        </a>
      </div>
    </footer>
  )
}
