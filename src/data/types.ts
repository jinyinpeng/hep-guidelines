export type Region = 'cn' | 'intl'

export type DiseaseId =
  | 'hbv'
  | 'hcv'
  | 'masld'
  | 'ald'
  | 'cirrhosis'
  | 'hcc'
  | 'dili'
  | 'autoimmune'
  | 'failure'
  | 'other'

export interface Point {
  /** 要点正文 */
  t: string
  /** 小标签，如「适应证」「一线」「禁忌」 */
  tag?: string
  /** 是否为核心/高频要点 */
  key?: boolean
}

export interface Section {
  title: string
  points: Point[]
}

export interface Guideline {
  id: string
  /** 指南全称 */
  title: string
  /** 卡片短标题 */
  short: string
  /** 发布/制订机构 */
  org: string
  region: Region
  /** 发布或更新年份 */
  year: number
  disease: DiseaseId
  tags: string[]
  /** 一句话定位 */
  summary: string
  /** 出处说明 */
  ref?: string
  /** 原文/摘要链接（离线时仅作记录） */
  url?: string
  /** 是否该领域当前最新版本 */
  latest?: boolean
  sections: Section[]
}

export interface Disease {
  id: DiseaseId
  name: string
  short: string
  desc: string
}
