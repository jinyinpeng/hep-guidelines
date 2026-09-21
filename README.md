# 临床指南要点库

手机端优先、**完全离线可用**的临床速查前端。覆盖 **30 个临床科室**，包含两套可一键切换的内容：

1. **指南共识**——国内外最新指南/共识的核心要点；
2. **顶刊前沿**——各科室发表在国内外顶刊的临床研究，可按「期刊 × 期次」逐期浏览（默认只看近一年）。

两套内容都支持全文检索、收藏与标记。

## 特性

- **一键切换双内容**：顶栏「**指南共识 / 顶刊前沿**」切换按钮，一次点击即可在「指南要点」与「各科室顶刊临床研究」之间切换，首页、科室页、顶刊库、详情页整体换套；选择记在本机，下次打开保持同一视图。
- **按期次浏览顶刊**：`#/issues` 提供「按期刊」与「按时间」两个方向——选一本顶刊就逐期看它各期收录的临床研究，或按月把同一期各刊的研究合并看；期刊标注出版频次（周刊 / 半月刊 / 月刊）。
- **期刊口径覆盖专科顶刊**：不止 NEJM / Lancet / JAMA / BMJ，每个科室的本领域顶刊同样收录并单独标注——肝病科的 Hepatology、J Hepatol，血液科的 Blood，消化科的 Gut、Gastroenterology，心血管的 Circulation、Eur Heart J、JACC，肾脏的 Kidney Int、JASN，外科的 Ann Surg、JBJS 等，共 200+ 种期刊按「综合顶刊 / 本领域顶刊 / 权威期刊」三档登记，可按层级筛选。
- **写明研究方法**：每条研究都记录**入组人群、干预与对照、主要终点、统计与分析**四项方法学要素，并附「研究方法速读」页讲清证据层级、优效与非劣效、硬终点与替代终点、ITT 与提前终止等解读要点——避免只看到「阳性」就照搬结论。
- **全科室覆盖**：内科系、外科系、妇产与儿科、急危重症与麻醉、专科（眼科/耳鼻喉/口腔/康复/疼痛）五大分组，共 30 个科室。
- **病种分类**：每个科室都有自己的一套亚病种 / 亚专业分类（肝病科的「乙肝 / 丙肝 / 脂肪肝」、神经内科的「缺血性卒中 / 帕金森 / 癫痫」、心内科的「高血压 / 冠心病 / 心衰 / 房颤」等），科室页可按病种一键筛选并显示该类收录数，指南卡片上也会标出所属病种。
- **证据等级标注**：原指南明确给出推荐等级 / 证据级别的推荐，会在要点下方以芯片形式标出（如「推荐 I · 证据 A」），详情页「来源与版本」同时注明该指南采用的是哪一种分级体系。等级**一律按原文照录、不作推断**；未标注表示摘编时未从原文取得该等级，不代表该条推荐没有等级。
- **离线可用**：Service Worker 预缓存应用外壳与全部静态资源，首次访问后断网/飞行模式仍可正常查阅与检索；可「添加到主屏幕」当 App 使用。
- **打开即最新版**：每次打开应用（以及从后台切回、恢复联网）都会自动比对线上版本，发现新版立刻重载；在页面顶部**下拉并松开**也能手动更新，并给出「已是最新版本」的反馈。
- **底部常驻版本号**：每个页面最下方都有一条版本条（`src/components/VersionFooter.tsx`），显示当前版本号（构建产物内容哈希）、构建时间与更新状态；线上版本与本机不同时会同时显示两者，并可一键「检查更新」。离线状态下也能看到版本号（构建时间由 Vite `define` 注入）。
- **移动端优先**：单列卡片式布局、底部标签导航、安全区适配、跟随系统的明暗主题。
- **全文检索**：轻量自研检索，覆盖科室名、标题、机构、标签与全部要点正文，支持空格分隔的多关键词（如「卒中 溶栓」「脓毒症 液体复苏」）。
- **要点标记**：指南可收藏，单条要点可标记为重点，收藏与标记仅存于本机 `localStorage`，不上传任何数据。
- **零服务端**：纯静态产物，可直接部署到任意静态托管。

