import type { DeptId } from './types'

/** 科室下的亚病种 / 亚专业分组 */
export interface Topic {
  id: string
  /** 完整名称，如「乙型病毒性肝炎」 */
  name: string
  /** 筛选芯片上的短名，如「乙肝」 */
  short: string
  /** 一句话说明（可选） */
  desc?: string
}

/**
 * 每个科室的病种分组。
 * id 只需在本科室内唯一；指南通过 `topic` 字段引用。
 * 顺序即筛选栏的展示顺序。
 */
export const TOPICS: Record<DeptId, Topic[]> = {
  /* ================= 内科系 ================= */
  hepatology: [
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
  ],

  cardio: [
    { id: 'htn', name: '高血压', short: '高血压' },
    { id: 'lipid', name: '血脂异常', short: '血脂' },
    { id: 'cad', name: '冠心病与急性冠脉综合征', short: '冠心病' },
    { id: 'hf', name: '心力衰竭', short: '心衰' },
    { id: 'af', name: '心房颤动', short: '房颤' },
    { id: 'arrhythmia', name: '其他心律失常与猝死预防', short: '心律失常' },
    { id: 'cmp', name: '心肌病与心包疾病', short: '心肌心包' },
    { id: 'vhd', name: '心脏瓣膜病', short: '瓣膜病' },
    { id: 'ph', name: '肺血管病与肺动脉高压', short: '肺血管' },
    { id: 'infection', name: '感染性心内膜炎', short: '心内膜炎' },
    { id: 'device', name: '起搏与器械治疗', short: '起搏器械' },
    { id: 'prevention', name: '风险评估与一级预防', short: '一级预防' },
  ],

  resp: [
    { id: 'copd', name: '慢性阻塞性肺疾病', short: '慢阻肺' },
    { id: 'asthma', name: '支气管哮喘', short: '哮喘' },
    { id: 'infection', name: '社区获得性肺炎', short: '肺炎' },
    { id: 'tb', name: '结核病', short: '结核' },
    { id: 'pe', name: '肺栓塞与肺血管病', short: '肺栓塞' },
    { id: 'ild', name: '间质性肺病与肺纤维化', short: '间质肺' },
    { id: 'bronchiectasis', name: '支气管扩张症', short: '支扩' },
    { id: 'cough', name: '慢性咳嗽', short: '咳嗽' },
    { id: 'respSupport', name: '氧疗与无创通气', short: '呼吸支持' },
    { id: 'pleural', name: '胸膜疾病与胸腔积液', short: '胸膜' },
    { id: 'function', name: '肺功能检查', short: '肺功能' },
    { id: 'smoking', name: '烟草依赖与戒烟', short: '戒烟' },
  ],

  gi: [
    { id: 'hp', name: '幽门螺杆菌与胃十二指肠疾病', short: 'Hp 与溃疡' },
    { id: 'gerd', name: '胃食管反流病', short: '反流病' },
    { id: 'ibd', name: '炎症性肠病', short: 'IBD' },
    { id: 'pancreatitis', name: '急慢性胰腺炎', short: '胰腺炎' },
    { id: 'biliary', name: '胆道疾病与 ERCP', short: '胆道' },
    { id: 'bleeding', name: '消化道出血', short: '消化道出血' },
    { id: 'tumorScreen', name: '消化道肿瘤筛查', short: '早癌筛查' },
    { id: 'functional', name: '功能性胃肠病', short: '功能性疾病' },
    { id: 'endoscopy', name: '内镜诊疗与肠道准备', short: '内镜' },
    { id: 'ischemia', name: '缺血性肠病', short: '缺血性肠病' },
    { id: 'microbiota', name: '肠道微生态', short: '微生态' },
  ],

  renal: [
    { id: 'ckd', name: '慢性肾脏病', short: '慢性肾病' },
    { id: 'gn', name: '肾小球疾病', short: '肾小球病' },
    { id: 'dkd', name: '糖尿病肾脏病', short: '糖肾病' },
    { id: 'mbd', name: 'CKD 矿物质骨代谢异常', short: '钙磷代谢' },
    { id: 'dialysis', name: '血液净化与透析通路', short: '透析' },
    { id: 'complication', name: '肾性贫血与 CKD 并发症', short: '肾性贫血' },
  ],

  heme: [
    { id: 'leukemia', name: '白血病与骨髓增殖性肿瘤', short: '白血病' },
    { id: 'lymphoma', name: '淋巴瘤', short: '淋巴瘤' },
    { id: 'myeloma', name: '多发性骨髓瘤', short: '骨髓瘤' },
    { id: 'anemia', name: '贫血', short: '贫血' },
    { id: 'plt', name: '血小板疾病', short: '血小板' },
    { id: 'coagulation', name: '血友病与出凝血疾病', short: '出凝血' },
    { id: 'other', name: '其他血液病', short: '其他' },
  ],

  endo: [
    { id: 'dm', name: '糖尿病', short: '糖尿病' },
    { id: 'dmComplication', name: '糖尿病并发症', short: '糖尿病足' },
    { id: 'thyroid', name: '甲状腺疾病', short: '甲状腺' },
    { id: 'obesity', name: '肥胖症', short: '肥胖' },
    { id: 'osteoporosis', name: '骨质疏松症', short: '骨质疏松' },
    { id: 'gout', name: '高尿酸血症与痛风', short: '痛风' },
    { id: 'adrenal', name: '肾上腺疾病', short: '肾上腺' },
  ],

  rheum: [
    { id: 'ra', name: '类风湿关节炎', short: '类风湿' },
    { id: 'sle', name: '系统性红斑狼疮', short: '狼疮' },
    { id: 'spa', name: '脊柱关节炎', short: '脊柱关节炎' },
    { id: 'gout', name: '痛风与晶体性关节炎', short: '痛风' },
    { id: 'vasculitis', name: '系统性血管炎', short: '血管炎' },
    { id: 'other', name: '其他结缔组织病', short: '其他' },
  ],

  neuro: [
    { id: 'ischemic', name: '缺血性卒中（溶栓与取栓）', short: '缺血性卒中' },
    { id: 'ich', name: '脑出血与重症卒中', short: '脑出血' },
    { id: 'prevention', name: '卒中预防与全程管理', short: '卒中预防' },
    { id: 'pd', name: '帕金森病与运动障碍', short: '帕金森' },
    { id: 'dementia', name: '认知障碍与痴呆', short: '认知障碍' },
    { id: 'epilepsy', name: '癫痫', short: '癫痫' },
    { id: 'ms', name: '神经免疫病（MS 与重症肌无力）', short: '神经免疫' },
    { id: 'headache', name: '头痛与眩晕', short: '头痛眩晕' },
    { id: 'other', name: '其他神经系统疾病', short: '其他' },
  ],

  infectious: [
    { id: 'sepsis', name: '脓毒症与重症感染', short: '脓毒症' },
    { id: 'antibiotic', name: '抗菌药物与耐药菌', short: '抗菌药物' },
    { id: 'respiratory', name: '呼吸道病毒感染', short: '流感' },
    { id: 'hiv', name: 'HIV / AIDS', short: '艾滋病' },
    { id: 'fever', name: '发热待查与不明原因发热', short: '发热待查' },
    { id: 'other', name: '其他感染性疾病', short: '其他' },
  ],

  oncology: [
    { id: 'lung', name: '肺癌', short: '肺癌' },
    { id: 'breast', name: '乳腺癌', short: '乳腺癌' },
    { id: 'colorectal', name: '结直肠癌', short: '结直肠癌' },
    { id: 'gastric', name: '胃癌', short: '胃癌' },
    { id: 'esophagus', name: '食管癌', short: '食管癌' },
    { id: 'toxicity', name: '抗肿瘤治疗相关毒性', short: '治疗毒性' },
    { id: 'supportive', name: '支持治疗与并发症', short: '支持治疗' },
    { id: 'screen', name: '肿瘤筛查与早诊', short: '筛查' },
    { id: 'other', name: '其他实体瘤', short: '其他' },
  ],

  geriatrics: [
    { id: 'cga', name: '老年综合评估', short: '综合评估' },
    { id: 'frailty', name: '衰弱与肌少症', short: '衰弱肌少' },
    { id: 'falls', name: '跌倒预防', short: '跌倒' },
    { id: 'delirium', name: '谵妄', short: '谵妄' },
    { id: 'polypharmacy', name: '多重用药与处方精简', short: '多重用药' },
    { id: 'chronic', name: '老年慢病管理', short: '老年慢病' },
    { id: 'nutrition', name: '老年营养支持', short: '老年营养' },
    { id: 'other', name: '其他老年综合征', short: '其他' },
  ],

  psychiatry: [
    { id: 'depression', name: '抑郁障碍', short: '抑郁' },
    { id: 'anxiety', name: '焦虑障碍', short: '焦虑' },
    { id: 'schizophrenia', name: '精神分裂症', short: '精神分裂症' },
    { id: 'bipolar', name: '双相障碍', short: '双相' },
    { id: 'sleep', name: '睡眠障碍', short: '失眠' },
    { id: 'child', name: '儿童青少年精神障碍', short: '儿童精神' },
    { id: 'other', name: '其他精神障碍', short: '其他' },
  ],

  derm: [
    { id: 'eczema', name: '特应性皮炎与湿疹', short: '特应性皮炎' },
    { id: 'psoriasis', name: '银屑病', short: '银屑病' },
    { id: 'acne', name: '痤疮', short: '痤疮' },
    { id: 'urticaria', name: '荨麻疹', short: '荨麻疹' },
    { id: 'hair', name: '毛发疾病', short: '斑秃' },
    { id: 'pigment', name: '色素性皮肤病', short: '白癜风' },
    { id: 'infection', name: '皮肤感染', short: '带状疱疹' },
    { id: 'other', name: '其他皮肤病', short: '其他' },
  ],

  /* ================= 外科系 ================= */
  gensurg: [
    { id: 'biliary', name: '胆囊与胆道疾病', short: '胆道疾病' },
    { id: 'hernia', name: '腹壁疝', short: '疝' },
    { id: 'thyroid', name: '甲状腺疾病', short: '甲状腺' },
    { id: 'giSurgery', name: '胃肠外科与肠梗阻', short: '胃肠外科' },
    { id: 'colorectal', name: '结直肠与肛肠疾病', short: '肛肠' },
    { id: 'appendix', name: '阑尾炎', short: '阑尾炎' },
    { id: 'abdominal', name: '腹腔感染与急腹症', short: '腹腔感染' },
    { id: 'perioperative', name: '围手术期管理', short: '围术期' },
    { id: 'other', name: '其他普外科疾病', short: '其他' },
  ],

  ortho: [
    { id: 'trauma', name: '骨折与创伤', short: '骨折创伤' },
    { id: 'spine', name: '脊柱疾病', short: '脊柱' },
    { id: 'oa', name: '骨关节炎与关节置换', short: '关节置换' },
    { id: 'tumor', name: '骨与软组织肿瘤', short: '骨肿瘤' },
    { id: 'vte', name: '围术期血栓预防', short: 'VTE 预防' },
    { id: 'other', name: '其他骨科疾病', short: '其他' },
  ],

  neurosurg: [
    { id: 'tbi', name: '颅脑创伤', short: '颅脑创伤' },
    { id: 'sah', name: '颅内动脉瘤与蛛网膜下腔出血', short: '动脉瘤' },
    { id: 'tumor', name: '颅内肿瘤', short: '颅内肿瘤' },
    { id: 'ich', name: '出血性卒中外科治疗', short: '脑出血外科' },
    { id: 'functional', name: '功能神经外科', short: '功能神外' },
    { id: 'other', name: '其他神经外科疾病', short: '其他' },
  ],

  urology: [
    { id: 'stone', name: '泌尿系结石', short: '结石' },
    { id: 'bph', name: '良性前列腺增生', short: '前列腺增生' },
    { id: 'tumor', name: '泌尿系肿瘤', short: '泌尿肿瘤' },
    { id: 'infection', name: '尿路感染与感染性结石', short: '尿路感染' },
    { id: 'function', name: '排尿功能障碍', short: '排尿功能' },
    { id: 'other', name: '其他泌尿外科疾病', short: '其他' },
  ],

  cts: [
    { id: 'lung', name: '肺结节与肺癌', short: '肺结节肺癌' },
    { id: 'esophagus', name: '食管疾病', short: '食管' },
    { id: 'mediastinum', name: '纵隔肿瘤', short: '纵隔肿瘤' },
    { id: 'pneumothorax', name: '气胸与胸膜疾病', short: '气胸' },
    { id: 'chestTrauma', name: '胸部创伤', short: '胸部创伤' },
    { id: 'airway', name: '围术期气道与肺康复', short: '围术期管理' },
    { id: 'other', name: '其他胸外科疾病', short: '其他' },
  ],

  vascular: [
    { id: 'aneurysm', name: '主动脉疾病', short: '主动脉' },
    { id: 'dvt', name: '静脉血栓栓塞症', short: '深静脉血栓' },
    { id: 'pad', name: '下肢动脉硬化闭塞症', short: '下肢动脉' },
    { id: 'carotid', name: '颈动脉狭窄', short: '颈动脉' },
    { id: 'vein', name: '慢性静脉疾病与静脉曲张', short: '静脉曲张' },
    { id: 'other', name: '其他血管疾病', short: '其他' },
  ],

  /* ================= 妇产与儿科 ================= */
  obgyn: [
    { id: 'hypertension', name: '妊娠期高血压疾病', short: '妊高症' },
    { id: 'gdm', name: '妊娠期高血糖', short: '妊娠糖尿病' },
    { id: 'pph', name: '产后出血', short: '产后出血' },
    { id: 'earlyPregnancy', name: '早产与复发性流产', short: '早产与流产' },
    { id: 'endometriosis', name: '子宫内膜异位症', short: '内异症' },
    { id: 'cervical', name: '子宫颈癌筛查与预防', short: '宫颈癌筛查' },
    { id: 'tumor', name: '妇科肿瘤', short: '妇科肿瘤' },
    { id: 'other', name: '其他妇产科疾病', short: '其他' },
  ],

  peds: [
    { id: 'respiratory', name: '儿童呼吸系统疾病', short: '儿童呼吸' },
    { id: 'infectious', name: '儿童感染性疾病', short: '儿童感染' },
    { id: 'neuro', name: '儿童神经系统疾病', short: '儿童神经' },
    { id: 'neonatal', name: '新生儿疾病', short: '新生儿' },
    { id: 'cardio', name: '儿童心血管疾病', short: '儿童心血管' },
    { id: 'renal', name: '儿童肾脏疾病', short: '儿童肾脏' },
    { id: 'growth', name: '生长发育与营养', short: '生长发育' },
    { id: 'other', name: '其他儿科疾病', short: '其他' },
  ],

  /* ================= 急危重症与麻醉 ================= */
  emergency: [
    { id: 'cpr', name: '心搏骤停与心肺复苏', short: '心肺复苏' },
    { id: 'chestPain', name: '急性胸痛', short: '急性胸痛' },
    { id: 'poisoning', name: '急性中毒', short: '急性中毒' },
    { id: 'sepsis', name: '脓毒症早期识别', short: '脓毒症' },
    { id: 'other', name: '其他急症', short: '其他' },
  ],

  icu: [
    { id: 'infection', name: '重症感染与脓毒症', short: '重症感染' },
    { id: 'respiratory', name: 'ARDS 与呼吸支持', short: 'ARDS' },
    { id: 'sedation', name: '镇痛镇静与谵妄', short: '镇痛镇静' },
    { id: 'aki', name: '急性肾损伤与器官支持', short: 'AKI' },
    { id: 'other', name: '其他重症问题', short: '其他' },
  ],

  anes: [
    { id: 'airway', name: '气道管理', short: '气道管理' },
    { id: 'monitoring', name: '特殊人群麻醉与监测', short: '特殊人群' },
    { id: 'blood', name: '围术期血液管理', short: '血液管理' },
    { id: 'ponv', name: '术后恶心呕吐', short: '术后恶心呕吐' },
    { id: 'other', name: '其他麻醉问题', short: '其他' },
  ],

  /* ================= 专科与其他 ================= */
  ophtho: [
    { id: 'retina', name: '眼底病与糖尿病视网膜病变', short: '眼底病' },
    { id: 'glaucoma', name: '青光眼', short: '青光眼' },
    { id: 'cataract', name: '白内障与眼内炎', short: '白内障' },
    { id: 'surface', name: '眼表疾病与干眼', short: '干眼' },
    { id: 'other', name: '其他眼科疾病', short: '其他' },
  ],

  ent: [
    { id: 'rhinitis', name: '变应性鼻炎', short: '过敏性鼻炎' },
    { id: 'sinusitis', name: '慢性鼻窦炎', short: '鼻窦炎' },
    { id: 'hearing', name: '听力障碍与突发性聋', short: '听力障碍' },
    { id: 'sleep', name: '睡眠呼吸障碍', short: '打鼾 OSA' },
    { id: 'other', name: '其他耳鼻咽喉疾病', short: '其他' },
  ],

  stomatology: [
    { id: 'caries', name: '龋病', short: '龋病' },
    { id: 'periodontal', name: '牙周病', short: '牙周病' },
    { id: 'mucosa', name: '口腔黏膜病', short: '黏膜病' },
    { id: 'implant', name: '口腔种植', short: '种植' },
    { id: 'other', name: '其他口腔疾病', short: '其他' },
  ],

  rehab: [
    { id: 'strokeRehab', name: '神经康复', short: '神经康复' },
    { id: 'cardiac', name: '心脏康复', short: '心脏康复' },
    { id: 'pulmonary', name: '肺康复', short: '肺康复' },
    { id: 'dysphagia', name: '吞咽障碍康复', short: '吞咽障碍' },
    { id: 'other', name: '其他康复方向', short: '其他' },
  ],

  pain: [
    { id: 'cancer', name: '癌性疼痛', short: '癌痛' },
    { id: 'neuropathic', name: '神经病理性疼痛', short: '神经痛' },
    { id: 'spine', name: '脊柱源性疼痛', short: '腰背痛' },
    { id: 'other', name: '其他慢性疼痛', short: '其他' },
  ],
}

/** 取某科室的病种列表 */
export function topicsOf(dept: DeptId): Topic[] {
  return TOPICS[dept] ?? []
}

/** 在指定科室下按 id 查病种 */
export function topicOf(dept: DeptId, id?: string): Topic | undefined {
  if (!id) return undefined
  return topicsOf(dept).find((t) => t.id === id)
}
