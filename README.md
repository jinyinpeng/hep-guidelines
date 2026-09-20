# 临床指南要点库

手机端优先、**完全离线可用**的临床指南共识速查前端。覆盖 **30 个临床科室**，收录国内外最新指南/共识的核心要点，支持全文检索、要点标记与收藏。

## 特性

- **全科室覆盖**：内科系、外科系、妇产与儿科、急危重症与麻醉、专科（眼科/耳鼻喉/口腔/康复/疼痛）五大分组，共 30 个科室。
- **离线可用**：Service Worker 预缓存应用外壳与全部静态资源，首次访问后断网/飞行模式仍可正常查阅与检索；可「添加到主屏幕」当 App 使用。
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
public/
  sw.js                  离线缓存策略（导航网络优先 + 静态资源缓存优先）
  manifest.json          PWA 清单（用 .json 以保证托管平台返回 JSON MIME）
  icon.svg / icon-maskable.svg
  .nojekyll              关闭 GitHub Pages 的 Jekyll 处理
src/
  data/
    types.ts             数据模型（含 DeptId 科室枚举）
    departments.ts       30 个临床科室定义与分组
    diseases.ts          肝病科内部亚病种分组
    hepatology-cn.ts     肝病科 · 国内指南
    hepatology-intl.ts   肝病科 · 国际指南
    cardio.ts            心血管内科（含高血压、血脂、ACS/CCS、心衰、心律失常、心肌病、瓣膜病、肺血管病）
    resp-gi.ts           呼吸与危重症医学科 / 消化内科
    internal-2.ts        内科系（二）：肾脏 / 血液 / 内分泌 / 风湿免疫
    internal-3.ts        内科系（三）：神经 / 感染 / 肿瘤 / 老年 / 精神 / 皮肤
    surgery.ts           外科系：普外 / 骨科 / 神外 / 泌尿 / 胸外 / 血管外科
    womenchild-critical.ts  妇产科 / 儿科 / 急诊 / 重症 / 麻醉
    specialty.ts         眼科 / 耳鼻咽喉科 / 口腔科 / 康复医学科 / 疼痛科
    index.ts             汇总、统计与全文检索
  components/            TopBar / TabBar / 指南卡片 / 搜索框 / 免责声明
  pages/                 首页 / 科室页 / 全部指南 / 详情 / 收藏 / 说明
  lib/                   路由、本地存储、PWA 能力
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
  latest: true,                // 是否为该领域当前最新版本
  tags: ['标签1', '标签2'],
  summary: '一句话定位',
  ref: '出处说明',              // 可选
  url: 'https://…',            // 可选，原文链接
  sections: [
    { title: '分组标题', points: [{ t: '要点正文', tag: '小标签', key: true }] },
  ],
}
```

新增科室时，先在 `src/data/departments.ts` 里加一条 `Department`，并在 `src/data/types.ts` 的 `DeptId` 联合类型中补上对应 id。

新增或修改数据后重新 `npm run build` 即可，无需改动其他代码。

## 部署到 GitHub Pages

推送 `main` 后，仓库内的 GitHub Actions 会自动构建并把产物同步到 `docs/` 目录，GitHub Pages 只需一次性设置为 `Deploy from a branch: main / docs`。

## 免责声明

本项目为指南与共识的**要点摘编**，仅用于快速查阅与教学参考，**不能替代原文，也不构成诊疗建议**。各指南持续更新，引用推荐等级、剂量、阈值前请核对官方正式发布的最新版原文；临床决策须结合患者具体情况与所在机构诊疗规范。

本项目为纯本地前端，无服务端、无账号体系、不采集任何用户数据。
