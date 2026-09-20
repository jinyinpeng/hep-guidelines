import type { DeptId } from '../types'

/**
 * 研究对临床实践的影响程度。
 * - practice      可能改变实践：阳性结果、终点硬、样本量足够，指南很可能据此更新
 * - promising     有前景但需验证：早期或单臂、替代终点，或需等待更长随访
 * - exploratory   探索性：机制/Ⅱ 期、信号值得关注，暂不改变当前做法
 */
export type ImpactLevel = 'practice' | 'promising' | 'exploratory'

/**
 * 期刊层级（具体哪些期刊属于哪一档，见 journals.ts 的登记表）。
 * - top    综合顶刊：NEJM / Lancet / JAMA / BMJ / Nature 系列等，面向全医学界
 * - field  本领域顶刊：该专科公认第一梯队，如肝病科的 Hepatology / J Hepatol、
 *          血液科的 Blood、消化科的 Gut / Gastroenterology、心血管的 Circulation / EHJ
 * - major  权威期刊：本领域有影响力的大刊与亚专科期刊
 */
export type JournalTier = 'top' | 'field' | 'major'

/**
 * 研究方法要素。
 *
 * 为什么单独拆出来：同样的「阳性结果」，在优效性 RCT 与非劣效性 RCT、
 * 硬终点与替代终点、意向性分析与符合方案分析之间，可信度差别很大。
 * 只写一句「随机对照」不足以判断能不能改变自己的做法，
 * 所以把方法学的四个关键点固定下来逐条填写。
 */
export interface StudyMethod {
  /** 入组人群与关键入选 / 排除条件 */
  population: string
  /** 干预与对照（观察性研究写暴露与对照） */
  arms: string
  /** 主要终点（含随访时点） */
  endpoint: string
  /** 统计设计与分析：优效 / 非劣效 / 事件驱动，ITT 或 PP 等 */
  stats: string
}

/** 一条顶刊临床研究发现 */
export interface Finding {
  /** 全局唯一，形如 r-cardio-01 */
  id: string
  /** 所属临床科室 */
  dept: DeptId
  /** 亚病种 / 亚专业，取值同本科室 topics.ts */
  topic?: string
  /** 中文标题（编辑拟写，便于速览） */
  title: string
  /** 英文原名（可选） */
  en?: string
  /** 期刊简称，如 NEJM / Lancet / Hepatology / Blood —— 层级由 journals.ts 统一决定 */
  journal: string
  /** 发表日期 YYYY-MM */
  date: string
  /** 研究设计的一句话概括，如「多中心随机双盲 Ⅲ 期」「前瞻性队列」 */
  design: string
  /** 研究方法要素：人群、干预与对照、主要终点、统计分析 */
  method?: StudyMethod
  /** 样本量，原样照录，如「4,200 例」；原文未明确时不填 */
  n?: string
  /** 主要结果，2–4 条 */
  results: string[]
  /** 一句话临床意义 */
  impact: string
  /** 影响程度 */
  level: ImpactLevel
  /** 与现行指南/实践的关系（可选） */
  vsGuide?: string
  tags: string[]
  /** 原文链接（期刊页 / DOI / PubMed 检索页） */
  url?: string
  /** 是否重点推荐（首页优先展示） */
  key?: boolean
}
