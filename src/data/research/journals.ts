import type { JournalTier } from './types'

/**
 * 期刊登记表 —— 研究条目的「期刊层级」由这里统一决定，数据文件不再自己写 tier。
 *
 * 为什么集中登记：
 *   · 同一个期刊在多个科室出现时层级必然一致，不会出现「Hepatology 在肝病科是顶刊、
 *     在消化科变成权威期刊」这种矛盾；
 *   · 新增期刊只需在这里补一行，配合 npm run verify 可以直接查出漏登记的期刊名。
 *
 * 层级定义：
 *   top    综合顶刊：四大顶刊 + Nature / Cell 系列，面向全医学界
 *   field  本领域顶刊：该专科公认的第一梯队期刊（肝病科的 Hepatology / J Hepatol、
 *          血液科的 Blood、消化的 Gut / Gastroenterology、心血管的 Circulation / EHJ 等）
 *   major  权威期刊：本领域有影响力的大刊、亚专科期刊
 */
export const TIER_LABEL: Record<JournalTier, string> = {
  top: '综合顶刊',
  field: '本领域顶刊',
  major: '权威期刊',
}

/** 层级排序权重，越小越靠前 */
export const TIER_RANK: Record<JournalTier, number> = { top: 0, field: 1, major: 2 }

export interface JournalMeta {
  name: string
  tier: JournalTier
  /** 主要学科领域，用于在界面上解释「这本刊为什么算顶刊」 */
  field: string
}