## 技术栈

React 19 · TypeScript 5 · Vite 8 · Tailwind CSS 4 · lucide-react · 手写 Service Worker + Web App Manifest

## 开发

```bash
npm install
npm run dev      # 本地开发 http://localhost:5173
npm run build    # 类型检查 + 生产构建，输出 dist/
npm run preview  # 预览生产构建 http://localhost:4173
```

> Service Worker 仅在**生产构建**中注册，因此验证离线能力请使用 `npm run build` 后 `npm run preview`，加载一次后断开网络测试。
> 首次加载后应用会把已加载的资源列表推送给 Service Worker 做预热缓存，因此**一次访问即可离线**。

## 目录结构

```
scripts/
  verify-data.mjs        数据完整性校验（发布前门禁）
  deploy.mjs             一键发布：同步 → 校验 → 构建 → 推送 → 等 CI → 核验线上
public/
  sw.js                  离线缓存策略（导航网络优先 + 静态资源缓存优先）
  manifest.json          PWA 清单（用 .json 以保证托管平台返回 JSON MIME）
  icon.svg / icon-maskable.svg
  .nojekyll              关闭 GitHub Pages 的 Jekyll 处理
src/
  data/
    types.ts             数据模型（含 DeptId 科室枚举）
    departments.ts       30 个临床科室定义与分组
    topics.ts            30 个科室的亚病种 / 亚专业定义（决定筛选栏有哪些芯片）
    topic-map.ts         指南 → 病种 归属表（新增指南在这里补一行）
    hepatology-cn.ts     肝病科 · 国内指南
    hepatology-intl.ts   肝病科 · 国际指南
    cardio.ts            心血管内科（含高血压、血脂、ACS/CCS、心衰、心律失常、心肌病、瓣膜病、肺血管病）
    resp.ts              呼吸与危重症医学科（慢阻肺、哮喘、肺炎、肺栓塞、间质性肺病、呼吸支持）
    gi.ts                消化内科
    neuro.ts             神经内科（卒中与二级预防、帕金森、认知障碍、癫痫、多发性硬化、偏头痛、眩晕）
    endo.ts              内分泌代谢科（糖尿病、甲状腺、骨质疏松、肥胖、痛风、肾上腺）
    renal.ts             肾脏内科（CKD 全程管理、肾小球疾病、糖尿病肾病、CKD-MBD、透析通路）
    rheum.ts             风湿免疫科（RA、SLE、脊柱关节炎、痛风、血管炎、其他结缔组织病）
    heme.ts              血液科（白血病、淋巴瘤、骨髓瘤、贫血、血小板、血友病与出凝血）
    infectious.ts        感染科（脓毒症、抗菌药物与耐药菌、呼吸道病毒、HIV/AIDS、发热待查）
    oncology.ts          肿瘤内科（肺癌、乳腺癌、结直肠癌、胃癌、食管癌、支持治疗与筛查）
    geriatrics.ts        老年医学科（老年综合评估、衰弱肌少症、跌倒、谵妄、多重用药、老年慢病）
    psychiatry.ts        精神心理科（抑郁、焦虑、精神分裂症、双相、失眠、儿童精神障碍）
    derm.ts              皮肤科（特应性皮炎、银屑病、痤疮、荨麻疹、斑秃、白癜风、带状疱疹）
    gensurg.ts           普通外科（胆道、疝、甲状腺、胃肠、肛肠、腹腔感染、围手术期）
    ortho.ts             骨科（骨折创伤、脊柱、关节置换、骨与软组织肿瘤、VTE 预防）
    neurosurg.ts         神经外科（颅脑创伤、颅内动脉瘤、颅内肿瘤、功能神经外科）
    urology.ts           泌尿外科（结石、前列腺增生、泌尿系肿瘤、尿路感染、排尿功能）
    cts.ts               胸外科（肺结节与肺癌、食管、纵隔肿瘤、气胸、胸部创伤）
    vascular.ts          血管外科（主动脉疾病、静脉血栓、下肢动脉、颈动脉、静脉曲张）
    obgyn.ts             妇产科（妊娠期高血压、妊娠期高血糖、产后出血、早产与流产、妇科肿瘤）
    peds.ts              儿科（儿童呼吸与感染、新生儿、心血管、肾脏、生长发育与营养）
    emergency.ts         急诊医学科（心肺复苏、急性胸痛与 ACS、急性中毒、脓毒症、休克复苏）
    icu.ts               重症医学科（ARDS 与机械通气、重症感染、镇痛镇静与谵妄、AKI 与 CRRT）
    anes.ts              麻醉科（气道管理、围术期血液管理、术后恶心呕吐、产科麻醉、术后镇痛）
    ophtho.ts            眼科（眼底病、青光眼、白内障、干眼、近视防控）
    ent.ts               耳鼻咽喉科（变应性鼻炎、鼻窦炎、突聋、眩晕、中耳炎、OSA、头颈肿瘤）
    stomatology.ts       口腔科（牙周病、龋病、口腔黏膜病、种植修复、口腔颌面肿瘤）
    rehab.ts             康复医学科（神经康复、心脏康复、肺康复、吞咽障碍、跌倒干预）
    pain.ts              疼痛科（癌痛、神经病理性疼痛、脊柱源性疼痛、纤维肌痛、安宁疗护）
    index.ts             汇总、统计与全文检索
    research/            顶刊最新临床研究（第二套内容）
      types.ts           Finding 模型（journal / date / design / level / results / impact）
      journals.ts        期刊登记表：200+ 种期刊的层级（综合顶刊/本领域顶刊/权威期刊）与学科
      link.ts            PubMed 检索链接生成（不臆造 DOI）
      internal.ts        内科系 14 个科室
      surgery.ts         外科系 6 个科室
      women-child.ts     妇产科、儿科
      critical.ts        急诊、重症、麻醉
      specialty.ts       眼科、耳鼻喉、口腔、康复、疼痛
      index.ts           汇总、近一年窗口、期刊统计、研究检索
  components/            TopBar / TabBar / 模式切换 / 指南卡片 / 研究卡片 / 搜索框 / 筛选区 / 免责声明 / 下拉刷新 / 底部版本条
  pages/                 首页 / 科室页 / 全部指南 / 详情 / 收藏 / 说明（顶刊前沿模式各有一套对应页面）
    IssuesPage.tsx       按期次浏览（#/issues）
    MethodologyPage.tsx  研究方法速读（#/methods）
  lib/
    router.ts            hash 路由
    storage.ts           主题与本地偏好
    store.tsx            收藏与要点标记
    pwa.ts               Service Worker 注册、联网状态、安装提示
    update.ts            版本比对与自动更新（打开即最新版 + 下拉刷新）
```

