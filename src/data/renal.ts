import type { Guideline } from './types'

/**
 * 肾脏内科
 * 覆盖慢性肾脏病早筛与全程管理、肾小球疾病（IgA 肾病 / 狼疮肾炎）、
 * 糖尿病肾脏病、CKD-MBD、透析与通路、肾性贫血
 */
export const RENAL: Guideline[] = [
  /* ================= 慢性肾脏病 ================= */
  {
    id: 'kdigo-ckd-2024',
    title: 'KDIGO 慢性肾脏病评估与管理指南（2024）',
    short: 'KDIGO CKD 指南 2024',
    org: '改善全球肾脏病预后组织（KDIGO）',
    region: 'intl',
    dept: 'renal',
    year: 2024,
    latest: true,
    tags: ['GFR 分期', '白蛋白尿', 'SGLT2i', '肾脏替代'],
    summary: '国际权威 CKD 指南，确立 GFR 与白蛋白尿双维度分期及延缓进展的药物治疗框架。',
    ref: 'KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD',
    sections: [
      {
        title: '评估与分期',
        points: [
          { t: '采用 GFR 分期（G1–G5）与白蛋白尿分期（A1–A3）双维度评估，即「CGA」分期。', tag: '分期', key: true },
          { t: '推荐用基于肌酐的 eGFR 公式，必要时联合胱抑素 C 提高准确性。', tag: '评估', key: true },
          { t: '推荐用尿白蛋白/肌酐比值（UACR）而非单纯尿蛋白定量评估肾损伤。', tag: '指标', key: true },
          { t: '推荐对 CKD 患者评估心血管风险，心血管事件是 CKD 主要死因。', tag: '风险', key: true },
        ],
      },
      {
        title: '延缓进展',
        points: [
          { t: '推荐 ACEI 或 ARB 用于伴白蛋白尿的 CKD 患者，可延缓进展。', tag: '一线', key: true },
          { t: '推荐 SGLT2 抑制剂用于 CKD 患者（含非糖尿病），可降低肾衰与心血管事件风险。', tag: '新推荐', key: true },
          { t: '推荐非甾体类盐皮质激素受体拮抗剂用于 2 型糖尿病相关 CKD 以降低肾心风险。', tag: '新推荐', key: true },
          { t: '推荐限钠、合理蛋白摄入、戒烟、控制体重与规律运动。', tag: '生活方式', key: true },
          { t: '避免肾毒性药物，使用造影剂前后注意水化。', tag: '安全', key: true },
        ],
      },
    ],
  },
  {
    id: 'cn-ckd-early-2023',
    title: '中国慢性肾脏病早期评价与管理指南（2023）',
    short: '中国 CKD 早期评价与管理指南',
    org: '中华预防医学会肾脏病预防与控制专业委员会',
    region: 'cn',
    dept: 'renal',
    year: 2023,
    latest: true,
    tags: ['早期筛查', '高危人群', 'SGLT2i', '医防融合'],
    summary: '聚焦 CKD 早期（G1–G2 期）的筛查识别与干预，我国 CKD 患者中早期占比高达 84.3%。',
    ref: '北京大学第一医院肾脏内科牵头制订，2023 年 8 月发表于《中华内科杂志》',
    sections: [
      {
        title: '早期筛查',
        points: [
          { t: '建议将糖尿病、高血压、心血管疾病患者及老年人列为 CKD 高危对象，每年至少筛查一次。', tag: '筛查人群', key: true },
          { t: '筛查项目为 UACR 与 eGFR；基层机构可先用尿常规初筛。', tag: '筛查项目', key: true },
          { t: 'CKD 早期（1–2 期）患者比例高达 84.3%，但知晓率与诊断率偏低，强调主动筛查。', tag: '背景', key: true },
          { t: '一级预防需重点关注高血糖与高血压两大危险因素。', tag: '预防', key: true },
        ],
      },
      {
        title: '分层管理',
        points: [
          { t: 'G1–G3 期重点为早诊断、早治疗，针对病因与危险因素积极干预。', tag: 'G1–G3', key: true },
          { t: 'G4–G5 期重点为控制并发症，并合理评估启动肾脏替代治疗的时机与方式。', tag: 'G4–G5', key: true },
          { t: '血压目标：非透析患者 <130/80 mmHg，可耐受者收缩压进一步降至 <120 mmHg；老年患者 <140/80 mmHg。', tag: '血压', key: true },
          { t: '血糖目标个体化：一般 HbA1c <6.5%，有严重低血糖史或预期寿命短者 <8.0%。', tag: '血糖', key: true },
          { t: '血脂目标：高危 LDL-C <1.8 mmol/L，极高危 <1.4 mmol/L。', tag: '血脂', key: true },
          { t: '药物推荐 ACEI/ARB，并新增 SGLT2i 与 MRA 的推荐。', tag: '药物', key: true },
        ],
      },
    ],
  },
  {
    id: 'cn-ckd-htn-2023',
    title: '中国慢性肾脏病患者高血压管理指南（2023年版）',
    short: 'CKD 高血压管理指南 2023',
    org: '中华医学会肾脏病学分会',
    region: 'cn',
    dept: 'renal',
    year: 2023,
    latest: true,
    tags: ['血压目标', 'ABPM', 'RAS 阻滞剂', '容量管理'],
    summary: '针对 CKD 人群的血压评估方式、控制目标与降压药物选择给出专门推荐。',
    sections: [
      {
        title: '评估与目标',
        points: [
          { t: '推荐联合诊室血压、家庭血压监测（HBPM）与动态血压监测（ABPM）综合评估。', tag: '评估', key: true },
          { t: 'ABPM 24 小时平均收缩压 ≥130 mmHg 和/或舒张压 ≥80 mmHg 可诊断高血压。', tag: '诊断', key: true },
          { t: '强调「精准控压」：结合年龄、肾功能与合并症制定个体化方案，动态调整。', tag: '理念', key: true },
          { t: '需同时管理血糖，血压与血糖协同损伤肾脏微循环。', tag: '综合', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '推荐 ACEI 或 ARB 作为 CKD 合并高血压的首选，兼具降压与肾脏保护。', tag: '首选', key: true },
          { t: '容量管理是 CKD 高血压的关键，注意限制钠盐摄入并使用利尿剂。', tag: '容量', key: true },
          { t: '联合用药优先选择不同机制药物，避免 ACEI 与 ARB 联用。', tag: '联合', key: true },
          { t: '用药后需监测血肌酐与血钾，警惕高钾血症与急性肾损伤。', tag: '安全', key: true },
        ],
      },
    ],
  },
  {
    id: 'kdigo-bp-2021',
    title: 'KDIGO 慢性肾脏病血压管理指南（2021）',
    short: 'KDIGO 血压管理指南',
    org: '改善全球肾脏病预后组织（KDIGO）',
    region: 'intl',
    dept: 'renal',
    year: 2021,
    latest: true,
    tags: ['血压目标', '标准化测量', 'RAS 阻滞剂'],
    summary: '国际 CKD 血压管理基准，提出收缩压 <120 mmHg 的强化目标（标准化诊室测量）。',
    sections: [
      {
        title: '核心推荐',
        points: [
          { t: '推荐未透析 CKD 患者（含肾移植受者）采用标准化诊室血压测量。', tag: '测量', key: true },
          { t: '建议收缩压目标 <120 mmHg，需标准化测量且患者可耐受（2B 级）。', tag: '目标', key: true },
          { t: '推荐伴白蛋白尿者优先使用 ACEI 或 ARB，并滴定至可耐受最高剂量。', tag: '用药', key: true },
          { t: '不建议 ACEI、ARB 与直接肾素抑制剂联用。', tag: '不推荐', key: true },
        ],
      },
    ],
  },

  /* ================= 糖尿病肾脏病 ================= */
  {
    id: 'cn-dkd-2021',
    title: '糖尿病肾脏疾病临床诊疗中国指南',
    short: '糖尿病肾病中国指南',
    org: '中华医学会肾脏病学分会专家组',
    region: 'cn',
    dept: 'renal',
    year: 2021,
    latest: true,
    tags: ['糖尿病肾病', 'UACR', 'RAS 阻滞剂', 'SGLT2i'],
    summary: '规范糖尿病肾脏病的分期诊断与延缓进展的综合治疗策略。',
    sections: [
      {
        title: '诊断与分期',
        points: [
          { t: '糖尿病患者出现持续白蛋白尿（UACR ≥30 mg/g）和/或 eGFR 下降即可考虑 DKD。', tag: '诊断', key: true },
          { t: '推荐按 eGFR 与白蛋白尿双维度进行风险分层。', tag: '分层', key: true },
          { t: '需与糖尿病合并非糖尿病肾病鉴别，必要时行肾活检。', tag: '鉴别', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '推荐 ACEI 或 ARB 用于伴白蛋白尿的患者，可延缓 DKD 进展。', tag: '一线', key: true },
          { t: '推荐 SGLT2 抑制剂用于 2 型糖尿病合并 DKD 患者，兼具肾脏与心血管获益。', tag: '新药', key: true },
          { t: '推荐控糖、控压、调脂、限盐与戒烟的综合管理。', tag: '综合', key: true },
          { t: '建议 HbA1c 个体化，肾功能下降者警惕低血糖风险。', tag: '目标', key: true },
        ],
      },
    ],
  },
  {
    id: 'kdigo-diabetes-2022',
    title: 'KDIGO 慢性肾脏病合并糖尿病管理指南（2022）',
    short: 'KDIGO 糖尿病 CKD 管理',
    org: '改善全球肾脏病预后组织（KDIGO）',
    region: 'intl',
    dept: 'renal',
    year: 2022,
    latest: true,
    tags: ['SGLT2i', '二甲双胍', 'GLP-1 RA', '综合管理'],
    summary: '确立 CKD 合并糖尿病以 SGLT2i 为核心的肾心保护治疗框架。',
    sections: [
      {
        title: '核心推荐',
        points: [
          { t: '推荐 SGLT2 抑制剂用于 CKD 合并 2 型糖尿病且 eGFR ≥20 ml/min/1.73m² 者。', tag: '一线', key: true },
          { t: '推荐二甲双胍用于 eGFR ≥30 ml/min/1.73m² 者；eGFR 30–44 时减量。', tag: '用药', key: true },
          { t: '推荐 GLP-1 受体激动剂用于血糖控制不达标或需减重者。', tag: '联合', key: true },
          { t: '推荐 ACEI 或 ARB 用于伴白蛋白尿者，并监测血钾。', tag: '用药', key: true },
          { t: '强调以「肾心结局」为目标的药物选择，而非仅关注血糖。', tag: '理念', key: true },
        ],
      },
    ],
  },

  /* ================= 肾小球疾病 ================= */
  {
    id: 'kdigo-gn-2021',
    title: 'KDIGO 肾小球疾病管理指南（2021）',
    short: 'KDIGO 肾小球疾病指南',
    org: '改善全球肾脏病预后组织（KDIGO）',
    region: 'intl',
    dept: 'renal',
    year: 2021,
    latest: true,
    tags: ['IgA 肾病', '狼疮肾炎', '膜性肾病', '免疫抑制'],
    summary: '覆盖 IgA 肾病、膜性肾病、狼疮肾炎等主要肾小球疾病的诊断与免疫抑制治疗。',
    sections: [
      {
        title: 'IgA 肾病',
        points: [
          { t: '推荐以「优化支持治疗」为基础，包括 RAS 阻滞剂与血压控制。', tag: '基础', key: true },
          { t: '尿蛋白持续 ≥1 g/d 且支持治疗后未缓解者，考虑糖皮质激素或免疫抑制治疗。', tag: '激素', key: true },
          { t: '推荐使用国际 IgA 肾病预测工具（IIgAN-PT）评估进展风险。', tag: '评估' },
        ],
      },
      {
        title: '其他肾小球疾病',
        points: [
          { t: '膜性肾病：抗 PLA2R 抗体阳性且风险分层为高危者推荐利妥昔单抗或环磷酰胺。', tag: '膜性', key: true },
          { t: '狼疮肾炎：推荐以糖皮质激素联合霉酚酸酯或环磷酰胺诱导，缓解后维持治疗。', tag: '狼疮', key: true },
          { t: '微小病变：成人与儿童均首选糖皮质激素，频繁复发者可用钙调磷酸酶抑制剂或利妥昔单抗。', tag: 'MCD' },
          { t: '强调肾活检是肾小球疾病分型与治疗决策的基础。', tag: '活检', key: true },
        ],
      },
    ],
  },
  {
    id: 'cn-igan-2024',
    title: '原发性IgA肾病管理和治疗中国专家共识（2024）',
    short: 'IgA 肾病中国共识 2024',
    org: '中国医师协会肾脏内科医师分会等',
    region: 'cn',
    dept: 'renal',
    year: 2024,
    latest: true,
    tags: ['IgA 肾病', '尿蛋白目标', 'MRA', '免疫抑制'],
    summary: '针对我国 IgA 肾病高发特点，给出支持治疗与免疫抑制治疗的分层路径。',
    ref: '2024 年 2 月发表；仅适用于原发性 IgAN，不适用于紫癜性肾炎等继发性 IgAN',
    sections: [
      {
        title: '评估与支持治疗',
        points: [
          { t: '诊断依赖肾活检免疫荧光示肾小球系膜区 IgA 为主沉积，且沉积强度高于其他免疫球蛋白。', tag: '诊断', key: true },
          { t: '尿蛋白控制目标为 <0.5 g/d，是延缓进展的核心指标。', tag: '目标', key: true },
          { t: '支持治疗包括 RAS 阻滞剂、血压控制、限盐与生活方式干预。', tag: '基石', key: true },
          { t: 'RAS 阻滞剂治疗后尿蛋白仍 ≥1 g/d 者，可加用醛固酮受体拮抗剂（如螺内酯 25 mg qd，最大 50 mg qd），需监测血钾。', tag: '联合', key: true },
        ],
      },
      {
        title: '免疫抑制治疗',
        points: [
          { t: '高危进展患者（持续大量蛋白尿、eGFR 下降）可考虑糖皮质激素治疗。', tag: '激素', key: true },
          { t: '使用激素需权衡感染、血糖、骨代谢等不良反应，评估风险获益。', tag: '安全', key: true },
          { t: '强调动态评估疾病进展风险，避免过度治疗或治疗不足。', tag: '原则' },
        ],
      },
    ],
  },
  {
    id: 'kdigo-ln-2024',
    title: 'KDIGO 狼疮肾炎管理临床实践指南（2024）',
    short: 'KDIGO 狼疮肾炎 2024',
    org: '改善全球肾脏病预后组织（KDIGO）',
    region: 'intl',
    dept: 'renal',
    year: 2024,
    latest: true,
    tags: ['狼疮肾炎', '诱导缓解', '霉酚酸酯', '生物制剂'],
    summary: '对 KDIGO 2021 肾小球疾病指南狼疮肾炎章节的聚焦更新，纳入新型生物制剂与联合方案。',
    ref: '2024 年 1 月发布，为 KDIGO 2021 肾小球疾病指南 LN 章节的 focused update',
    sections: [
      {
        title: '分型与评估',
        points: [
          { t: '推荐所有 SLE 患者定期筛查蛋白尿与 eGFR，异常者评估肾活检指征。', tag: '筛查', key: true },
          { t: '按 ISN/RPS 病理分型指导治疗，Ⅲ/Ⅳ 型（弥漫增殖型）为治疗重点。', tag: '分型', key: true },
          { t: '推荐抗 PLA2R 抗体之外，联合补体、抗 dsDNA 抗体等评估活动度。', tag: '评估' },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '诱导缓解：推荐糖皮质激素联合霉酚酸酯或环磷酰胺。', tag: '诱导', key: true },
          { t: '新增推荐：可加用贝利尤单抗、伏环孢素或多靶点方案以提高完全缓解率。', tag: '新推荐', key: true },
          { t: '维持缓解：推荐霉酚酸酯或硫唑嘌呤，疗程一般至少 3 年。', tag: '维持', key: true },
          { t: '推荐羟氯喹用于所有狼疮肾炎患者（除非禁忌），可降低复发与血栓风险。', tag: '基础', key: true },
          { t: '强调控制血压、使用 RAS 阻滞剂减少蛋白尿，并管理感染与骨质疏松。', tag: '综合' },
        ],
      },
    ],
  },

  /* ================= 矿物质骨代谢 ================= */
  {
    id: 'cn-ckd-mbd-2019',
    title: '中国慢性肾脏病矿物质和骨异常诊治指南（2019）',
    short: 'CKD-MBD 诊治指南',
    org: '中华医学会肾脏病学分会',
    region: 'cn',
    dept: 'renal',
    year: 2019,
    latest: true,
    tags: ['钙磷代谢', '继发性甲旁亢', '维生素 D', '血管钙化'],
    summary: '规范 CKD 患者钙磷代谢紊乱、继发性甲状旁腺功能亢进的评估与治疗。',
    sections: [
      {
        title: '评估',
        points: [
          { t: '推荐从 CKD 3 期起定期监测血钙、磷、PTH 与碱性磷酸酶。', tag: '监测', key: true },
          { t: '推荐 CKD 3–5 期检测 25-羟维生素 D 水平。', tag: '监测' },
          { t: '血管钙化评估有助于风险分层，可使用侧位腹平片或 CT。', tag: '评估' },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '血磷管理：限制饮食磷摄入，必要时使用磷结合剂（优先非含钙磷结合剂）。', tag: '降磷', key: true },
          { t: '血钙管理：避免高钙血症，限制含钙磷结合剂与活性维生素 D 的过量使用。', tag: '钙', key: true },
          { t: '继发性甲旁亢：控制磷钙基础上使用活性维生素 D 或拟钙剂（西那卡塞）。', tag: 'PTH', key: true },
          { t: '推荐透析患者使用低钙透析液并个体化调整。', tag: '透析' },
          { t: '避免 PTH 过度抑制（过低 PTH 与无动力骨病相关）。', tag: '注意', key: true },
        ],
      },
    ],
  },

  /* ================= 透析与通路 ================= */
  {
    id: 'cn-dialysis-access-2024',
    title: '透析通路中国指南（2024年版）',
    short: '透析通路中国指南 2024',
    org: '中华医学会肾脏病学分会',
    region: 'cn',
    dept: 'renal',
    year: 2024,
    latest: true,
    tags: ['血管通路', '动静脉内瘘', '导管', '通路维护'],
    summary: '系统规范血液透析与腹膜透析通路的建立、维护、监测与并发症处理。',
    ref: '《中华肾脏病杂志》发表',
    sections: [
      {
        title: '通路规划与建立',
        points: [
          { t: '推荐 CKD 患者 eGFR <30 ml/min/1.73m² 时即开始进行血管通路规划与血管保护。', tag: '时机', key: true },
          { t: '自体动静脉内瘘（AVF）是首选长期通路，应优先保护非优势侧上肢血管。', tag: '首选', key: true },
          { t: '避免在拟建通路侧肢体进行静脉穿刺、置管与输液。', tag: '血管保护', key: true },
          { t: '内瘘成熟一般需 6–8 周，条件允许应「内瘘优先、导管最后」。', tag: '成熟', key: true },
        ],
      },
      {
        title: '维护与并发症',
        points: [
          { t: '推荐定期监测内瘘血流量与通路狭窄，采用物理检查联合超声。', tag: '监测', key: true },
          { t: '内瘘狭窄或血栓形成应尽早干预，可行球囊扩张或取栓。', tag: '干预', key: true },
          { t: '中心静脉导管相关感染需及时评估拔管指征并规范抗感染。', tag: '感染', key: true },
          { t: '强调通路「生命线」理念，建立多学科通路管理团队与随访档案。', tag: '管理', key: true },
        ],
      },
    ],
  },
  {
    id: 'cn-hd-sop-2021',
    title: '血液净化标准操作规程（2021版）',
    short: '血液净化 SOP 2021',
    org: '国家卫生健康委员会',
    region: 'cn',
    dept: 'renal',
    year: 2021,
    latest: true,
    tags: ['血液透析', '腹膜透析', '血管通路', '质量管理'],
    summary: '国家层面规范血液净化中心的布局、操作流程、质量控制与并发症管理。',
    sections: [
      {
        title: '基本要求',
        points: [
          { t: '规范血液透析室（中心）的分区布局、人员资质与设备配置。', tag: '规范', key: true },
          { t: '推荐透析用水与透析液的质量监测达到规定标准。', tag: '质量', key: true },
          { t: '要求建立完善的病历、透析记录与感染监测制度。', tag: '管理' },
        ],
      },
      {
        title: '治疗与并发症',
        points: [
          { t: '推荐个体化制定透析处方（透析器、血流量、超滤量与抗凝方案）。', tag: '处方', key: true },
          { t: '强调透析充分性评估（spKt/V），一般目标 ≥1.2。', tag: '充分性', key: true },
          { t: '规范处理透析中低血压、肌肉痉挛、失衡综合征等急性并发症。', tag: '并发症', key: true },
          { t: '严格执行血源性传染病标志物检测与阳性患者分区透析。', tag: '感控', key: true },
        ],
      },
    ],
  },

  /* ================= 肾性贫血 ================= */
  {
    id: 'cn-renal-anemia',
    title: '肾性贫血诊断与治疗中国专家共识',
    short: '肾性贫血共识',
    org: '中华医学会肾脏病学分会',
    region: 'cn',
    dept: 'renal',
    year: 2018,
    tags: ['肾性贫血', '促红素', '铁剂', 'HIF-PHI'],
    summary: '规范 CKD 患者贫血的评估、铁剂补充与红细胞生成刺激剂的使用。',
    ref: '建议核对是否有更新版本；近年 HIF-PHI（罗沙司他等）相关证据更新较快',
    sections: [
      {
        title: '评估',
        points: [
          { t: '推荐 CKD 患者定期监测血红蛋白、铁代谢指标（铁蛋白、转铁蛋白饱和度）。', tag: '监测', key: true },
          { t: '需先排除其他贫血原因（消化道出血、营养不良、血液系统疾病）。', tag: '鉴别', key: true },
          { t: '铁缺乏的判定需结合铁蛋白与转铁蛋白饱和度，而非单一指标。', tag: '铁代谢', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '血红蛋白目标一般维持在 100–120 g/L，不建议超过 130 g/L。', tag: '目标', key: true },
          { t: '缺铁者优先补铁，可选择口服或静脉铁剂，透析患者多需静脉补铁。', tag: '补铁', key: true },
          { t: '红细胞生成刺激剂（促红素等）需个体化起始剂量并监测血压与血栓风险。', tag: 'ESA', key: true },
          { t: '低氧诱导因子脯氨酰羟化酶抑制剂（HIF-PHI）为口服新选择，需关注血栓与肿瘤风险。', tag: '新药' },
          { t: '积极纠正感染、继发性甲旁亢与营养不良以改善贫血反应。', tag: '综合' },
        ],
      },
    ],
  },
]