/** 期刊名 → [层级, 学科领域] */
const RAW: Record<string, [JournalTier, string]> = {
  /* ---------- 综合顶刊 ---------- */
  NEJM: ['top', '综合医学'],
  Lancet: ['top', '综合医学'],
  JAMA: ['top', '综合医学'],
  BMJ: ['top', '综合医学'],
  'Nat Med': ['top', '综合医学'],
  Nature: ['top', '综合科学'],
  Cell: ['top', '生命科学'],
  'Ann Intern Med': ['top', '综合内科'],

  /* ---------- 肝病 ---------- */
  Hepatology: ['field', '肝病'],
  'J Hepatol': ['field', '肝病'],
  'Lancet Gastroenterol Hepatol': ['field', '肝病与消化'],
  'Clin Gastroenterol Hepatol': ['field', '肝病与消化'],
  'Liver Int': ['major', '肝病'],
  'Aliment Pharmacol Ther': ['major', '肝病与消化'],
  'Hepatol Commun': ['major', '肝病'],
  'J Viral Hepat': ['major', '肝病'],

  /* ---------- 消化 ---------- */
  Gut: ['field', '消化'],
  Gastroenterology: ['field', '消化'],
  'Am J Gastroenterol': ['field', '消化'],
  'J Crohns Colitis': ['field', '炎症性肠病'],
  Endoscopy: ['major', '消化内镜'],
  'Gastrointest Endosc': ['major', '消化内镜'],
  Pancreatology: ['major', '胰腺'],

  /* ---------- 心血管 ---------- */
  'Eur Heart J': ['field', '心血管'],
  Circulation: ['field', '心血管'],
  'J Am Coll Cardiol': ['field', '心血管'],
  'JAMA Cardiol': ['field', '心血管'],
  'Eur J Heart Fail': ['field', '心力衰竭'],
  'JACC Heart Fail': ['major', '心力衰竭'],
  'Heart Rhythm': ['field', '心律失常'],
  'Circ Cardiovasc Interv': ['major', '冠脉介入'],
  'Eur Heart J Cardiovasc Pharmacother': ['major', '心血管药理'],
  'J Thromb Haemost': ['field', '血栓与止血'],

  /* ---------- 呼吸 ---------- */
  'Am J Respir Crit Care Med': ['field', '呼吸'],
  'Eur Respir J': ['field', '呼吸'],
  Thorax: ['field', '呼吸'],
  'Lancet Respir Med': ['field', '呼吸'],
  Chest: ['major', '呼吸'],
  Respirology: ['major', '呼吸'],
  'ERJ Open Res': ['major', '呼吸'],

  /* ---------- 肾脏 ---------- */
  'Kidney Int': ['field', '肾脏'],
  'J Am Soc Nephrol': ['field', '肾脏'],
  'Am J Kidney Dis': ['field', '肾脏'],
  'Nephrol Dial Transplant': ['major', '肾脏'],
  'Clin Kidney J': ['major', '肾脏'],
  'Kidney Int Rep': ['major', '肾脏'],

  /* ---------- 血液 ---------- */
  Blood: ['field', '血液'],
  'Lancet Haematol': ['field', '血液'],
  Leukemia: ['field', '白血病'],
  Haematologica: ['field', '血液'],
  'Blood Adv': ['field', '血液'],
  'Br J Haematol': ['major', '血液'],
  'Am J Hematol': ['major', '血液'],
  'Bone Marrow Transplant': ['major', '造血干细胞移植'],
  'J Clin Oncol': ['field', '肿瘤与血液'],
  'Lancet Oncol': ['field', '肿瘤'],
  'JAMA Oncol': ['field', '肿瘤'],

  /* ---------- 内分泌代谢 ---------- */
  'Diabetes Care': ['field', '糖尿病'],
  'Lancet Diabetes Endocrinol': ['field', '内分泌代谢'],
  Diabetologia: ['field', '糖尿病'],
  'J Clin Endocrinol Metab': ['major', '内分泌'],
  'Diabetes Obes Metab': ['major', '糖尿病与肥胖'],
  Thyroid: ['major', '甲状腺'],
  Bone: ['major', '骨骼代谢'],
  'Osteoporos Int': ['major', '骨质疏松'],
  Obesity: ['major', '肥胖'],

  /* ---------- 风湿免疫 ---------- */
  'Ann Rheum Dis': ['field', '风湿免疫'],
  'Arthritis Rheumatol': ['field', '风湿免疫'],
  'Lancet Rheumatol': ['field', '风湿免疫'],
  Rheumatology: ['major', '风湿免疫'],
  'J Rheumatol': ['major', '风湿免疫'],
  'RMD Open': ['major', '风湿免疫'],

  /* ---------- 神经 ---------- */
  'Lancet Neurol': ['field', '神经'],
  Neurology: ['field', '神经'],
  Brain: ['field', '神经'],
  Stroke: ['field', '卒中'],
  'JAMA Neurol': ['field', '神经'],
  'Ann Neurol': ['field', '神经'],
  'Mov Disord': ['major', '运动障碍'],
  Epilepsia: ['major', '癫痫'],
  'Mult Scler': ['major', '神经免疫'],
  'J Neurol Neurosurg Psychiatry': ['field', '神经精神'],
  'Alzheimers Dement': ['field', '认知障碍'],

  /* ---------- 感染 ---------- */
  'Lancet Infect Dis': ['field', '感染'],
  'Clin Infect Dis': ['field', '感染'],
  'Clin Microbiol Infect': ['field', '感染与微生物'],
  'J Infect Dis': ['field', '感染'],
  'J Antimicrob Chemother': ['major', '抗菌药物'],
  'Emerg Infect Dis': ['major', '感染'],

  /* ---------- 肿瘤 ---------- */
  'Ann Oncol': ['field', '肿瘤'],
  'Nat Cancer': ['field', '肿瘤'],
  'Clin Cancer Res': ['major', '肿瘤'],
  'J Natl Cancer Inst': ['field', '肿瘤'],
  'Eur J Cancer': ['major', '肿瘤'],
  'Br J Cancer': ['major', '肿瘤'],
  'J Thorac Oncol': ['field', '胸部肿瘤'],
  'JAMA Surg': ['field', '外科'],

  /* ---------- 老年 ---------- */
  'J Am Geriatr Soc': ['field', '老年医学'],
  'Age Ageing': ['field', '老年医学'],
  'Lancet Healthy Longev': ['field', '老龄健康'],
  'JAMA Intern Med': ['field', '内科'],
  'BMC Geriatr': ['major', '老年医学'],
  'J Nutr Health Aging': ['major', '老年营养'],

  /* ---------- 精神 ---------- */
  'Am J Psychiatry': ['field', '精神'],
  'JAMA Psychiatry': ['field', '精神'],
  'Mol Psychiatry': ['field', '精神'],
  'Lancet Psychiatry': ['field', '精神'],
  'Biol Psychiatry': ['field', '精神'],
  'Br J Psychiatry': ['major', '精神'],
  'J Affect Disord': ['major', '情感障碍'],

  /* ---------- 皮肤 ---------- */
  'J Am Acad Dermatol': ['field', '皮肤'],
  'Br J Dermatol': ['field', '皮肤'],
  'JAMA Dermatol': ['field', '皮肤'],
  'J Invest Dermatol': ['field', '皮肤基础'],
  'J Eur Acad Dermatol Venereol': ['major', '皮肤'],
  'Acta Derm Venereol': ['major', '皮肤'],

  /* ---------- 普通外科 ---------- */
  'Ann Surg': ['field', '外科'],
  'Br J Surg': ['field', '外科'],
  'Surg Endosc': ['major', '微创外科'],

  /* ---------- 骨科 ---------- */
  'J Bone Joint Surg Am': ['field', '骨科'],
  'Am J Sports Med': ['field', '运动医学'],
  Spine: ['field', '脊柱'],
  'Osteoarthritis Cartilage': ['field', '骨关节炎'],
  'J Arthroplasty': ['major', '关节置换'],
  'Clin Orthop Relat Res': ['major', '骨科'],

  /* ---------- 神经外科 ---------- */
  'J Neurosurg': ['field', '神经外科'],
  Neurosurgery: ['field', '神经外科'],
  'Neuro-Oncology': ['field', '神经肿瘤'],
  'J Neurotrauma': ['field', '颅脑创伤'],
  'Acta Neurochir': ['major', '神经外科'],

  /* ---------- 泌尿外科 ---------- */
  'Eur Urol': ['field', '泌尿外科'],
  'J Urol': ['field', '泌尿外科'],
  'Eur Urol Oncol': ['field', '泌尿肿瘤'],
  'BJU Int': ['major', '泌尿外科'],
  'World J Urol': ['major', '泌尿外科'],

  /* ---------- 胸外科 ---------- */
  'J Thorac Cardiovasc Surg': ['field', '胸心外科'],
  'Ann Thorac Surg': ['field', '胸外科'],
  'Interact Cardiovasc Thorac Surg': ['major', '胸外科'],

  /* ---------- 血管外科 ---------- */
  'J Vasc Surg': ['field', '血管外科'],
  'Eur J Vasc Endovasc Surg': ['field', '血管外科'],
  'Thromb Haemost': ['field', '血栓'],
  'J Endovasc Ther': ['major', '腔内治疗'],

  /* ---------- 妇产 ---------- */
  'Am J Obstet Gynecol': ['field', '妇产'],
  BJOG: ['field', '妇产'],
  'Obstet Gynecol': ['field', '妇产'],
  'Ultrasound Obstet Gynecol': ['field', '母胎医学'],
  'Hum Reprod': ['field', '生殖'],
  'Fertil Steril': ['field', '生殖'],
  'Eur J Obstet Gynecol Reprod Biol': ['major', '妇产'],
  Menopause: ['major', '绝经管理'],

  /* ---------- 儿科 ---------- */
  Pediatrics: ['field', '儿科'],
  'JAMA Pediatr': ['field', '儿科'],
  'Lancet Child Adolesc Health': ['field', '儿科'],
  'Arch Dis Child': ['field', '儿科'],
  'J Pediatr': ['field', '儿科'],
  'Pediatr Infect Dis J': ['major', '儿童感染'],
  'Acta Paediatr': ['major', '儿科'],

  /* ---------- 急诊 ---------- */
  'Ann Emerg Med': ['field', '急诊'],
  Resuscitation: ['field', '复苏'],
  'Acad Emerg Med': ['major', '急诊'],
  'Emerg Med J': ['major', '急诊'],

  /* ---------- 重症 ---------- */
  'Intensive Care Med': ['field', '重症'],
  'Crit Care Med': ['field', '重症'],
  'Crit Care': ['field', '重症'],
  'Ann Intensive Care': ['major', '重症'],
  'J Crit Care': ['major', '重症'],

  /* ---------- 麻醉 ---------- */
  Anesthesiology: ['field', '麻醉'],
  'Br J Anaesth': ['field', '麻醉'],
  'Anesth Analg': ['field', '麻醉'],
  Anaesthesia: ['field', '麻醉'],
  'Reg Anesth Pain Med': ['field', '区域麻醉'],
  'Eur J Anaesthesiol': ['major', '麻醉'],

  /* ---------- 眼科 ---------- */
  Ophthalmology: ['field', '眼科'],
  'JAMA Ophthalmol': ['field', '眼科'],
  'Br J Ophthalmol': ['field', '眼科'],
  'Am J Ophthalmol': ['field', '眼科'],
  'Ophthalmol Retina': ['major', '眼底病'],
  Retina: ['major', '眼底病'],

  /* ---------- 耳鼻咽喉 ---------- */
  'J Allergy Clin Immunol': ['field', '变态反应'],
  Allergy: ['field', '变态反应'],
  Rhinology: ['field', '鼻科'],
  'Otolaryngol Head Neck Surg': ['field', '耳鼻咽喉'],
  Laryngoscope: ['field', '耳鼻咽喉'],
  'JAMA Otolaryngol Head Neck Surg': ['field', '耳鼻咽喉'],
  'Ear Hear': ['major', '听力学'],

  /* ---------- 口腔 ---------- */
  'J Dent Res': ['field', '口腔'],
  'J Clin Periodontol': ['field', '牙周'],
  'Clin Oral Implants Res': ['field', '种植'],
  'J Dent': ['field', '口腔'],
  'Int J Oral Maxillofac Surg': ['major', '颌面外科'],
  'J Endod': ['field', '牙髓'],

  /* ---------- 康复 ---------- */
  'Arch Phys Med Rehabil': ['field', '康复'],
  'Neurorehabil Neural Repair': ['field', '神经康复'],
  'Phys Ther': ['field', '物理治疗'],
  'Clin Rehabil': ['major', '康复'],
  'J Rehabil Med': ['major', '康复'],

  /* ---------- 疼痛 ---------- */
  Pain: ['field', '疼痛'],
  'J Pain': ['field', '疼痛'],
  'Eur J Pain': ['field', '疼痛'],
  'Clin J Pain': ['major', '疼痛'],
  'Pain Med': ['major', '疼痛'],
}

export const JOURNALS: Record<string, JournalMeta> = Object.fromEntries(
  Object.entries(RAW).map(([name, [tier, field]]) => [name, { name, tier, field }]),
)

/** 查期刊层级；未登记的期刊按「权威期刊」兜底（verify 会报错提示补登记） */
export function journalMeta(name: string): JournalMeta {
  return JOURNALS[name] ?? { name, tier: 'major', field: '其他' }
}

export function journalTier(name: string): JournalTier {
  return journalMeta(name).tier
}

export const JOURNAL_NAMES = Object.keys(RAW)

/** 按层级分组，用于界面上的「期刊体系」展示 */
export function journalsByTier(): Record<JournalTier, JournalMeta[]> {
  const out: Record<JournalTier, JournalMeta[]> = { top: [], field: [], major: [] }
  for (const m of Object.values(JOURNALS)) out[m.tier].push(m)
  for (const list of Object.values(out)) list.sort((a, b) => a.name.localeCompare(b.name))
  return out
}
