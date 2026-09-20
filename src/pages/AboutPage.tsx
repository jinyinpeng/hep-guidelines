import {
  Check,
  Download,
  FileText,
  FlaskConical,
  ListFilter,
  RefreshCw,
  ShieldCheck,
  SquarePen,
  Wifi,
  WifiOff,
} from 'lucide-react'
import Disclaimer from '../components/Disclaimer'
import { DEPARTMENTS, RESEARCH_STATS, STATS, countByDept } from '../data'
import { useInstallPrompt, useOnline, useStandalone } from '../lib/pwa'
import { checkForUpdate, useUpdateState, type UpdateState } from '../lib/update'

export default function AboutPage() {
  const online = useOnline()
  const standalone = useStandalone()
  const { canInstall, install } = useInstallPrompt()
  const update = useUpdateState()
  const checking = update.status === 'checking' || update.status === 'updating'

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
          <RefreshCw size={16} className="text-brand" />
          版本与更新
        </h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
          <span className="font-medium text-ink">打开应用时会自动检查更新</span>
          （从后台切回、恢复联网时也会检查一次）；在页面最顶部
          <span className="font-medium text-ink">下拉并松开</span>
          ，同样会检查并更新到最新版。
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Metric label="本机版本" value={shortBuild(update.localId)} />
          <Metric label="线上最新" value={shortBuild(update.remoteId)} />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void checkForUpdate()}
            disabled={checking}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3.5 py-2 text-[12.5px] font-medium text-ink-2 transition-colors duration-200 hover:border-line-strong hover:text-ink disabled:cursor-default disabled:opacity-60"
          >
            <RefreshCw size={14} className={checking ? 'animate-spin' : undefined} />
            {checking ? '正在检查…' : '检查更新'}
          </button>
          <span className="text-[12px] text-ink-3">{statusText(update)}</span>
        </div>

        <p className="mt-2.5 text-[11.5px] leading-relaxed text-ink-3">
          {update.builtAt
            ? `线上版本构建于 ${formatTime(update.builtAt)}`
            : '版本号取自构建产物文件名（带内容哈希），文件名变了就是有新版本。'}
          {update.checkedAt ? ` · 上次检查 ${formatDateTime(update.checkedAt)}` : ''}
        </p>
      </section>

      <section className="card p-4">
        <h2 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
          <FlaskConical size={16} className="text-accent" />
          指南共识 ⇄ 顶刊前沿
        </h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
          顶部有一个
          <span className="font-medium text-ink">「指南共识 / 顶刊前沿」切换按钮</span>
          ，点一下即可在两套内容间切换（切换后科室、首页、顶刊库都会跟着变，选择会记住）。
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
          顶刊前沿除按科室与期刊浏览外，还提供
          <span className="font-medium text-ink">「按期次浏览」</span>
          ：可以看到某本顶刊每一期收录的临床研究；也可以切到「按时间」，把同一期各刊的研究放在一起看。
          <a
            href="#/issues"
            className="ml-1 cursor-pointer text-accent transition-opacity duration-200 hover:opacity-80"
          >
            进入按期次浏览 →
          </a>
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Metric label="研究条目" value={`${RESEARCH_STATS.total} 条`} />
          <Metric label="近一年" value={`${RESEARCH_STATS.inWindow} 条`} />
          <Metric label="可能改变实践" value={`${RESEARCH_STATS.practice} 条`} />
          <Metric label="来源期刊" value={`${RESEARCH_STATS.journals} 种`} />
          <Metric label="综合顶刊" value={`${RESEARCH_STATS.top} 条`} />
          <Metric label="本领域顶刊" value={`${RESEARCH_STATS.field} 条`} />
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-2">
          <span className="font-medium text-ink">期刊口径不只看新英格兰等综合顶刊</span>
          ：每个科室的本领域顶刊同样收录，并单独标注，例如肝病科的
          <span className="font-medium text-ink">Hepatology、J Hepatol</span>
          ，血液科的
          <span className="font-medium text-ink">Blood、Lancet Haematol</span>
          ，消化科的
          <span className="font-medium text-ink">Gut、Gastroenterology</span>
          ，心血管的
          <span className="font-medium text-ink">Circulation、Eur Heart J、J Am Coll Cardiol</span>
          ，肾脏的
          <span className="font-medium text-ink">Kidney Int、J Am Soc Nephrol</span>
          ，外科的
          <span className="font-medium text-ink">Ann Surg</span>
          等。期刊按三档登记：
          <span className="font-medium text-ink">综合顶刊 / 本领域顶刊 / 权威期刊</span>
          ，可按层级筛选。
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
          收录以
          <span className="font-medium text-ink">随机对照试验、前瞻性队列与荟萃分析</span>
          为主，标注期刊、发表年月、研究设计与样本量；只关注阳性结果容易失真，因此中性/阴性研究同样收录，
          影响程度另按「可能改变实践 / 有前景待验证 / 探索性」标注。
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
          每条研究都写清了
          <span className="font-medium text-ink">
            入组人群、干预与对照、主要终点、统计与分析
          </span>
          四项方法学要素——同一条阳性结果，在优效性与非劣效性设计、硬终点与替代终点之间分量完全不同。
          <a
            href="#/methods"
            className="ml-1 cursor-pointer text-accent transition-opacity duration-200 hover:opacity-80"
          >
            研究方法速读 →
          </a>
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
          研究按发表时间由近及远排列，
          <span className="font-medium text-ink">默认只看「近一年」</span>
          ，可切换到「近两年 / 全部」；还可按期刊与「影响程度」（可能改变实践 / 有前景待验证 / 探索性）筛选。
        </p>
        <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-[11.5px] leading-relaxed text-ink-3">
          研究结论
          <span className="text-ink-2">不等于临床推荐</span>
          ，条目为结果要点摘编，具体数值、亚组与安全性请核对原文全文；是否改变本机构流程需经多学科讨论与指南更新确认。
        </p>
      </section>

      <section className="card p-4">
        <h2 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
          <FileText size={16} className="text-brand" />
          收录概览（指南共识）
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Metric label="临床科室" value={`${STATS.depts} 个`} />
          <Metric label="指南与共识" value={`${STATS.total} 部`} />
          <Metric label="要点条目" value={`${STATS.points} 条`} />
          <Metric label="国内 / 国际" value={`${STATS.cn} / ${STATS.intl}`} />
          <Metric label="当前最新版本" value={`${STATS.latest} 部`} />
          <Metric label="覆盖版次年" value={`至 ${STATS.year} 年`} />
          <Metric label="含证据等级的指南" value={`${STATS.graded} 部`} />
          <Metric label="已标注等级要点" value={`${STATS.gradedPoints} 条`} />
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
          <ShieldCheck size={16} className="text-brand" />
          证据等级怎么看
        </h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
          各指南体系不同，本应用一律
          <span className="font-medium text-ink">按原文照录</span>
          ，并在详情页「来源与版本」注明该指南采用的是哪一种。常见四类：
        </p>
        <ul className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-ink-2">
          <li>
            <span className="font-medium text-ink">推荐类别 + 证据级别（I/IIa/IIb/III + A/B/C）</span>
            <br />
            多见于心血管领域（ESC/AHA 及中国心血管病系列指南）。类别数字越小推荐越强，A 级证据最充分。
          </li>
          <li>
            <span className="font-medium text-ink">GRADE（证据质量 高/中/低/极低 + 推荐强度 强/弱）</span>
            <br />
            把「证据质量」与「推荐强度」分开评定，多用于消化、感染、重症等领域。
          </li>
          <li>
            <span className="font-medium text-ink">KDIGO（推荐强度 1/2 + 证据质量 A/B/C/D）</span>
            <br />
            肾脏领域专用：1 表示「推荐」，2 表示「建议」，D 级表示证据极低。
          </li>
          <li>
            <span className="font-medium text-ink">牛津 CEBM（1a/1b/2a/2b/3/4）</span>
            <br />
            按研究设计分层，1a 为随机对照试验的系统评价。
          </li>
        </ul>
        <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-[11.5px] leading-relaxed text-ink-3">
          部分指南与专家共识只给出推荐意见而未分级，这类条目不作标注——
          <span className="text-ink-2">「未标注」不等于「无等级」</span>
          。若需引用具体等级，请回查原文。
        </p>
      </section>

      <section className="card p-4">
        <h2 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
          <SquarePen size={16} className="text-brand" />
          使用与核对建议
        </h2>
        <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-ink-2">
          <li>· 打开应用会自动检查更新；在页面顶部下拉并松开，也能立刻更新到最新版。</li>
          <li>· 顶部「指南共识 / 顶刊前沿」按钮一键切换两套内容；顶刊前沿可按「近一年 / 近两年 / 近三年 / 全部」、期刊层级（综合顶刊 / 本领域顶刊 / 权威期刊）、期刊与影响程度筛选。</li>
          <li>· 顶刊前沿支持「按期次浏览」：按期刊逐期看，或按时间把同一期各刊的研究合并看；期次按公开发表月份归期，不等于期刊卷期号。</li>
          <li>· 首页搜索支持病种、药物、指标、阈值等多关键词组合，例如「乙肝 停药」「腹水 白蛋白」；顶刊前沿同样支持跨科室检索，方法学字段（人群、终点）也可检出。</li>
          <li>· 指南库可按「国内 / 国际」与病种筛选；收藏与标记会保存在本机，不上传服务器（指南与研究分别收藏）。</li>
          <li>· 标记「最新版」表示该条目为当前收录范围内的最新版本，仍可能与实际发布存在时间差。</li>
          <li>· 部分国际指南为持续更新（如 AASLD/IDSA HCV Guidance）或定期修订，引用前请访问官网确认版本号与发布日期。</li>
          <li>· 推荐等级与证据级别按原文照录，且仅在该指南明确给出时标注；涉及用药剂量、疗程、禁忌时务必回查原文。</li>
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

/** index-a1b2c3d4.js → a1b2c3d4，读起来更像版本号 */
function shortBuild(id: string | null): string {
  if (!id) return '开发预览'
  return id.replace(/^index-/, '').replace(/\.js$/, '')
}

function statusText(u: UpdateState): string {
  switch (u.status) {
    case 'checking':
      return '正在检查…'
    case 'updating':
      return '发现新版本，正在更新…'
    case 'latest':
      return '已是最新版本'
    case 'stale':
      return '线上有新版本但还没生效，稍后可再试'
    case 'offline':
      return '当前离线，无法检查更新'
    case 'error':
      return '检查失败，请稍后再试'
    default:
      return u.localId ? '尚未检查' : '开发模式不检查版本'
  }
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString('zh-CN', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