## 如何新增指南

在对应科室的数据文件里追加条目即可，结构如下：

```ts
{
  id: 'cn-xxx-2025',           // 全局唯一，改动会丢失该条的收藏/标记
  title: '完整指南名称（2025年版）',
  short: '卡片短标题',
  org: '发布机构',
  region: 'cn',                // 'cn' 国内 | 'intl' 国际
  dept: 'cardio',              // 科室 id，见 departments.ts
  year: 2025,
  // 病种（topic）不写在这里，统一在 topic-map.ts 登记，见下文
  latest: true,                // 是否为该领域当前最新版本
  tags: ['标签1', '标签2'],
  summary: '一句话定位',
  ref: '出处说明',              // 可选
  url: 'https://…',            // 可选，原文链接
  // 可选：该指南采用的证据分级体系，如
  // '推荐类别 I/IIa/IIb/III + 证据级别 A/B/C' 或 'KDIGO：推荐强度 1/2 + 证据质量 A/B/C/D'
  grading: '推荐类别 I/IIa/IIb/III + 证据级别 A/B/C',
  sections: [
    {
      title: '分组标题',
      points: [
        // rec / ev 仅在原指南对该条推荐明确给出等级时填写，一律按原文写法
        { t: '要点正文', tag: '小标签', rec: 'I', ev: 'A', key: true },
        { t: '未分级的要点', tag: '小标签' },
      ],
    },
  ],
}
```

