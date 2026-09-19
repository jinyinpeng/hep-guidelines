import { TriangleAlert } from 'lucide-react'

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="mt-6 flex gap-2 text-[11.5px] leading-relaxed text-ink-3">
        <TriangleAlert size={14} className="mt-[2px] shrink-0" />
        <span>内容为指南共识要点摘编，仅供临床参考与速查，不作为诊疗依据；请以官方发布的最新版原文为准。</span>
      </p>
    )
  }

  return (
    <section className="rounded-[14px] border border-warn/25 bg-warn-soft p-4">
      <h2 className="flex items-center gap-2 text-[14px] font-semibold text-warn">
        <TriangleAlert size={16} />
        重要提示
      </h2>
      <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-ink-2">
        <li>· 本库为指南与共识的要点摘编，用于快速查阅与教学参考，<strong className="font-semibold text-ink">不能替代原文，也不构成诊疗建议</strong>。</li>
        <li>· 各指南/共识版本持续更新，引用其推荐等级（如 1A、A1）时请务必核对官方正式发布版本。</li>
        <li>· 临床决策须结合患者具体情况、本院条件与药品说明书，并遵循所在机构诊疗规范。</li>
      </ul>
    </section>
  )
}
