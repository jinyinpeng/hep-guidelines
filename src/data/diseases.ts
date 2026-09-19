import type { DiseaseId } from './types'

/** 肝病科内部的亚病种分组 */
export interface Disease {
  id: DiseaseId
  name: string
  short: string
  desc: string
}

export const DISEASES: Disease[] = [
  { id: 'hbv', name: '乙型病毒性肝炎', short: '乙肝', desc: '治疗适应证、一线药物、临床治愈与母婴阻断' },
  { id: 'hcv', name: '丙型病毒性肝炎', short: '丙肝', desc: '泛基因型 DAA 方案、特殊人群与治愈判定' },
  { id: 'masld', name: '代谢相关脂肪性肝病', short: '脂肪肝', desc: '筛查路径、无创分层、减重与药物治疗' },
  { id: 'ald', name: '酒精性肝病', short: '酒精肝', desc: '饮酒阈值、戒酒治疗与重症酒精性肝炎' },
  { id: 'cirrhosis', name: '肝硬化及并发症', short: '肝硬化', desc: '门脉高压、腹水、SBP、肝性脑病与再代偿' },
  { id: 'hcc', name: '肝细胞癌', short: '肝癌', desc: '筛查监测、影像诊断、CNLC 分期与系统治疗' },
  { id: 'dili', name: '药物性肝损伤', short: 'DILI', desc: '分型、因果评估、常见可疑药物与救治' },
  { id: 'autoimmune', name: '自身免疫性肝病', short: '自免肝', desc: 'AIH、PBC、PSC 的诊断与治疗' },
  { id: 'failure', name: '肝衰竭与 ACLF', short: '肝衰竭', desc: '分型诊断、人工肝支持与肝移植时机' },
  { id: 'other', name: '遗传代谢与其他', short: '综合', desc: '肝豆状核变性等少见肝病与综合管理' },
]

export const DISEASE_MAP = Object.fromEntries(DISEASES.map((d) => [d.id, d])) as Record<
  Disease['id'],
  Disease
>