> `rec`（推荐强度/类别）与 `ev`（证据级别/质量）为**可选**字段，且**只做照录、不做推断**。给出 `rec`/`ev` 的条目会渲染等级芯片，同时建议补上该指南的 `grading` 字段说明体系来源。

新增科室时，先在 `src/data/departments.ts` 里加一条 `Department`，并在 `src/data/types.ts` 的 `DeptId` 联合类型中补上对应 id，再到 `src/data/topics.ts` 的 `TOPICS` 里为该科室定义病种列表（编译器会强制要求补全，漏写会报类型错误）。

## 如何维护病种分类

病种机制拆成两个文件，各管一件事：

- **`src/data/topics.ts`**：定义每个科室**有哪些**病种。`Record<DeptId, Topic[]>` 的结构由 TypeScript 强约束，30 个科室一个都不能少。
- **`src/data/topic-map.ts`**：定义每部指南**属于哪个**病种，形如 `'cn-hbv-2025': 'hbv'`。

新增指南时，只需在 `topic-map.ts` 里补一行。**漏登记也不会报错**——该指南会自动落到本科室的「其他」分组；若该科室没有 `other` 病种，则不出现在任何病种芯片下（但仍会出现在「全部病种」里）。

科室页只渲染**实际有指南的病种**，所以病种列表可以一次定义完整，不用担心出现空芯片。

新增或修改数据后重新 `npm run build` 即可，无需改动其他代码。

## 更新机制（打开即最新版）

判断「有没有新版本」不依赖接口，也不依赖 Service Worker 的版本号，而是直接看构建产物：

1. 构建时 `vite.config.ts` 里的 `buildVersion` 插件会读出入口 chunk 的文件名，
   产出 `dist/version.json`，例如 `{ "build": "index-BCVb3foc.js", "built": "2026-09-20T12:57:25.053Z" }`。
   Vite 的文件名带内容哈希，所以**文件名不同 = 内容不同**。
2. 运行时用 `cache: 'no-store'` 拉一次 `version.json`（并带一次性 `?t=` 参数绕过 CDN），
   与页面自己正在运行的 `script[type=module]` 文件名比对。
3. 不一致 → 让新的 Service Worker 接管缓存，然后带 `?t=` 重载（重载前记下滚动位置，重载后还原；hash 路由由浏览器保留）。

触发时机（`src/lib/update.ts` 的 `useAutoUpdate`）：

- 应用启动时立刻检查一次；
- `visibilitychange` 回到前台、`online` 恢复联网、`pageshow` 从 bfcache 恢复时各检查一次（20 秒内的重复触发会合并）；
- 前台停留期间每 5 分钟兜底检查一次。

另外 `src/components/PullToRefresh.tsx` 提供了顶部下拉刷新：只有在**页面已滚到最顶部**且是**竖直方向**下拉时才接管手势，
松手越过阈值即执行同一次版本检查，有新版本直接重载，没有则提示「已是最新版本」。

> 为防止缓存/CDN 还没跟上时反复刷新，同一次会话里**为某个版本只重载一次**（`sessionStorage` 记录），
> 若重载后仍是旧版本，说明页会显示「线上有新版本但还没生效」而不是继续刷新。

`public/sw.js` 中 `index.html`、`version.json`、`sw.js` 三者**永不进缓存**，导航请求也用 `cache: 'reload'` 绕过 HTTP 缓存，
保证「检查更新」拿到的判断依据一定是线上最新的一份。

版本号的展示统一走 `src/lib/update.ts` 的 `shortBuild()` / `formatBuildTime()` / `statusText()`：说明页的「版本与更新」卡片与底部版本条共用同一套实现，不会出现两处显示不一致。`vite.config.ts` 通过 `define` 注入 `__BUILD_TIME__`，因此**首次打开、尚未联网检查时**底部也能显示构建时间。

## 排版与可读性规范

界面上不再出现「一处 11px、一处 11.5px、一处 13.5px」这类临时字号，统一收敛为 8 级标尺（`src/index.css` 为基准，正文行距 1.75）：

