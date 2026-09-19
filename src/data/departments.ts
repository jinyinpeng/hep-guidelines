import type { Department, DeptGroup, DeptId } from './types'

export const DEPT_GROUPS: { id: DeptGroup; name: string; desc: string }[] = [
  { id: 'internal', name: '内科系', desc: '以药物治疗与慢病管理为主' },
  { id: 'surgery', name: '外科系', desc: '以手术与围手术期管理为主' },
  { id: 'womenChild', name: '妇产与儿科', desc: '孕产妇与儿童专科' },
  { id: 'critical', name: '急危重症与麻醉', desc: '抢救、器官支持与围术期安全' },
  { id: 'specialty', name: '专科与其他', desc: '五官、口腔、康复与疼痛' },
]

export const DEPARTMENTS: Department[] = [
  // ---------- 内科系 ----------
  { id: 'hepatology', name: '肝病科 / 感染肝病', short: '肝病科', group: 'internal', desc: '病毒性肝炎、脂肪肝、肝硬化、肝癌、肝衰竭' },
  { id: 'cardio', name: '心血管内科', short: '心内科', group: 'internal', desc: '高血压、冠心病、心衰、心律失常、血脂' },
  { id: 'resp', name: '呼吸与危重症医学科', short: '呼吸科', group: 'internal', desc: '慢阻肺、哮喘、肺炎、肺栓塞、肺结节' },
  { id: 'gi', name: '消化内科', short: '消化科', group: 'internal', desc: '幽门螺杆菌、胰腺炎、炎症性肠病、消化道出血' },
  { id: 'renal', name: '肾脏内科', short: '肾内科', group: 'internal', desc: '慢性肾脏病、IgA 肾病、糖尿病肾病、透析' },
  { id: 'heme', name: '血液科', short: '血液科', group: 'internal', desc: '白血病、淋巴瘤、骨髓瘤、贫血、血小板减少' },
  { id: 'endo', name: '内分泌代谢科', short: '内分泌科', group: 'internal', desc: '糖尿病、甲状腺、骨质疏松、肥胖、痛风' },
  { id: 'rheum', name: '风湿免疫科', short: '风湿科', group: 'internal', desc: '狼疮、类风湿、痛风、脊柱关节炎、血管炎' },
  { id: 'neuro', name: '神经内科', short: '神内科', group: 'internal', desc: '卒中、帕金森、癫痫、认知障碍、偏头痛' },
  { id: 'infectious', name: '感染科', short: '感染科', group: 'internal', desc: '脓毒症、抗菌药物、发热待查、流感' },
  { id: 'oncology', name: '肿瘤内科', short: '肿瘤科', group: 'internal', desc: '肺癌、乳腺癌、消化道肿瘤、免疫治疗' },
  { id: 'geriatrics', name: '老年医学科', short: '老年科', group: 'internal', desc: '衰弱、多重用药、跌倒、老年综合评估' },
  { id: 'psychiatry', name: '精神心理科', short: '精神科', group: 'internal', desc: '抑郁、焦虑、精神分裂症、失眠' },
  { id: 'derm', name: '皮肤科', short: '皮肤科', group: 'internal', desc: '特应性皮炎、银屑病、痤疮、荨麻疹' },

  // ---------- 外科系 ----------
  { id: 'gensurg', name: '普通外科', short: '普外科', group: 'surgery', desc: '胆石症、阑尾炎、疝、甲状腺与乳腺' },
  { id: 'ortho', name: '骨科', short: '骨科', group: 'surgery', desc: '骨关节炎、腰椎间盘突出、骨质疏松骨折' },
  { id: 'neurosurg', name: '神经外科', short: '神外科', group: 'surgery', desc: '颅脑创伤、脑出血外科、颅内动脉瘤' },
  { id: 'urology', name: '泌尿外科', short: '泌尿科', group: 'surgery', desc: '泌尿系结石、前列腺增生、前列腺癌' },
  { id: 'cts', name: '胸外科', short: '胸外科', group: 'surgery', desc: '肺结节、肺癌、食管癌、气胸' },
  { id: 'vascular', name: '血管外科', short: '血管科', group: 'surgery', desc: '深静脉血栓、下肢动脉硬化闭塞、静脉曲张' },

  // ---------- 妇产与儿科 ----------
  { id: 'obgyn', name: '妇产科', short: '妇产科', group: 'womenChild', desc: '妊娠期高血压、糖尿病、产后出血、宫颈癌筛查' },
  { id: 'peds', name: '儿科', short: '儿科', group: 'womenChild', desc: '儿童肺炎、哮喘、手足口病、新生儿黄疸' },

  // ---------- 急危重症与麻醉 ----------
  { id: 'emergency', name: '急诊医学科', short: '急诊科', group: 'critical', desc: '心肺复苏、急性中毒、休克、胸痛' },
  { id: 'icu', name: '重症医学科', short: 'ICU', group: 'critical', desc: '脓毒症、ARDS、镇痛镇静、器官支持' },
  { id: 'anes', name: '麻醉科', short: '麻醉科', group: 'critical', desc: '围术期管理、气道管理、术后镇痛' },

  // ---------- 专科与其他 ----------
  { id: 'ophtho', name: '眼科', short: '眼科', group: 'specialty', desc: '糖尿病视网膜病变、青光眼、白内障' },
  { id: 'ent', name: '耳鼻咽喉科', short: '耳鼻喉科', group: 'specialty', desc: '变应性鼻炎、慢性鼻窦炎、突发性聋' },
  { id: 'stomatology', name: '口腔科', short: '口腔科', group: 'specialty', desc: '龋病、牙周病、口腔黏膜病' },
  { id: 'rehab', name: '康复医学科', short: '康复科', group: 'specialty', desc: '卒中康复、心肺康复、疼痛康复' },
  { id: 'pain', name: '疼痛科', short: '疼痛科', group: 'specialty', desc: '慢性疼痛、癌痛规范化治疗、神经病理性疼痛' },
]

export const DEPT_MAP = Object.fromEntries(DEPARTMENTS.map((d) => [d.id, d])) as Record<
  DeptId,
  Department
>

export function deptsByGroup(group: DeptGroup): Department[] {
  return DEPARTMENTS.filter((d) => d.group === group)
}
