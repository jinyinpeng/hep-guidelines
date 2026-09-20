export type Region = 'cn' | 'intl'

/** 临床科室 */
export type DeptId =
  // 内科系
  | 'hepatology'
  | 'cardio'
  | 'resp'
  | 'gi'
  | 'renal'
  | 'heme'
  | 'endo'
  | 'rheum'
  | 'neuro'
  | 'infectious'
  | 'oncology'
  | 'geriatrics'
  | 'psychiatry'
  | 'derm'
  // 外科系
  | 'gensurg'
  | 'ortho'
  | 'neurosurg'
  | 'urology'
  | 'cts'
  | 'vascular'
  // 妇产与儿科
  | 'obgyn'
  | 'peds'
  // 急危重症与麻醉
  | 'emergency'
  | 'icu'
  | 'anes'
  // 专科与其他
  | 'ophtho'
  | 'ent'
  | 'stomatology'
  | 'rehab'
  | 'pain'

/** 科室分组，用于导航归类 */
export type DeptGroup = 'internal' | 'surgery' | 'womenChild' | 'critical' | 'specialty'

export interface Point {
  /** 要点正文 */
  t: string
  /** 小标签，如「适应证」「一线」「禁忌」 */
  tag?: string
  /** 是否为核心/高频要点 */
  key?: boolean
  /**
   * 推荐强度 / 推荐类别，一律按原指南的写法记录，如 'I'、'IIa'、'IIb'、'强推荐'、'1'。
   * 仅在原指南对该条推荐明确给出等级时填写；摘编时不做任何推断。
   */
  rec?: string
  /**
   * 证据级别 / 证据质量，一律按原指南的写法记录，如 'A'、'B'、'C'、'高'、'中等质量'。
   * 仅在原指南对该条推荐明确给出等级时填写；摘编时不做任何推断。
   */
  ev?: string
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
  /** 所属临床科室 */
  dept: DeptId
  /** 亚病种 / 亚专业分组（取值见 topics.ts，id 在本科室内唯一） */
  topic?: string
  tags: string[]
  /** 一句话定位 */
  summary: string
  /** 出处说明 */
  ref?: string
  /** 原文/摘要链接 */
  url?: string
  /** 是否该领域当前最新版本 */
  latest?: boolean
  /**
   * 该指南采用的证据分级体系说明，如
   * 「推荐类别 I/IIa/IIb/III + 证据级别 A/B/C」或「GRADE：证据质量 高/中/低/极低」。
   * 指南本身未采用分级体系时不填。
   */
  grading?: string
  sections: Section[]
}

export interface Department {
  id: DeptId
  name: string
  short: string
  group: DeptGroup
  desc: string
}