| 用途 | 字号 | 行距 |
| --- | --- | --- |
| 页面主标题 | 23px | 1.35 |
| 页面内大标题（科室名、详情页标题） | 20px | 1.4 |
| 卡片标题 / 分区标题 | 16.5–18px | 1.45 |
| 正文（要点、摘要、段落） | 15px | 1.7–1.75 |
| 次要信息（机构、设计、期次、日期） | 13.5px | 1.6–1.7 |
| 芯片、标签、脚注 | 12.5px | 1.5 |

配套规则：

- **容器宽度**：内容区 `max-w-[680px]`、左右 `px-5`，中文每行约 40 字，避免宽屏变成「一行到底」；
- **分组与分隔**：卡片内用 `border-t` 细分隔线把「标题区」与「归属信息区」分开；筛选区统一为 `FilterPanel`（`src/components/FilterBar.tsx`）——默认收起只显示一行筛选摘要，展开后按「地区 / 科室 / 期刊层级 / 期刊 / 病种」分组并带组间分隔线，替代原先一排排悬浮芯片；
- **降低密度的具体做法**：卡片只保留「标题 + 设计 + 结论 + 归属信息」四段，期刊层级用颜色表达而不额外占芯片，标签最多 2 个，主要终点等细节下沉到详情页；列表条目间距 16px、卡片内边距 20px；
- **对齐**：所有页面共用同一栅格（顶栏 / 内容 / 底部标签栏 / 底部版本条同一 `max-w` 与 `px`），芯片行横向滚动时用 `-mx-1.5 px-1.5` 保证聚焦描边不被裁切；
- 标题启用 `text-wrap: balance`、正文启用 `text-wrap: pretty`，减少孤字换行。

## 数据维护约定

- **`id` 全局唯一**，改动会丢失该条在本机的收藏与标记。
- **`topic` 不写在数据文件里**，统一在 `topic-map.ts` 登记，未登记则自动落到本科室的「其他」。
- **病种 id 在科室内唯一**，跨科室可重名（如 `other`、`tumor`）。
- **`rec` / `ev` / `grading` 只照录、不推断**。宁可留空，也不要凭印象填写推荐等级——这是本项目最容易被误用的一类信息。
- 数据文件按科室拆分，一个科室一个文件；新增科室时不要往已有文件里追加其他科室的条目。
- **顶刊研究**（`src/data/research/`）按科室分组存放：内科系 `internal.ts`、外科系 `surgery.ts`、妇产儿科 `women-child.ts`、急危重症与麻醉 `critical.ts`、专科与其他 `specialty.ts`。研究 `id` 统一以 `r-` 开头（如 `r-cardio-01`），`topic` 必须复用本科室 `topics.ts` 里已有的病种 id。
- **期刊层级只在 `src/data/research/journals.ts` 登记一次**（`top` / `field` / `major` + 学科领域），条目里只写期刊名；同一期刊在多个科室出现时层级必然一致，新增期刊时补一行即可。

## 数据分片（构建期生成）

指南数据**不打进 JS 包**，而是由 `scripts/gen-data.mjs` 在构建前编译成静态分片：

```bash
npm run gen      # 只生成分片
npm run dev      # 自动先跑 gen 再启动开发服务器
npm run build    # 自动先跑 gen，再 tsc + vite build
```

产物（都在 `.gitignore` 中，不入库）：

| 产物 | 内容 | 何时取 |
| --- | --- | --- |
| `public/data/cards.<hash>.json` | 全部指南的**卡片级字段**（标题/机构/年份/标签/摘要 + 条数与等级数），不含要点正文 | 启动时一次性取回，列表、筛选、卡片立刻可用 |
| `public/data/dept/<科室>.<hash>.json` | 该科室指南**全文**（含 `sections`） | 详情页按需取；启动后也会在后台补齐，用于全文检索 |
| `src/data/generated/urls.ts` | 上述分片的 URL 清单 | 由运行时代码引用 |

要点：

- 分片文件名带**内容哈希**，配合 Service Worker 的缓存优先策略，内容一变文件名就变，不会命中旧缓存；
- 数据在 `src/data/index.ts` 里装配（`initData()` → 卡片索引；`loadDept()` → 科室正文）。**新增/扩写内容只影响对应科室的分片大小，入口 chunk 不再随内容增长**；
- 因为正文是分两步到手的，读取要点正文的页面要订阅数据版本（`src/lib/data-hooks.ts` 的 `useDataVersion` / `useDeptSections`），否则分片到位后不会重渲染；
- 生成的 URL 清单交给 Service Worker 预热缓存（`src/lib/pwa.ts`），因此**首次访问后仍然完全离线可用**。

