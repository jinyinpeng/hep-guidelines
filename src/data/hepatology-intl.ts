import type { Guideline } from './types'

/**
 * 国际指南 / 共识
 * 说明：要点为原文摘编，用于快速查阅；具体决策请以官方正式发布的最新版原文为准。
 */
export const INTL_GUIDELINES: Guideline[] = [
  /* ================= WHO ================= */
  {
    id: 'who-hbv-hcv-2026',
    title:
      'WHO 乙型肝炎和丙型肝炎预防、检测、治疗、服务提供和监测综合指南（2026）',
    short: 'WHO 乙肝丙肝综合指南',
    org: '世界卫生组织（WHO）',
    region: 'intl',
    dept: 'hepatology',
    year: 2026,
    disease: 'hbv',
    latest: true,
    tags: ['综合指南', '扩大治疗', 'HDV 检测', '任务分担', '消除肝炎'],
    summary:
      '首次将乙肝、丙肝与丁肝指南合并，整合 2015—2025 年间 80 余项循证建议，面向中低收入国家强调服务下沉与简化流程。',
    ref: '2026 年 2 月 15 日发布',
    sections: [
      {
        title: '筛查与检测',
        points: [
          { t: '所有成人、青少年及 > 12 个月儿童均应检测 HBsAg；18 个月以上个体以单一血清学检测初筛 HCV。', tag: '筛查', key: true },
          { t: 'HBsAg 阳性者应行 HBV DNA 核酸检测评估病毒载量；抗-HCV 阳性者应行 HCV RNA 检测确认病毒血症。', tag: '触发检测', key: true },
          { t: '推荐对所有 HBsAg 阳性者检测抗-HDV；资源有限地区优先检测高风险人群（HDV 流行区出生、晚期肝病、透析、HIV/HCV 共感染等）。', tag: 'HDV', key: true },
          { t: '抗-HDV 阳性者需进一步检测 HDV RNA 以确认活动性感染。', tag: 'HDV' },
          { t: '无法静脉采血或快速检测不可及时，可使用干血斑标本（如药物依赖治疗项目、监狱）。', tag: '落地' },
        ],
      },
      {
        title: '乙肝治疗适应证（成人及 ≥ 12 岁青少年）',
        points: [
          { t: '存在显著肝纤维化或肝硬化（APRI > 0.5、肝硬度 > 7.0 kPa）者，无论 HBV DNA 与 ALT 水平如何，均推荐治疗。', tag: '适应证', key: true },
          { t: 'HBV DNA > 2000 IU/mL 且 ALT 高于正常值上限（男性 30 U/L、女性 19 U/L）者推荐治疗。', tag: '适应证', key: true },
          { t: '存在合并感染（HIV、HDV、HCV）、肝硬化或肝癌家族史、免疫抑制、糖尿病等合并症或肝外表现者，无论 ALT 与纤维化程度均推荐治疗。', tag: '适应证', key: true },
          { t: '无法进行 HBV DNA 检测时，ALT 持续异常（6–12 个月内 2 次高于正常值）可作为治疗依据。', tag: '替代' },
        ],
      },
      {
        title: '治疗药物',
        points: [
          { t: '乙肝一线方案：替诺福韦二吡呋酯（TDF）或恩替卡韦（ETV）。', tag: '一线', key: true },
          { t: '存在骨质疏松或肾功能损伤者，优先选择恩替卡韦或丙酚替诺福韦（TAF）。', tag: '一线', key: true },
          { t: '无法获得 TDF 单药时，可用 TDF + 拉米夫定或 TDF + 恩曲他滨复方制剂作为替代。', tag: '替代' },
          { t: '丙肝：推荐所有 ≥ 3 岁慢性丙肝患者使用泛基因型直接抗病毒药物（DAA），无论疾病分期。', tag: '一线', key: true },
          { t: '丙肝泛基因型方案：索磷布韦 + 达拉他韦（12 周）、索磷布韦 + 维帕他韦（12 周）、格卡瑞韦 + 哌仑他韦（8 周）。', tag: '一线', key: true },
          { t: '经治或代偿期肝硬化丙肝患者，疗程需延长至 24 周。', tag: '疗程', key: true },
        ],
      },
      {
        title: '监测与停药',
        points: [
          { t: '乙肝治疗中至少每年 1 次评估无创肝纤维化、ALT、HBV DNA 及乙肝血清学标志物。', tag: '监测', key: true },
          { t: '肝癌监测：所有肝硬化患者、有肝癌家族史者、年龄 > 40 岁且 HBV DNA > 20 000 IU/mL 者，每 6 个月行腹部超声 + AFP。', tag: '肝癌筛查', key: true },
          { t: '治疗第 1 年可每 3–6 个月监测一次，适用于代偿/失代偿期肝硬化、需评估应答与依从性、合并 HIV 感染或肾功能受损者。', tag: '加密监测' },
          { t: '有肝硬化临床证据者需终生服药，不应停药。', tag: '疗程', key: true },
          { t: '无肝硬化者停药需满足：可长期严密随访、HBeAg 阳性者血清学转换后巩固至少 1 年、ALT 持续正常且 HBV DNA 检测不到。', tag: '停药', key: true },
          { t: '停药后出现病毒再激活证据者，建议重新启动抗病毒治疗。', tag: '再治疗' },
        ],
      },
      {
        title: '预防与服务交付',
        points: [
          { t: '所有婴儿出生后 24 小时内（越早越好）接种首剂乙肝疫苗。', tag: '预防', key: true },
          { t: 'HBsAg 阳性孕妇若 HBV DNA ≥ 2×10⁵ IU/mL 或 HBeAg 阳性，自妊娠中期开始使用 TDF 至分娩或婴儿完成疫苗接种。', tag: '母婴阻断', key: true },
          { t: '无法检测 HBV DNA 与 HBeAg 的地区，可考虑对所有 HBsAg 阳性孕妇使用 TDF。', tag: '替代' },
          { t: '服务下沉：在初级保健、社区站点、监狱、抗病毒治疗门诊等提供 HCV 检测与治疗；经培训的非专科医生和护士可承担诊疗任务。', tag: '任务分担', key: true },
          { t: '推动 HIV、梅毒与乙肝「三消」联合检测，尤其将乙肝检测整合到产前保健服务中。', tag: '策略' },
        ],
      },
    ],
  },
  {
    id: 'easl-hbv-2017',
    title: 'EASL 慢性乙型肝炎临床实践指南',
    short: 'EASL 乙肝指南',
    org: '欧洲肝病学会（EASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2017,
    disease: 'hbv',
    tags: ['治疗指征', 'ETV/TDF/TAF', '停药规则', '无创评估'],
    summary: '确立以病毒载量 + ALT + 纤维化分期为核心的治疗指征，明确核苷（酸）类似物的停药规则与长期监测框架。',
    ref: 'EASL Clinical Practice Guidelines on the management of chronic hepatitis B',
    sections: [
      {
        title: '治疗指征',
        points: [
          { t: 'HBV DNA > 2000 IU/mL、ALT 高于正常值上限且存在中重度炎症（≥ A2）或纤维化（≥ F2）者应治疗。', tag: '指征', key: true },
          { t: '肝硬化患者只要检出 HBV DNA 即应治疗，无论 ALT 是否升高。', tag: '指征', key: true },
          { t: 'HBeAg 阳性免疫耐受期（HBV DNA 极高、ALT 正常）一般不建议治疗，但年龄 > 30 岁、有纤维化或肝癌家族史者应重新评估。', tag: '例外', key: true },
          { t: '需接受免疫抑制或化疗的 HBsAg 阳性者应预防性抗病毒治疗。', tag: '预防' },
        ],
      },
      {
        title: '药物与疗程',
        points: [
          { t: '一线药物：恩替卡韦、替诺福韦二吡呋酯、丙酚替诺福韦；聚乙二醇干扰素可作为选择之一。', tag: '一线', key: true },
          { t: 'HBeAg 阳性患者获得稳定 HBeAg 血清学转换并巩固治疗至少 12 个月后可考虑停药。', tag: '停药', key: true },
          { t: 'HBeAg 阴性患者停药后复发率极高，一般推荐长期甚至终身治疗。', tag: '停药', key: true },
          { t: '不推荐使用拉米夫定、阿德福韦酯、替比夫定单药治疗。', tag: '不推荐' },
        ],
      },
      {
        title: '监测',
        points: [
          { t: '肝硬化患者每 6 个月行超声监测 HCC；无肝硬化但存在高危因素者同样建议监测。', tag: '监测', key: true },
          { t: '定量 HBsAg、HBcrAg 等标志物有助于预测治疗后 HBsAg 清除与停药后复发。', tag: '生物标志物' },
          { t: '使用替诺福韦类需监测肾功能与骨密度，尤其老年及有骨病风险者。', tag: '安全性' },
        ],
      },
    ],
  },

  /* ================= 丙型肝炎 ================= */
  {
    id: 'aasld-idsa-hcv',
    title: 'AASLD/IDSA 丙型肝炎检测、管理与治疗建议（持续更新）',
    short: 'AASLD/IDSA 丙肝指南',
    org: '美国肝病研究学会（AASLD）/ 美国感染病学会（IDSA）',
    region: 'intl',
    dept: 'hepatology',
    year: 2024,
    disease: 'hcv',
    latest: true,
    tags: ['普遍筛查', '泛基因型', 'DAA 失败', 'SVR12'],
    summary: '以在线持续更新的方式维护 HCV 诊疗推荐，强调普遍筛查与简化治疗流程。',
    ref: 'HCV Guidance: Recommendations for Testing, Managing, and Treating Hepatitis C',
    sections: [
      {
        title: '筛查与诊断',
        points: [
          { t: '所有 18 岁以上成人应至少接受一次 HCV 筛查；有持续危险因素者应定期复查。', tag: '筛查', key: true },
          { t: '妊娠期女性每次妊娠均应筛查 HCV。', tag: '筛查' },
          { t: '抗-HCV 阳性后需检测 HCV RNA 以确认现症感染；RNA 阴性者视为既往感染已清除。', tag: '诊断', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '初治、无肝硬化患者可选：格卡瑞韦/哌仑他韦 8 周，或索磷布韦/维帕他韦 12 周。', tag: '一线', key: true },
          { t: '代偿期肝硬化患者推荐 12 周泛基因型方案（如索磷布韦/维帕他韦或格卡瑞韦/哌仑他韦）。', tag: '一线' },
          { t: '失代偿期肝硬化：索磷布韦/维帕他韦联合利巴韦林 12 周，禁用含蛋白酶抑制剂方案。', tag: '禁忌', key: true },
          { t: 'DAA 治疗失败者应依据耐药相关变异检测结果选择挽救方案，可包括索磷布韦/维帕他韦/伏西瑞韦或联合利巴韦林/索磷布韦。', tag: '挽救', key: true },
          { t: '严重肾功能不全或透析患者可选用格卡瑞韦/哌仑他韦，含索磷布韦方案需谨慎评估。', tag: '特殊人群' },
        ],
      },
      {
        title: '评估与随访',
        points: [
          { t: '治疗前应评估肝纤维化程度、HBsAg/HBV DNA（共感染风险）、HIV 状态、肾功能、妊娠状态及合并用药。', tag: '评估', key: true },
          { t: '治疗结束 12 周 HCV RNA 检测不到（SVR12）即判定治愈。', tag: '疗效', key: true },
          { t: '合并 HBV 感染者 DAA 治疗期间需监测 HBV 再激活，必要时启动抗 HBV 治疗。', tag: '共感染', key: true },
          { t: '获得 SVR 的肝硬化患者仍需每 6 个月行超声 + AFP 监测 HCC。', tag: '随访', key: true },
        ],
      },
    ],
  },
  {
    id: 'easl-hcv-2020',
    title: 'EASL 丙型肝炎治疗推荐（最终更新版）',
    short: 'EASL 丙肝治疗推荐',
    org: '欧洲肝病学会（EASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2020,
    disease: 'hcv',
    tags: ['泛基因型方案', '微消除', '失代偿肝硬化', 'DAA 失败'],
    summary: '明确泛基因型时代的简化治疗路径，并首次系统提出 HCV 微消除（micro-elimination）策略。',
    ref: 'EASL recommendations on treatment of hepatitis C: Final update of the series',
    sections: [
      {
        title: '治疗原则',
        points: [
          { t: '所有 HCV 感染者均应接受治疗（预期寿命极短者除外），无需以纤维化分期作为治疗前提。', tag: '原则', key: true },
          { t: '泛基因型方案已使治疗前基因型检测不再是必需。', tag: '简化', key: true },
          { t: '采用微消除策略：按人群（透析、血友病、注射吸毒者、囚犯、HIV 共感染等）分层推进消除目标。', tag: '策略', key: true },
        ],
      },
      {
        title: '方案选择',
        points: [
          { t: '初治、无肝硬化：格卡瑞韦/哌仑他韦 8 周，或索磷布韦/维帕他韦 12 周。', tag: '一线', key: true },
          { t: '代偿期肝硬化：12 周泛基因型方案。', tag: '方案' },
          { t: '失代偿期肝硬化（Child-Pugh B/C）：索磷布韦/维帕他韦联合利巴韦林 12 周，并评估肝移植。', tag: '方案', key: true },
          { t: 'DAA 经治失败：索磷布韦/维帕他韦/伏西瑞韦 12 周 ± 利巴韦林；或格卡瑞韦/哌仑他韦 + 索磷布韦 + 利巴韦林 12–16 周。', tag: '挽救', key: true },
        ],
      },
    ],
  },
  {
    id: 'kasl-hcv-2025',
    title: 'KASL 丙型肝炎治疗指南（2025）',
    short: 'KASL 丙肝指南',
    org: '韩国肝病学会（KASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2025,
    disease: 'hcv',
    tags: ['亚洲人群', 'DAA', '简化治疗'],
    summary: '面向亚洲人群更新丙肝诊疗推荐，病毒学治愈率已超过 95%。',
    ref: 'KASL clinical practice guidelines for the management of hepatitis C',
    sections: [
      {
        title: '要点',
        points: [
          { t: '直接抗病毒药物时代丙肝病毒学治愈率已超过 95%，治疗目标是实现 SVR12。', tag: '疗效', key: true },
          { t: '推荐泛基因型方案，减少治疗前检测项目与随访复杂度，提高治疗可及性。', tag: '策略', key: true },
          { t: '肝硬化患者即使获得 SVR 仍需持续监测 HCC 与肝功能失代偿。', tag: '随访', key: true },
          { t: '强调筛查—转诊—治疗—随访的闭环管理，以推进消除目标。', tag: '管理' },
        ],
      },
    ],
  },

  /* ================= 脂肪性肝病 ================= */
  {
    id: 'easl-masld-2024',
    title: 'EASL–EASD–EASO 代谢功能障碍相关脂肪性肝病（MASLD）临床实践指南（2024）',
    short: 'EASL MASLD 指南',
    org: '欧洲肝病学会（EASL）、欧洲糖尿病学会（EASD）、欧洲肥胖学会（EASO）',
    region: 'intl',
    dept: 'hepatology',
    year: 2024,
    disease: 'masld',
    latest: true,
    tags: ['MASLD', 'MetALD', 'FIB-4', 'resmetirom', 'GLP-1'],
    summary: '首个以 MASLD 新命名发布的多学会联合指南，建立「FIB-4 → 肝硬度」两阶梯筛查路径与药物治疗框架。',
    ref: 'Journal of Hepatology, 2024',
    sections: [
      {
        title: '命名与诊断',
        points: [
          { t: 'NAFLD 正式更名为 MASLD（代谢功能障碍相关脂肪性肝病）；合并过量饮酒且存在代谢异常者定义为 MetALD。', tag: '命名', key: true },
          { t: '诊断需同时具备肝脏脂肪变（影像或组织学）与至少 1 项心血管代谢危险因素。', tag: '诊断', key: true },
          { t: '单纯影像学脂肪变但无代谢危险因素者不应诊断为 MASLD，需寻找其他病因。', tag: '鉴别' },
        ],
      },
      {
        title: '筛查与风险分层',
        points: [
          { t: '2 型糖尿病、肥胖、代谢综合征及肝脏生化异常者应系统筛查 MASLD 与进展期纤维化。', tag: '筛查', key: true },
          { t: '第一步用 FIB-4：< 1.3 为低风险（可 1–2 年复查）；1.3–2.67 为中风险，进入第二步；> 2.67 为高风险，直接转诊。', tag: '分层', key: true },
          { t: '第二步用肝脏硬度检测（或 ELF）：< 8 kPa 可排除进展期纤维化，≥ 12 kPa 提示 cACLD，8–12 kPa 需进一步评估。', tag: '分层', key: true },
          { t: '5 年以上 2 型糖尿病、肥胖合并代谢异常者属高危人群，进展期纤维化与肝脏相关事件风险显著升高。', tag: '高危' },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '生活方式干预是所有患者的基础：减重 3%–5% 改善肝脂肪变，7%–10% 改善脂肪性肝炎与纤维化。', tag: '基石', key: true },
          { t: 'resmetirom（甲状腺激素受体 β 激动剂）可用于 F2–F3 期 MASH 患者（2024 年获批）。', tag: '药物', key: true },
          { t: 'GLP-1 受体激动剂（如司美格鲁肽）对改善 MASH 有益，尤其适用于合并肥胖或糖尿病者。', tag: '药物', key: true },
          { t: '合并 2 型糖尿病者优先选择吡格列酮或 GLP-1 受体激动剂；吡格列酮可改善组织学。', tag: '药物' },
          { t: 'MASLD 患者使用他汀安全，心血管疾病是首位死因，应积极管理心血管风险。', tag: '心血管', key: true },
          { t: '不常规推荐维生素 E（仅可用于非糖尿病、活检证实 MASH 者）。', tag: '不推荐' },
        ],
      },
      {
        title: '长期管理',
        points: [
          { t: '建议完全戒酒或严格限量，酒精与代谢因素协同加重肝损伤。', tag: '生活方式' },
          { t: '肝硬化患者应筛查食管胃静脉曲张并每 6 个月行 HCC 监测。', tag: '监测', key: true },
          { t: '合并肥胖且符合标准者可考虑减重手术，可改善肝脏组织学。', tag: '进阶' },
        ],
      },
    ],
  },
  {
    id: 'aasld-masld-2023',
    title: 'AASLD 代谢功能障碍相关脂肪性肝病实践指导（2023，2025 关键更新）',
    short: 'AASLD MASLD 实践指导',
    org: '美国肝病研究学会（AASLD）',
    region: 'intl',
    dept: 'hepatology',
    year: 2025,
    disease: 'masld',
    latest: true,
    tags: ['FIB-4', 'VCTE', 'MRE', '司美格鲁肽', 'resmetirom'],
    summary: '提供临床可操作的无创评估路径与治疗选择；2025 年更新新增司美格鲁肽用于 MASH 的患者选择与监测建议。',
    ref: 'AASLD Practice Guidance on MASLD；2025 年 11 月发布关键更新（MASH 的司美格鲁肽治疗）',
    sections: [
      {
        title: '评估',
        points: [
          { t: '对 2 型糖尿病、肥胖合并代谢危险因素者，使用 FIB-4 进行纤维化初筛。', tag: '筛查', key: true },
          { t: '腹部超声为一线影像检查；振动控制瞬时弹性成像（VCTE）用于评估肝硬度。', tag: '影像', key: true },
          { t: '磁共振弹性成像（MRE）是当前最准确的纤维化无创评估手段（资源允许时）。', tag: '影像' },
          { t: 'FIB-4 ≥ 1.3 或肝硬度升高者应转诊肝病专科进一步评估。', tag: '转诊' },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '结构化生活方式干预是核心，目标减重 7%–10%；可采用结构化饮食、运动处方与行为治疗。', tag: '基石', key: true },
          { t: 'resmetirom 用于 F2–F3 期 MASH；司美格鲁肽（GLP-1 受体激动剂）2025 年更新纳入 MASH 治疗选择。', tag: '药物', key: true },
          { t: '司美格鲁肽主要适用于合并肥胖或 2 型糖尿病的 MASH 患者，起始与加量应逐步进行并监测胃肠道反应。', tag: '药物', key: true },
          { t: '吡格列酮可用于合并 2 型糖尿病的 MASH 患者；维生素 E 可考虑用于非糖尿病、活检证实 MASH 者。', tag: '药物' },
          { t: '不推荐将二甲双胍作为 MASH 特异性治疗药物（降糖与心血管获益仍然适用）。', tag: '不推荐' },
          { t: '全面评估并管理心血管风险，他汀在 MASLD 患者中安全且推荐使用。', tag: '心血管', key: true },
        ],
      },
      {
        title: '监测',
        points: [
          { t: 'MASLD 肝硬化患者应筛查食管胃静脉曲张，并每 6 个月行超声 ± AFP 监测 HCC。', tag: '监测', key: true },
          { t: '无肝硬化者可根据纤维化风险分级定期复查肝酶、FIB-4 与肝硬度。', tag: '随访' },
        ],
      },
    ],
  },

  /* ================= 酒精性肝病 ================= */
  {
    id: 'aasld-ald-2023',
    title: 'AASLD 酒精相关肝病实践指导（2023）',
    short: 'AASLD 酒精相关肝病指导',
    org: '美国肝病研究学会（AASLD）',
    region: 'intl',
    dept: 'hepatology',
    year: 2023,
    disease: 'ald',
    tags: ['酒精使用筛查', '泼尼松龙', 'Lille 评分', '巴氯芬', '早期肝移植'],
    summary: '强调酒精使用障碍的系统筛查与治疗，规范重症酒精性肝炎的激素方案与早期肝移植筛选。',
    sections: [
      {
        title: '筛查与评估',
        points: [
          { t: '所有肝病患者均应接受酒精使用筛查，推荐使用 AUDIT-C 等标准化工具量化饮酒量。', tag: '筛查', key: true },
          { t: '筛查阳性者应进一步评估酒精使用障碍（AUD）严重程度并提供戒酒干预与转介治疗。', tag: '评估', key: true },
          { t: '重症酒精性肝炎：Maddrey 判别函数 ≥ 32 或 MELD ≥ 20，可在无禁忌的情况下使用糖皮质激素。', tag: '诊断', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '完全戒酒是唯一能改善各阶段酒精相关肝病预后的措施，应贯穿全程反复干预。', tag: '基石', key: true },
          { t: '泼尼松龙 40 mg/d × 28 天；第 7 天 Lille 评分 ≥ 0.45 提示无应答，应停用激素。', tag: '激素', key: true },
          { t: '营养支持：优先肠内营养，蛋白质摄入 1.2–1.5 g/kg/d，避免蛋白质限制。', tag: '营养', key: true },
          { t: '药物辅助戒酒：巴氯芬为肝硬化患者首选；阿坎酸可用；纳曲酮因潜在肝毒性需谨慎。', tag: '戒酒药', key: true },
          { t: '对激素无应答且严格筛选合格的患者，早期肝移植可作为治疗选项。', tag: '移植', key: true },
          { t: '不推荐己酮可可碱或英夫利西单抗用于重症酒精性肝炎。', tag: '不推荐' },
        ],
      },
      {
        title: '随访',
        points: [
          { t: '酒精性肝硬化患者须筛查静脉曲张并每 6 个月监测 HCC。', tag: '监测', key: true },
          { t: '重视精神心理支持与多学科协作，降低复饮率。', tag: '管理' },
        ],
      },
    ],
  },
  {
    id: 'easl-ald-2018',
    title: 'EASL 酒精性肝病临床实践指南（2018）',
    short: 'EASL 酒精性肝病指南',
    org: '欧洲肝病学会（EASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2018,
    disease: 'ald',
    tags: ['饮酒阈值', '酒精性肝炎', '戒酒', '营养'],
    summary: '界定有害饮酒的剂量阈值与疾病自然史，规范酒精性肝炎的诊断与治疗路径。',
    sections: [
      {
        title: '剂量与风险评估',
        points: [
          { t: '有害饮酒阈值：男性每日 > 30 g 乙醇、女性每日 > 20 g 乙醇，肝损伤风险随剂量递增。', tag: '阈值', key: true },
          { t: '酒精与肥胖、病毒性肝炎、代谢因素存在协同作用，共同显著增加肝硬化和 HCC 风险。', tag: '协同', key: true },
          { t: '酒精性肝病诊断需结合饮酒史、实验室指标与影像/组织学，并排除其他病因。', tag: '诊断' },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '戒酒是治疗的基础，须配合心理干预与药物辅助（巴氯芬、阿坎酸、纳曲酮）。', tag: '基石', key: true },
          { t: '重症酒精性肝炎可使用泼尼松龙 40 mg/d × 28 天，Lille 评分评估应答。', tag: '激素', key: true },
          { t: '所有患者均应接受营养评估与支持，必要时补充维生素与微量元素。', tag: '营养', key: true },
          { t: '发生肝硬化并发症（腹水、肝性脑病、静脉曲张出血）者按相应指南处理并评估肝移植。', tag: '并发症' },
        ],
      },
    ],
  },

  /* ================= 肝硬化与门静脉高压 ================= */
  {
    id: 'baveno-8-2026',
    title: 'Baveno Ⅷ 门静脉高压共识（2026）',
    short: 'Baveno Ⅷ 共识',
    org: 'Baveno 合作组织、VALDIG（血管性肝病兴趣组）',
    region: 'intl',
    dept: 'hepatology',
    year: 2026,
    disease: 'cirrhosis',
    latest: true,
    tags: ['CSPH', 'LSM', '卡维地洛', 'p-TIPS', '再代偿', 'PVT'],
    summary:
      '共形成 272 条声明与建议，以无创指标（LSM、血小板、脾硬度）为核心、以「预防失代偿」为终点，首次系统纳入代谢因素、肝硬化临床治愈、血管性肝病与门静脉血栓。',
    ref: 'Baveno Ⅷ Consensus Conference（2026 年 3 月，意大利 Baveno）；Journal of Hepatology',
    sections: [
      {
        title: 'cACLD 与 CSPH 无创分层',
        points: [
          { t: '肝硬度（LSM）< 10 kPa 可排除 cACLD；10–15 kPa 提示 cACLD；> 15 kPa 高度提示 cACLD。', tag: '分层', key: true },
          { t: '排除临床显著门脉高压（CSPH）：LSM ≤ 15 kPa 且血小板 ≥ 150×10⁹/L，阴性预测值 > 90%。', tag: '排除', key: true },
          { t: '确诊 CSPH：LSM ≥ 25 kPa；脾硬度（SSM，100 Hz）> 55 kPa。', tag: '确诊', key: true },
          { t: '推荐使用 ANTICIPATE 模型（LSM + 血小板）评估 CSPH 概率，SSM 可进一步细化分层。', tag: '模型' },
          { t: '可免内镜（EGD）条件：LSM < 20 kPa 且血小板 ≥ 150×10⁹/L、SSM < 40 kPa。', tag: '免内镜', key: true },
          { t: '分层不确定者建议 12 个月后复查，以 CSPH 进展或首次失代偿为观察终点。', tag: '随访' },
        ],
      },
      {
        title: '脂肪性肝病与代谢因素',
        points: [
          { t: '酒精与肥胖/代谢因素是 cACLD 进展的重要驱动，需全程关注病因治疗。', tag: '病因', key: true },
          { t: 'LSM 变化 ≥ 30% 与临床事件风险变化相关；LSM 降低 ≥ 30% 或 ELF 降低 > 0.5 单位提示纤维化改善。', tag: '疗效' },
          { t: 'MASLD 相关 cACLD 中 HVPG 可能低估真实门静脉压力；HVPG ≥ 10 mmHg 与失代偿相关。', tag: '注意' },
          { t: '代谢与减重手术可改善 CSPH 并可能改善组织学结局。', tag: '干预' },
          { t: 'SGLT2 抑制剂与 GLP-1 受体激动剂在无禁忌证时可安全用于 cACLD。', tag: '安全性', key: true },
          { t: '目前尚无获批用于 MASLD 合并肝硬化的药物，治疗聚焦生活方式优化与代谢合并症管理。', tag: '现状' },
        ],
      },
      {
        title: '预防失代偿与再代偿',
        points: [
          { t: '首次失代偿事件包括：临床明显腹水、静脉曲张出血、显性肝性脑病（West Haven Ⅱ 级及以上）、HCC。', tag: '定义', key: true },
          { t: '卡维地洛等 NSBB 推荐用于 CSPH 患者预防首次失代偿；无 CSPH 者不应使用 NSBB。', tag: '一级预防', key: true },
          { t: 'EVL 用于预防首次静脉曲张出血；GOV2、IGV1 型胃底静脉曲张可考虑 NSBB 或局部治疗。', tag: '一级预防' },
          { t: '他汀类药物可考虑用于预防失代偿。', tag: '一级预防' },
          { t: '「肝硬化临床治愈（再代偿）」标准：病因去除或抑制、无腹水、无肝性脑病、无静脉曲张出血、CTP A5/A6 并持续 > 6 个月。', tag: '再代偿', key: true },
          { t: 'HVPG < 10 mmHg 可确认临床治愈，可停用卡维地洛/NSBB。', tag: '再代偿', key: true },
        ],
      },
      {
        title: '失代偿期管理',
        points: [
          { t: '首次失代偿后应评估肝移植指征；有出血史者二级预防为 NSBB + EVL 联合。', tag: '管理', key: true },
          { t: 'HRS-AKI 时应停用卡维地洛/NSBB，恢复后重新评估；HRS-AKI 治疗为特利加压素 + 白蛋白，去甲肾上腺素可替代。', tag: 'HRS-AKI', key: true },
          { t: '难治性腹水首选 TIPS，TIPS 与肝移植应同时评估；不适合 TIPS 者可用白蛋白治疗改善腹水控制。', tag: '腹水', key: true },
          { t: '复发性/持续性肝性脑病可评估门体分流栓塞，肝移植优于 TIPS。', tag: 'HE' },
          { t: '有 SBP 病史者避免使用非选择性 NSAIDs；失代偿患者应停用或调整非必要药物（如 PPI）。', tag: '用药', key: true },
          { t: '重视结构化营养评估、个体化营养计划与体育活动指导。', tag: '营养' },
        ],
      },
      {
        title: '急性静脉曲张出血',
        points: [
          { t: '目标血红蛋白 7–8 g/dL，避免过度输血。', tag: '输血', key: true },
          { t: '疑似出血时立即启动血管活性药物（生长抑素、奥曲肽或特利加压素），疗程 2–5 天。', tag: '急救', key: true },
          { t: '推荐使用预防性抗生素；应在 12 小时内行内镜检查与治疗。', tag: '处理', key: true },
          { t: '治疗失败定义为 5 天内未能控制出血或发生再出血。', tag: '定义' },
          { t: '抢先 TIPS（p-TIPS）：72 小时内（理想 < 24 小时）用于食管静脉曲张/GOV-1 出血且 Child-Pugh C 10–13 分、Child-Pugh B > 7 分或 HVPG ≥ 20 mmHg 者。', tag: 'p-TIPS', key: true },
          { t: '自膨式金属支架（cSEMS）可作为食管静脉曲张出血的桥接治疗。', tag: '桥接' },
          { t: '胃底静脉曲张出血（GOV-2、IGV1 及异位静脉曲张）为高危事件，需多学科处理。', tag: '高危', key: true },
        ],
      },
      {
        title: '血管性肝病与门静脉血栓',
        points: [
          { t: '血管性肝病涵盖布加综合征（BCS）、门静脉窦血管病（PSVD）与非肝硬化性门静脉纤维化（NCPF）。', tag: '范围' },
          { t: '抗凝首选低分子肝素，长期可用直接口服抗凝药（DOACs）；需排除抗磷脂综合征、骨髓增殖性肿瘤等。', tag: '抗凝', key: true },
          { t: 'DOACs 在 Child-Pugh A 安全；Child-Pugh B 需谨慎；Child-Pugh C 不推荐。', tag: '安全性', key: true },
          { t: 'PSVD/NCPF 需肝活检确诊（组织条 ≥ 15 mm 或 ≥ 10 mm）；脾硬度 > 40 kPa 提示门静脉高压。', tag: '诊断' },
          { t: '无或轻度静脉曲张者每 2 年复查内镜；大静脉曲张者每 1 年复查。', tag: '监测' },
          { t: '急性门静脉血栓应尽早抗凝，6 个月后评估；完全再通且危险因素消除者可考虑停药。', tag: 'PVT', key: true },
          { t: '肝硬化患者门静脉血栓筛查应与 HCC 影像随访同步进行。', tag: 'PVT' },
        ],
      },
    ],
  },
  {
    id: 'aasld-ascites-2021',
    title: 'AASLD 腹水、自发性腹膜炎与肝肾综合征实践指导（2021）',
    short: 'AASLD 腹水/SBP/HRS 指导',
    org: '美国肝病研究学会（AASLD）',
    region: 'intl',
    dept: 'hepatology',
    year: 2021,
    disease: 'cirrhosis',
    latest: true,
    tags: ['SAAG', 'SBP', '白蛋白', '利尿剂', 'HRS-AKI'],
    summary: '系统规范腹水诊断分层、SBP 诊治与白蛋白应用、HRS-AKI 的血管收缩剂治疗。',
    ref: 'AASLD Practice Guidance: Diagnosis, Evaluation, and Management of Ascites, SBP and HRS',
    sections: [
      {
        title: '腹水诊断',
        points: [
          { t: '所有新发腹水、住院腹水或腹水恶化患者均应行诊断性腹腔穿刺。', tag: '穿刺', key: true },
          { t: 'SAAG ≥ 1.1 g/dL 提示门静脉高压性腹水（准确率约 97%）；腹水总蛋白 < 2.5 g/dL 支持肝硬化性腹水。', tag: '鉴别', key: true },
          { t: '腹水细胞计数应计算多形核中性粒细胞（PMN），并做腹水培养。', tag: '检查' },
        ],
      },
      {
        title: '腹水治疗',
        points: [
          { t: '限制钠摄入（通常 < 2 g/d），一般无需限水，除非血钠 < 125 mmol/L。', tag: '基础', key: true },
          { t: '一线利尿方案：螺内酯 100 mg + 呋塞米 40 mg（100:40 比例），按需递增。', tag: '一线', key: true },
          { t: '大量放腹水（> 5 L）需补充白蛋白 6–8 g/L 放液量，预防穿刺后循环功能障碍。', tag: '白蛋白', key: true },
          { t: '难治性腹水：连续大量放腹水 + 白蛋白、TIPS 评估与肝移植评估。', tag: '难治', key: true },
        ],
      },
      {
        title: 'SBP 与 HRS',
        points: [
          { t: 'SBP 诊断：腹水 PMN ≥ 250/mm³。', tag: 'SBP', key: true },
          { t: 'SBP 治疗：第三代头孢菌素（如头孢噻肟 2 g q8h）5–7 天；避免使用氨基糖苷类。', tag: 'SBP', key: true },
          { t: 'SBP 患者应联合白蛋白（第 1 天 1.5 g/kg、第 3 天 1 g/kg）以降低 HRS-AKI 与病死率。', tag: 'SBP', key: true },
          { t: 'SBP 一级预防：腹水总蛋白 < 1.5 g/dL，或 < 2.5 g/dL 伴肝肾功能不全者，使用诺氟沙星或复方磺胺甲噁唑。', tag: '预防', key: true },
          { t: 'SBP 发作后应进行二级预防，直至肝移植或死亡。', tag: '二级预防' },
          { t: 'HRS-AKI：特利加压素联合白蛋白为首选；去甲肾上腺素或米多君联合奥曲肽可作为替代。', tag: 'HRS-AKI', key: true },
          { t: '所有 HRS-AKI 患者应尽快评估肝移植。', tag: '移植', key: true },
        ],
      },
    ],
  },
  {
    id: 'easl-decompensated-2018',
    title: 'EASL 失代偿期肝硬化管理临床实践指南（2018）',
    short: 'EASL 失代偿期肝硬化指南',
    org: '欧洲肝病学会（EASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2018,
    disease: 'cirrhosis',
    tags: ['失代偿', '肝移植评估', 'HRS', '肝性脑病'],
    summary: '确立失代偿期肝硬化的整体管理框架与肝移植评估时机。',
    sections: [
      {
        title: '总体原则',
        points: [
          { t: '失代偿期肝硬化患者应尽早转诊并评估肝移植指征，不应等到终末期。', tag: '核心', key: true },
          { t: '按 Child-Pugh、MELD 评分动态评估病情与预后。', tag: '评估' },
          { t: '去除或抑制病因（抗病毒、戒酒、控制代谢因素）仍是改善预后的基础。', tag: '病因', key: true },
        ],
      },
      {
        title: '并发症处理',
        points: [
          { t: '肝性脑病：乳果糖为一线治疗，反复发作者联合利福昔明；重视诱因排查与营养支持。', tag: 'HE', key: true },
          { t: 'HRS-AKI：特利加压素联合白蛋白效果优于米多君联合奥曲肽。', tag: 'HRS', key: true },
          { t: '腹水与 SBP 的处理参照腹水管理指南；大量放腹水需补充白蛋白。', tag: '腹水' },
          { t: '预防性抗生素用于消化道出血后及高危 SBP 人群，可降低感染与病死率。', tag: '抗生素' },
          { t: '不应限制蛋白质摄入，肝性脑病患者同样需保证蛋白质供给。', tag: '营养', key: true },
        ],
      },
    ],
  },

  /* ================= 肝癌 ================= */
  {
    id: 'easl-hcc-2024',
    title: 'EASL 肝细胞癌管理临床实践指南（2024）',
    short: 'EASL 肝癌指南',
    org: '欧洲肝病学会（EASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2024,
    disease: 'hcc',
    latest: true,
    tags: ['监测', '影像诊断', '联合免疫治疗', '肝移植', '放疗'],
    summary: '强调个体化监测、影像与诊断标准标准化，以及在不同疾病阶段使用联合免疫治疗，并重申放疗与肝移植地位。',
    ref: 'EASL Clinical Practice Guidelines on the management of hepatocellular carcinoma（2024 年 12 月发布）',
    sections: [
      {
        title: '预防与监测',
        points: [
          { t: '肝硬化及高危慢性肝病人群应每 6 个月行腹部超声 ± AFP 监测，强调个体化监测策略。', tag: '监测', key: true },
          { t: '有效抗病毒治疗、戒酒、控制代谢危险因素可降低 HCC 发生风险（预防为先）。', tag: '预防', key: true },
          { t: '推荐使用新的监测工具与风险分层模型，提高早期检出率。', tag: '策略' },
        ],
      },
      {
        title: '诊断',
        points: [
          { t: '推荐标准化肝脏影像检查流程与诊断标准，在多期增强 CT/MRI 上依据典型强化方式作出无创诊断。', tag: '诊断', key: true },
          { t: '高危人群中影像学典型表现即可诊断 HCC，无需强行活检。', tag: '诊断' },
          { t: '推荐采用 BCLC 分期系统指导治疗决策与临床试验入组。', tag: '分期', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '早期 HCC：手术切除、局部消融与肝移植是根治性手段，需个体化选择。', tag: '早期', key: true },
          { t: '中期 HCC：以经动脉治疗（TACE）为基础，可联合系统治疗。', tag: '中期' },
          { t: '晚期 HCC：推荐在不同疾病阶段使用联合免疫治疗（如免疫检查点抑制剂联合抗血管生成药物）。', tag: '晚期', key: true },
          { t: '重申放射治疗在 HCC 综合治疗中的地位。', tag: '放疗' },
          { t: '重视手术与局部治疗之间的衔接与序贯安排，避免治疗过度或不足。', tag: '衔接' },
        ],
      },
    ],
  },
  {
    id: 'aasld-hcc-2025',
    title: 'AASLD 肝细胞癌预防、诊断和治疗实践指导（2023，2025 关键更新）',
    short: 'AASLD 肝癌实践指导',
    org: '美国肝病研究学会（AASLD）',
    region: 'intl',
    dept: 'hepatology',
    year: 2025,
    disease: 'hcc',
    latest: true,
    tags: ['监测', 'LI-RADS', '切除', '消融', '辅助治疗', 'IMbrave050'],
    summary: '规范 HCC 监测、影像诊断与各期治疗；2025 年关键更新围绕 IMbrave050 研究结果调整术后辅助治疗建议。',
    ref: 'AASLD Practice Guidance on prevention, diagnosis, and treatment of HCC；2025 年关键更新',
    sections: [
      {
        title: '监测与诊断',
        points: [
          { t: '肝硬化患者及高危慢性 HBV 感染者应每 6 个月行腹部超声 ± AFP 监测。', tag: '监测', key: true },
          { t: '监测依从性是影响早期发现与生存的关键因素。', tag: '依从性', key: true },
          { t: '采用多期增强 CT 或 MRI 进行诊断，推荐使用 LI-RADS 分类；可影像学确诊者不推荐常规活检。', tag: '诊断', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '早期 HCC：手术切除、局部消融（射频/微波）与肝移植为主要根治手段。', tag: '早期', key: true },
          { t: '肝移植常用标准为单个肿瘤 ≤ 5 cm，或 ≤ 3 个肿瘤且最大直径 ≤ 3 cm（Milan 标准）。', tag: '移植' },
          { t: '中期 HCC：TACE 为主要治疗手段，可根据情况联合其他治疗。', tag: '中期' },
          { t: '晚期一线：阿替利珠单抗联合贝伐珠单抗、度伐利尤单抗联合替西木单抗，或仑伐替尼、索拉非尼等。', tag: '一线', key: true },
          { t: '晚期二线：瑞戈非尼、卡博替尼、雷莫西尤单抗等。', tag: '二线' },
          { t: '2025 年关键更新围绕 IMbrave050 研究最新分析结果，对根治性治疗后高复发风险患者的辅助治疗选择进行了调整。', tag: '更新', key: true },
        ],
      },
    ],
  },

  /* ================= 药物性肝损伤 ================= */
  {
    id: 'easl-dili-2019',
    title: 'EASL 药物性肝损伤临床实践指南（2019）',
    short: 'EASL DILI 指南',
    org: '欧洲肝病学会（EASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2019,
    disease: 'dili',
    tags: ['排除性诊断', 'RUCAM', '阈值', '免疫检查点抑制剂'],
    summary: '确立 DILI 作为排除性诊断的判断阈值、因果评估方法与严重程度分级，涵盖草药与免疫治疗相关肝损伤。',
    sections: [
      {
        title: '诊断阈值与评估',
        points: [
          { t: 'DILI 是排除性诊断，须系统排除病毒性肝炎、自身免疫性肝炎、胆道梗阻、缺血性肝损伤等。', tag: '原则', key: true },
          { t: '识别阈值：ALT > 5×ULN，或 ALP > 2×ULN 伴 GGT 升高，或 ALT > 3×ULN 伴 TBil > 2×ULN。', tag: '阈值', key: true },
          { t: '推荐使用 RUCAM 量表进行因果关系评估，并记录用药时间、停药后转归与再暴露情况。', tag: '评估', key: true },
          { t: '按严重程度分为 1–5 级，肝衰竭或需肝移植者为最严重级别。', tag: '分级' },
        ],
      },
      {
        title: '处理',
        points: [
          { t: '立即停用可疑药物是首要措施；多数患者停药后肝功能可自行恢复。', tag: '首要', key: true },
          { t: '对乙酰氨基酚中毒使用 N-乙酰半胱氨酸解毒。', tag: '解毒', key: true },
          { t: '免疫检查点抑制剂相关肝损伤按 CTCAE 分级决定是否暂停用药、使用糖皮质激素或加用免疫抑制剂。', tag: 'ICI', key: true },
          { t: '草药与膳食补充剂是 DILI 的重要病因，须详细询问患者用药与保健品使用史。', tag: '病因', key: true },
        ],
      },
    ],
  },

  /* ================= 自身免疫性肝病 ================= */
  {
    id: 'aasld-aih-2019',
    title: 'AASLD 自身免疫性肝炎诊断与管理实践指导（2019）',
    short: 'AASLD AIH 指导',
    org: '美国肝病研究学会（AASLD）',
    region: 'intl',
    dept: 'hepatology',
    year: 2019,
    disease: 'autoimmune',
    tags: ['AIH', '泼尼松', '硫唑嘌呤', '布地奈德', '缓解标准'],
    summary: '规范 AIH 的诊断评分、初始与替代免疫抑制方案，以及缓解判定与停药标准。',
    sections: [
      {
        title: '诊断',
        points: [
          { t: '诊断基于转氨酶升高、IgG 升高、自身抗体阳性与组织学特征的综合判断，并排除其他病因。', tag: '诊断', key: true },
          { t: '所有疑诊患者均应行肝活检以明确诊断与评估炎症活动度。', tag: '病理', key: true },
          { t: '可采用简化评分与综合评分系统辅助诊断。', tag: '评分' },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '初始治疗：泼尼松（龙）单药，或泼尼松（龙）联合硫唑嘌呤；联合方案可减少激素不良反应。', tag: '一线', key: true },
          { t: '布地奈德联合硫唑嘌呤可用于无肝硬化的 AIH 患者，肝脏首过效应可降低全身副作用。', tag: '一线', key: true },
          { t: '硫唑嘌呤使用前建议检测 TPMT 活性或基因型。', tag: '安全性', key: true },
          { t: '二线药物：吗替麦考酚酯、他克莫司等，用于一线不耐受或应答不佳者。', tag: '二线' },
          { t: '缓解定义为 ALT/AST 与 IgG 正常、组织学炎症消退；停药后需密切随访以防复发。', tag: '标准', key: true },
        ],
      },
    ],
  },
  {
    id: 'easl-pbc-2017',
    title: 'EASL 原发性胆汁性胆管炎诊断与管理临床实践指南（2017）',
    short: 'EASL PBC 指南',
    org: '欧洲肝病学会（EASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2017,
    disease: 'autoimmune',
    tags: ['PBC', 'UDCA', '奥贝胆酸', '贝特类', '应答标准'],
    summary: '确立 PBC 的诊断三联要素、UDCA 一线治疗与生化应答标准，并给出二线药物选择。',
    sections: [
      {
        title: '诊断',
        points: [
          { t: '诊断三要素：ALP 等胆汁淤积指标异常、AMA 阳性、特征性组织学（非化脓性破坏性胆管炎）。', tag: '诊断', key: true },
          { t: '符合三项中的两项即可诊断 PBC；AMA 阴性者检测抗 sp100、抗 gp210 等特异性抗体。', tag: '诊断', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: 'UDCA 13–15 mg/kg/d 为一线治疗，应长期服用。', tag: '一线', key: true },
          { t: '生化应答标准（多采用 12 个月评估）：ALP < 1.67×ULN 且总胆红素正常。', tag: '评估', key: true },
          { t: '应答不佳者：奥贝胆酸（5 mg 起始，可加至 10 mg）或贝特类（非诺贝特、苯扎贝特）作为二线治疗。', tag: '二线', key: true },
          { t: '奥贝胆酸可加重瘙痒；失代偿期肝硬化患者禁用或慎用。', tag: '安全性', key: true },
          { t: '可使用 GLOBE、UK-PBC 等评分预测长期预后与肝移植时机。', tag: '预后' },
        ],
      },
      {
        title: '并发症管理',
        points: [
          { t: '定期筛查与治疗骨质疏松，补充钙与维生素 D。', tag: '骨病' },
          { t: '瘙痒阶梯治疗：考来烯胺 → 利福平 → 纳曲酮 → 舍曲林。', tag: '症状' },
          { t: '乏力、脂溶性维生素缺乏与脂代谢异常需综合管理。', tag: '症状' },
          { t: 'UDCA 应答不佳者应评估肝移植。', tag: '移植', key: true },
        ],
      },
    ],
  },
  {
    id: 'easl-psc-2022',
    title: 'EASL 硬化性胆管炎临床实践指南（2022）',
    short: 'EASL 硬化性胆管炎指南',
    org: '欧洲肝病学会（EASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2022,
    disease: 'autoimmune',
    tags: ['PSC', 'MRCP', '胆管癌', 'IBD', '肝移植'],
    summary: '规范 PSC 的影像诊断、主要胆管狭窄的内镜处理及肿瘤监测策略，明确不推荐大剂量 UDCA。',
    sections: [
      {
        title: '诊断',
        points: [
          { t: '典型表现为 MRCP/ERCP 显示多灶性胆管狭窄，需排除继发性硬化性胆管炎。', tag: '影像', key: true },
          { t: '小胆管型 PSC 需依靠肝活检诊断。', tag: '病理' },
          { t: '约 60%–80% 的 PSC 患者合并炎症性肠病，应常规行结肠镜评估。', tag: '共病', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '不推荐使用大剂量熊去氧胆酸（28–30 mg/kg/d），其与死亡和肝移植风险增加相关。', tag: '不推荐', key: true },
          { t: '内镜下球囊扩张 ± 支架置入用于处理主要胆管狭窄，操作时需排除胆管癌。', tag: '内镜', key: true },
          { t: '复发性胆管炎可使用抗生素治疗，必要时评估胆汁引流。', tag: '处理' },
          { t: '肝移植是终末期 PSC 唯一有效的治疗手段。', tag: '移植', key: true },
        ],
      },
      {
        title: '肿瘤监测',
        points: [
          { t: '每 6–12 个月检测 CA19-9 并结合影像监测胆管癌；狭窄快速进展时应高度警惕。', tag: '胆管癌', key: true },
          { t: '定期评估胆囊病变；合并 IBD 者每年行结肠镜筛查结直肠癌。', tag: '监测', key: true },
        ],
      },
    ],
  },

  /* ================= 肝衰竭 ================= */
  {
    id: 'easl-aclf-2023',
    title: 'EASL 慢加急性肝衰竭临床实践指南（2023）',
    short: 'EASL ACLF 指南',
    org: '欧洲肝病学会（EASL）',
    region: 'intl',
    dept: 'hepatology',
    year: 2023,
    disease: 'failure',
    latest: true,
    tags: ['ACLF', 'CLIF-C OF', '器官衰竭', '感染', '早期肝移植'],
    summary: '以 EASL-CLIF 标准定义 ACLF 与器官衰竭，强调诱因与感染控制、器官支持及早期肝移植筛选。',
    sections: [
      {
        title: '定义与诊断',
        points: [
          { t: 'ACLF：慢性肝病或肝硬化患者出现急性失代偿并伴器官衰竭，短期病死率显著升高。', tag: '定义', key: true },
          { t: '按 CLIF-C 器官衰竭评分评估肝、肾、凝血、脑、循环、呼吸六大系统。', tag: '评估', key: true },
          { t: '器官衰竭参考阈值：TBil ≥ 12 mg/dL、肌酐 ≥ 2 mg/dL 或需肾脏替代治疗、INR ≥ 2.5、肝性脑病 Ⅲ–Ⅳ 级、需血管活性药物、需机械通气。', tag: '标准' },
          { t: '按器官衰竭数量分为 ACLF 1、2、3 级（分别为 1 个、2 个、≥ 3 个器官衰竭）。', tag: '分级', key: true },
        ],
      },
      {
        title: '治疗',
        points: [
          { t: '病因治疗：HBV 相关尽早抗病毒；酒精相关戒酒与营养支持；药物相关立即停药。', tag: '病因', key: true },
          { t: '感染是最常见的诱因与并发症，应早期筛查并经验性抗感染治疗。', tag: '感染', key: true },
          { t: '器官支持：循环支持、肾脏替代治疗、呼吸支持、肝性脑病处理及营养支持。', tag: '支持', key: true },
          { t: '人工肝支持治疗（血浆置换、DPMAS 等）可用于改善短期指标并作为肝移植桥接。', tag: '人工肝', key: true },
          { t: '糖皮质激素可用于部分酒精性肝炎相关 ACLF 患者，需严格筛选并警惕感染。', tag: '选择' },
          { t: '早期肝移植可改善部分经过严格筛选的 ACLF 患者生存，应在病程早期评估。', tag: '移植', key: true },
        ],
      },
    ],
  },
  {
    id: 'aasld-critically-ill-2024',
    title: 'AASLD 肝硬化危重患者与急慢性肝衰竭管理指南（2024）',
    short: 'AASLD 肝硬化危重症指南',
    org: '美国肝病研究学会（AASLD）',
    region: 'intl',
    dept: 'hepatology',
    year: 2024,
    disease: 'failure',
    latest: true,
    tags: ['ICU', '器官支持', '感染', 'ACLF', '预后评估'],
    summary: '面向 ICU 场景，规范肝硬化危重患者与 ACLF 的诊断、评估与多器官支持策略。',
    ref: 'AASLD guidance on the management of critically ill patients with cirrhosis and ACLF',
    sections: [
      {
        title: '评估',
        points: [
          { t: '肝硬化患者入住 ICU 后应使用 ACLF 分级、CLIF-C ACLF 评分与 MELD 评分进行风险分层。', tag: '评估', key: true },
          { t: '器官衰竭数量是短期病死率最强的预测因素之一。', tag: '预后', key: true },
          { t: '入住 ICU 后应常规筛查感染（血、尿、腹水、痰培养），并警惕耐药菌。', tag: '感染', key: true },
        ],
      },
      {
        title: '管理',
        points: [
          { t: '血流动力学：优先使用白蛋白与晶体液复苏，必要时使用血管活性药物维持平均动脉压。', tag: '循环', key: true },
          { t: '急性肾损伤/肝肾综合征：特利加压素联合白蛋白为首选，必要时肾脏替代治疗。', tag: '肾脏', key: true },
          { t: '肝性脑病：乳果糖 ± 利福昔明，同时积极寻找并纠正诱因。', tag: '脑病', key: true },
          { t: '呼吸支持与机械通气需注意肝硬化患者的高病死率；必要时评估肝移植。', tag: '呼吸' },
          { t: '重视营养支持、血糖管理与血栓/出血风险平衡。', tag: '支持' },
          { t: '对符合指征者应尽早启动肝移植评估，避免延误。', tag: '移植', key: true },
        ],
      },
    ],
  },
]
