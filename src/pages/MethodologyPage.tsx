import {
  ArrowDownUp,
  Binary,
  FlaskConical,
  Layers,
  Percent,
  Scale,
  Sigma,
  TriangleAlert,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import Disclaimer from '../components/Disclaimer'
import { DATA_CUTOFF, IMPACT_LEVELS, TIER_LABEL } from '../data'
import { href } from '../lib/router'

/**
 * 研究方法学速读页。
 * 目的：让「研究设计 / 研究方法」这些字段真的能被用起来——
 * 同一条阳性结果，在不同设计、不同终点、不同统计假设下的证据分量差别极大。
 */
export default function MethodologyPage() {
  return (
    <article className="animate-rise space-y-5">
      <section className="card p-4">
        <h2 className="flex items-center gap-2 text-[16px] font-bold tracking-tight text-ink">
          <FlaskConical size={17} className="text-accent" />
          怎么看一项临床研究的方法
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
          研究条目里的「研究方法」固定写四件事：
          <strong className="font-semibold text-ink">入组人群</strong>、
          <strong className="font-semibold text-ink">干预与对照</strong>、
          <strong className="font-semibold text-ink">主要终点</strong>、
          <strong className="font-semibold text-ink">统计与分析</strong>。
          这四件事决定了结果能不能外推到你自己床边的患者。
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
          下面按「先看设计、再看终点、最后看分析」的顺序给出速读要点。
        </p>
      </section>

      <Section Icon={Layers} title="一、证据层级：先看设计类型">
        <p className="text-[13px] leading-relaxed text-ink-2">
          大体顺序（同领域、同类问题下比较）：
        </p>
        <ol className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-ink-2">
          {[
            '随机对照试验的系统评价 / 个体数据荟萃分析',
            '大样本、多中心、随机对照试验（RCT）',
            '前瞻性队列研究（有对照、有随访）',
            '病例对照研究、回顾性队列',
            '单臂研究、Ⅱ 期、机制研究、病例系列',
          ].map((t, i) => (
            <li key={t} className="flex gap-2">
              <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold tabular-nums text-brand-ink">
                {i + 1}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <Tip>
          层级只说明「设计强度」，不保证结论正确：一个设计精良的 RCT 仍然可能因为人群太窄、
          随访太短、终点太软而无法外推。
        </Tip>
      </Section>

      <Section Icon={Users} title="二、入组人群：结果能外推到谁">
        <Bullets
          items={[
            '关键入选条件（年龄、疾病严重度、合并症、既往治疗）决定了「结果只属于谁」。',
            '排除标准越严（如排除肾功能不全、老年人、多病共存者），越贴近理想患者、越远离真实病房。',
            '要看你自己的患者是否落在入组范围内——注册研究常提示实际人群比试验人群更重、更杂。',
            '真实世界队列（登记研究）在这一维度上优势明显，但代价是混杂因素更多。',
          ]}
        />
      </Section>

      <Section Icon={ArrowDownUp} title="三、干预与对照：比的是什么">
        <Bullets
          items={[
            '对照是安慰剂、旧标准治疗还是「最佳支持治疗」，直接决定结论是「有效」还是「更有效」。',
            '开放标签（未设盲）在主观终点（症状评分、生活质量）上容易高估疗效。',
            '背景治疗是否一致（两组是否都用了标准治疗）决定了研究回答的是「替代」还是「叠加」。',
            '剂量、疗程、给药途径与真实用法一致时，结论才可直接套用。',
          ]}
        />
      </Section>

      <Section Icon={Scale} title="四、主要终点：硬终点还是替代终点">
        <div className="mt-1 grid gap-2">
          <div className="rounded-xl border border-line bg-surface-2 px-3 py-2.5">
            <p className="text-[12.5px] font-semibold text-ink">硬终点（更可信）</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">
              死亡、心肌梗死、卒中、肾衰竭、住院、骨折等患者真正能感受到的事件。
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 px-3 py-2.5">
            <p className="text-[12.5px] font-semibold text-ink">替代终点（需谨慎）</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">
              化验或影像指标，如 HbA1c、LDL-C、蛋白尿、肿瘤缩小率、eGFR 斜率。
              替代终点改善不等于患者获益——历史上多次出现「指标变好、结局变差」。
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 px-3 py-2.5">
            <p className="text-[12.5px] font-semibold text-ink">复合终点</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">
              由多个事件组成。要看清各成分方向是否一致——若主要由「软」成分驱动，
              需回到各组分结果再判断。
            </p>
          </div>
        </div>
        <Tip>
          另需注意随访时长与主要终点评估时点：很多「短期替代终点阳性」的研究，
          在 1–2 年生存终点上并没有获益。
        </Tip>
      </Section>

      <Section Icon={Sigma} title="五、统计与分析：优效、非劣效与 ITT">
        <Bullets
          items={[
            '优效性设计：证明试验组优于对照，是最常见的假设。',
            '非劣效性设计：证明「不差于」对照，必须预先设定非劣效界值。界值定得越宽，越容易得出「不劣」的结论，也越容易掩盖真实劣势。',
            '事件驱动设计：以累积事件数决定何时揭盲，随访时间随事件率变化；需注意是否提前终止。',
            '意向性分析（ITT）：所有随机化者按原分组分析，最贴近真实世界的「打算治」效果；符合方案分析（PP）会高估疗效。',
            '缺失数据处理与多重比较校正：缺失越多、比较次数越多，结果越需要保守解读。',
          ]}
        />
      </Section>

      <Section Icon={Binary} title="六、提前终止与亚组分析：最容易误读的两处">
        <Bullets
          items={[
            '因疗效显著而提前终止的研究，效应量常被高估（随机高估效应）；生存曲线后半段往往比预期平缓。',
            '亚组分析属于探索性结果，除非预设且交互作用检验显著，否则不应直接用于选人用药。',
            '「达到主要终点」不等于「临床意义足够」——要看绝对差值、需治疗人数（NNT）与不良反应的代价。',
          ]}
        />
      </Section>

      <Section Icon={Percent} title="七、观察性研究：能提问题，较难定因果">
        <Bullets
          items={[
            '队列与登记研究适合回答「真实世界怎么用、用得怎么样」，以及罕见不良反应。',
            '混杂、适应证偏倚、健康使用者效应是主要威胁；倾向性评分只能校正「测得到」的混杂。',
            '看到「显著相关」先问：是否存在反向因果、是否只是替代了真实原因。',
          ]}
        />
      </Section>

      <Section Icon={Layers} title="八、本库是怎么标的">
        <Bullets
          items={[
            `期刊层级：${TIER_LABEL.top}（NEJM / Lancet / JAMA / BMJ / Nature 系列等）、${TIER_LABEL.field}（各专科本领域顶刊，如 Hepatology、Blood、Gut、Circulation）、${TIER_LABEL.major}（领域权威期刊）。层级只代表「发表在哪儿」，不代表结论强度。`,
            '研究设计：一句话概括，如「多中心随机双盲 Ⅲ 期」「前瞻性队列」。',
            '研究方法：人群 / 干预与对照 / 主要终点 / 统计与分析四项。',
            `影响程度：${IMPACT_LEVELS.map((l) => `${l.label}（${l.desc}）`).join('；')}。`,
            '结果、临床意义与「与现行指南的关系」是编辑摘编，用于快速判断「这条消息值不值得深读」，不能替代原文。',
          ]}
        />
        <p className="mt-2.5 rounded-xl bg-surface-2 px-3 py-2 text-[12px] leading-relaxed text-ink-3">
          当前数据截至 {DATA_CUTOFF.replace('-', '.')}。要让一条研究真正进入本机构流程，
          至少还应核对：原文全文与补充材料、是否预设终点、是否有多中心重复验证、
          是否有指南或共识据此更新。
        </p>
      </Section>

      <section className="rounded-[14px] border border-warn/25 bg-warn-soft p-4">
        <h2 className="flex items-center gap-2 text-[14px] font-semibold text-warn">
          <TriangleAlert size={16} />
          一句话总结
        </h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
          先看设计能否回答这个问题，再看终点的「硬」与「软」，最后看分析假设是优效还是非劣效、有没有提前终止。
          三步之外，还要问一句：
          <strong className="font-semibold text-ink">我的患者和我的场景，与这项研究差多远？</strong>
        </p>
      </section>

      <div className="text-center">
        <a
          href={href('/')}
          className="inline-block cursor-pointer rounded-xl border border-line bg-surface px-4 py-2 text-[13px] font-medium text-ink-2 transition-colors duration-200 hover:border-line-strong hover:text-ink"
        >
          返回研究首页
        </a>
      </div>

      <Disclaimer />
    </article>
  )
}

function Section({
  Icon,
  title,
  children,
}: {
  Icon: typeof FlaskConical
  title: string
  children: ReactNode
}) {
  return (
    <section className="card p-4">
      <h3 className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
        <Icon size={16} className="text-accent" />
        {title}
      </h3>
      <div className="mt-2.5 space-y-2">{children}</div>
    </section>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-ink-2">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1 rounded-xl bg-surface-2 px-3 py-2 text-[11.5px] leading-relaxed text-ink-3">
      {children}
    </p>
  )
}