## 顶刊前沿（第二套内容）

顶部有一个「**指南共识 / 顶刊前沿**」一键切换按钮（`src/components/ModeSwitch.tsx`），切换后首页、科室页、顶刊库与详情页整体换套内容，选择写入 `localStorage`（`hep.mode`）下次打开保持不变。

研究模式的三个入口：

- **首页**（`src/pages/ResearchHomePage.tsx`）：收录概览、跨科室检索（标题/期刊/标签/结果正文/方法学字段都可命中）、按科室浏览、近一年值得关注、期刊体系；
- **科室页**（`src/pages/ResearchDeptPage.tsx`）：按「近一年 / 近两年 / 近三年 / 全部」+ 期刊层级 + 期刊 + 病种四重筛选；
- **顶刊库**（`src/pages/ResearchLibraryPage.tsx`）：科室分组 / 科室 / 期刊层级 / 期刊 / 影响程度 + 关键词检索；
- **按期次浏览**（`src/pages/IssuesPage.tsx`，`#/issues`）：按期刊逐期列出该刊各期收录的临床研究，或按时间把同一期各刊的研究合并看；
- **详情页**（`src/pages/FindingPage.tsx`）：研究方法（人群 / 干预与对照 / 主要终点 / 统计与分析）、主要结果、临床意义、与现行指南的关系、期刊期次与来源文献。

> **期次口径**：本库按「公开发表月份」归期（`2026-05` → `2026 年 5 月期`），不是期刊卷期号；同一期只列本库已收录的临床研究（随机对照、队列、荟萃等），**不含综述、述评、病例报告、基础研究与指南全文，因此不等于期刊完整目录**。期刊出版频次在 `journals.ts` 的 `journalFrequency()` 中集中定义，用于说明周刊每月约 4 期、月刊每月 1 期。

### 期刊口径：不只看 NEJM

期刊层级集中在 `src/data/research/journals.ts` 登记（目前 200+ 种），数据条目**不再自己写 tier**，层级由登记表统一决定，避免同一个期刊在不同科室被判成不同档次。三档：

| 层级 | 含义 | 举例 |
| --- | --- | --- |
| `top` 综合顶刊 | 面向全医学界 | NEJM、Lancet、JAMA、BMJ、Nat Med、Nature、Cell、Ann Intern Med |
| `field` 本领域顶刊 | 该专科公认第一梯队 | 肝病科 Hepatology / J Hepatol；血液科 Blood / Lancet Haematol；消化 Gut / Gastroenterology；心血管 Circulation / Eur Heart J / JACC；肾脏 Kidney Int / JASN；外科 Ann Surg / Br J Surg；骨科 JBJS / Am J Sports Med；泌尿 Eur Urol；神外 J Neurosurg；妇产 AJOG / BJOG；儿科 Pediatrics；麻醉 Anesthesiology / BJA；眼科 Ophthalmology；口腔 J Dent Res / J Clin Periodontol |
| `major` 权威期刊 | 本领域有影响力大刊与亚专科期刊 | Liver Int、Clin Gastroenterol Hepatol、Chest、Spine、J Arthroplasty、Surg Endosc、BJU Int |

一套内容共 **413 条**研究、覆盖 30 个科室、来自 **146 种期刊**（近一年 395 条），顶刊前沿可按层级 / 期刊 / 期次 / 时间 / 影响程度筛选。

### 其余收录口径

