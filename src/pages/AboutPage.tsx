import { Check, Download, FileText, ListFilter, SquarePen, Wifi, WifiOff } from 'lucide-react'
import Disclaimer from '../components/Disclaimer'
import { DEPARTMENTS, STATS, countByDept } from '../data'
import { useInstallPrompt, useOnline, useStandalone } from '../lib/pwa'

export default function AboutPage() {
  const online = useOnline()
  const standalone = useStandalone()
  const { canInstall, install } = useInstallPrompt()

  return (
    <div className="space-y-5">
      <section className="card overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              online ? 'bg-brand-soft text-brand' : 'bg-warn-soft text-warn'
            }`}
          >
            {online ? <Wifi size={18} /> : <WifiOff size={18} />}
          </span>
          <div className="min-w-0">
            <h2 className="text-[14.5px] font-semibold text-ink">
              {online ? '已连接网络' : '当前处于离线状态'}
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
              {online
                ? '所有内容已在本机缓存，即使断开网络也能继续查阅与检索。'
                : '正在使用本机缓存的内容，全部指南与检索功能均可正常使用。'}
            </p>
            {!standalone && (
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-3">
                建议「添加到主屏幕」，即可像 App 一样全屏打开、断网可用。
              </p>
            )}
          </div>
        </div>

        {canInstall && (
          <button
            type="button"
            onClick={() => void install()}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 border-t border-line bg-brand-soft py-3 text-[13.5px] font-medium text-brand-ink transition-colors duration-200 hover:bg-brand/15"
          >
            <Download size={16} />
            立即添加到主屏幕
          </button>
        )}
      </section>

      <section className="card p-4">
        <h2 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
          <Download size={16} className="text-brand" />
          如何添加到主屏幕
        </h2>
        <div className="mt-3 space-y-3 text-[12.5px] leading-relaxed text-ink-2">
          <div>
            <p className="font-medium text-ink">iPhone / iPad（Safari）</p>
            <ol className="mt-1 space-y-0.5 text-ink-2">
              <li>1. 点击底部工具栏的「分享」按钮</li>
              <li>2. 向下滑动选择「添加到主屏幕」</li>
              <li>3. 命名后点击「添加」</li>
            </ol>
          </div>
          <div>
            <p className="font-medium text-ink">Android（Chrome / Edge）</p>
            <ol className="mt-1 space-y-0.5 text-ink-2">
              <li>1. 点击右上角「⋮」菜单</li>
              <li>2. 选择「安装应用」或「添加到主屏幕」</li>
              <li>3. 确认安装</li>
            </ol>
          </div>
          <p className="text-[11.5px] text-ink-3">
            添加到主屏后无需应用商店，也不占用额外存储；首次打开会自动缓存全部内容。
          </p>
        </div>
      </section>

      <section className="card p-4">
        <h2 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
          <FileText size={16} className="text-brand" />
          收录概览
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Metric label="临床科室" value={`${STATS.depts} 个`} />
          <Metric label="指南与共识" value={`${STATS.total} 部`} />
          <Metric label="要点条目" value={`${STATS.points} 条`} />
          <Metric label="国内 / 国际" value={`${STATS.cn} / ${STATS.intl}`} />
          <Metric label="当前最新版本" value={`${STATS.latest} 部`} />
          <Metric label="覆盖版次年" value={`至 ${STATS.year} 年`} />
        </div>

        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink">
            <ListFilter size={14} className="text-brand" />
            覆盖科室
          </p>
          <ul className="mt-2 space-y-1">
            {DEPARTMENTS.map((d) => (
              <li key={d.id} className="flex items-baseline gap-2 text-[12.5px] text-ink-2">
                <Check size={13} className="shrink-0 translate-y-[2px] text-brand" />
                <span className="flex-1">{d.name}</span>
                <span className="text-[11px] tabular-nums text-ink-3">{countByDept(d.id)} 部</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card p-4">
        <h2 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
          <SquarePen size={16} className="text-brand" />
          使用与核对建议
        </h2>
        <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-ink-2">
          <li>· 首页搜索支持病种、药物、指标、阈值等多关键词组合，例如「乙肝 停药」「腹水 白蛋白」。</li>
          <li>· 指南库可按「国内 / 国际」与病种筛选；收藏与标记会保存在本机，不上传服务器。</li>
          <li>· 标记「最新版」表示该条目为当前收录范围内的最新版本，仍可能与实际发布存在时间差。</li>
          <li>· 部分国际指南为持续更新（如 AASLD/IDSA HCV Guidance）或定期修订，引用前请访问官网确认版本号与发布日期。</li>
          <li>· 摘编过程中会省略部分限定条件与推荐等级，涉及用药剂量、疗程、禁忌时务必回查原文。</li>
        </ul>
      </section>

      <Disclaimer />

      <p className="pb-2 text-center text-[11px] text-ink-3">
        本应用为纯本地前端，无服务端、无账号体系；所有数据打包在页面内，亦可导出后离线分发。
      </p>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 px-3 py-2.5">
      <div className="text-[15px] font-semibold tabular-nums text-ink">{value}</div>
      <div className="mt-0.5 text-[11px] text-ink-3">{label}</div>
    </div>
  )
}