- `method` 为**研究方法四要素**（`StudyMethod`）：`population` 入组人群、`arms` 干预与对照、`endpoint` 主要终点、`stats` 统计与分析。**四条都必填**，`npm run verify` 会逐个检查——同一条阳性结果在优效性与非劣效性设计、硬终点与替代终点之间分量完全不同，只写一句「随机对照」不足以判断能否改变做法。方法学字段同时参与检索（可按终点、人群关键词搜到研究）。
- `level` 分三档：`practice` 可能改变实践、`promising` 有前景待验证、`exploratory` 探索性——**中性/阴性结果同样收录**，避免只看阳性结论；
- `date` 为 `YYYY-MM`，「近一年」以数据中最新一条为基准（`WINDOW_MONTHS = 12`），筛选栏可切到「近两年 / 近三年 / 全部」查看更早的里程碑研究；
- 条目的 `url` 默认由 `link.ts` 的 `pm(title)` 生成 PubMed 检索链接，**不臆造 DOI**；确知期刊页地址时再显式写 `url` 覆盖。

### 研究方法速读页

研究详情页的「研究方法」区块只列事实；**怎么读这些事实**放在独立页面 `/methods`（`src/pages/MethodologyPage.tsx`），从研究首页「研究方法速读」入口或在详情页点击「这些方法学信息该怎么读」进入。内容覆盖：证据层级、入组人群的外推边界、对照与设盲、硬终点与替代终点、优效 / 非劣效与 ITT、提前终止与亚组分析的误读风险、观察性研究的因果陷阱，以及本库 `tier / design / method / level` 四个标注的口径。

新增期刊时只需在 `journals.ts` 的 `RAW` 里加一行 `'期刊名': ['field', '学科']`；写了未登记的期刊名，`npm run verify` 会直接报错并提示补登记。

`npm run verify` 会一并校验研究数据：id 唯一性与 `r-` 前缀、`dept` 是否登记、`topic` 是否属于该科室、`date` 格式与是否晚于当月、`journal` 是否已登记、`level` 取值、`results` 与 `impact` 是否为空、**研究方法四要素是否齐全**，以及**每个科室是否都有研究**。

## 部署到 GitHub Pages

推送 `main` 后，仓库内的 GitHub Actions（`.github/workflows/deploy-pages.yml`）会自动构建并把产物同步到 `docs/` 目录，GitHub Pages 只需一次性设置为 `Deploy from a branch: main / docs`。

首次建仓用 `deploy-to-github.ps1`（创建仓库 + 推送 + 开启 Pages），日常更新用下面的 `npm run deploy`。

## 自动更新与发布

```bash
npm run verify    # 只跑数据校验，不构建
npm run deploy    # 一键发布：同步 → 校验 → 构建 → 提交推送 → 等 CI → 核验线上
npm run deploy -- "feat: 新增 xx 指南"   # 自定义提交信息
```

`npm run deploy` 会依次完成：

1. `git fetch` + 落后则 `pull`（CI 会把构建产物提交回 `docs/`，本地常常落后一两个提交）；
2. 跑 `scripts/verify-data.mjs`：指南 id 唯一性与字符集、`dept` 合法性、`topic-map` 的 key/value 是否对得上科室病种、每个科室是否都有收录；**校验不通过直接终止，不会推送**；
3. `tsc --noEmit` + `vite build`，任一失败即终止；
4. 提交并推送到 `origin/main`；
5. 轮询等待 GitHub Actions 产出新的 `docs/` 提交并拉回；
6. 核验线上 `index.html` 引用的 JS 与本地 `docs/assets/index-*.js` 一致，确认「线上就是最新版」。

附带两个环境变量：`DEPLOY_DRY_RUN=1` 只校验与构建、不提交；`DEPLOY_NO_WAIT=1` 推完即返回、不等待 CI。

想让数据保持最新，可以把这个流程挂成定时自动化（每周检查一次国内外指南是否有新版本、是否漏了常见病种），让它在无人值守时自动跑完上面六步。

## 免责声明

本项目为指南与共识的**要点摘编**，仅用于快速查阅与教学参考，**不能替代原文，也不构成诊疗建议**。各指南持续更新，引用推荐等级、证据级别、剂量、阈值前请核对官方正式发布的最新版原文；临床决策须结合患者具体情况与所在机构诊疗规范。

关于证据等级：页面上的推荐等级与证据级别为**按原文照录**，仅在原指南明确给出时标注，**未标注不代表该条推荐没有等级**；等级体系在不同指南间不通用，请以该指南原文为准。

本项目为纯本地前端，无服务端、无账号体系、不采集任何用户数据。
