# 肝病指南要点库

手机端优先、**完全离线可用**的肝病科指南共识速查前端。收录国内与国际肝病领域最新指南/共识的核心要点，支持全文检索、要点标记与收藏。

## 特性

- **离线可用**：Service Worker 预缓存应用外壳与全部静态资源，首次访问后断网/飞行模式仍可正常查阅与检索；可「添加到主屏幕」当 App 使用。
- **移动端优先**：单列卡片式布局、底部标签导航、安全区适配、48px 级触控区域、跟随系统的明暗主题。
- **全文检索**：轻量自研检索，覆盖标题、机构、标签与全部要点正文，支持空格分隔的多关键词组合（如「乙肝 停药」「腹水 白蛋白」）。
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

> Service Worker 仅在**生产构建**中注册，因此验证离线能力请使用 `npm run build` 后 `npm run preview`，用手机或浏览器访问局域网地址，加载一次后断开网络测试。
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
    types.ts             数据模型
    diseases.ts          10 个病种领域
    cn.ts                国内指南 / 共识
    intl.ts              国际指南 / 共识
    index.ts             汇总、统计与全文检索
  components/            TopBar / TabBar / 指南卡片 / 搜索框 / 免责声明
  pages/                 首页 / 指南库 / 详情 / 收藏 / 说明
  lib/                   路由、本地存储、PWA 能力
```

## 如何更新指南内容

只改 `src/data/cn.ts` 与 `src/data/intl.ts` 即可，一条条目的结构如下：

```ts
{
  id: 'cn-hbv-2025',            // 唯一 id，改动会丢失该条的收藏/标记
  title: '慢性乙型肝炎防治指南（2025年版）',
  short: '慢性乙型肝炎防治指南',   // 卡片标题
  org: '中华医学会肝病学分会、中华医学会感染病学分会',
  region: 'cn',                 // 'cn' | 'intl'
  year: 2025,
  disease: 'hbv',               // 见 diseases.ts
  latest: true,                 // 是否为该领域当前最新版本
  tags: ['抗病毒适应证', '一线药物'],
  summary: '一句话定位',
  ref: '出处说明',
  url: 'https://…',             // 可选，原文链接
  sections: [
    { title: '治疗目标', points: [{ t: '要点正文', tag: '目标', key: true }] },
  ],
}
```

新增或修改数据后重新 `npm run build` 即可，无需改动其他代码。

## 部署到 GitHub Pages（手机上直接打开）

构建产物是纯静态文件，且 `vite.config.ts` 已设置 `base: './'`（相对路径），因此可以直接放在仓库根目录或子目录下运行。

### 方式一：网页上传（无需安装 git）

1. 在 GitHub 新建仓库，例如 `hep-guidelines`，设为 **Public**。
2. 本地执行 `npm run build`，打开生成的 `dist/` 文件夹。
3. 进入新仓库页面，点 **Add file → Upload files**，把 `dist/` **里面的所有内容**（不要整个 dist 文件夹本身）拖进上传区：`index.html`、`sw.js`、`manifest.json`、`icon.svg`、`icon-maskable.svg`、`.nojekyll` 以及 `assets/` 文件夹。
4. 提交（Commit changes）。
5. 仓库 **Settings → Pages**，Source 选 **Deploy from a branch**，Branch 选 **main** + **/(root)**，保存。
6. 等 1–2 分钟，访问 `https://<你的用户名>.github.io/<仓库名>/`。

> 必须用 `https://` 访问，Service Worker 与「添加到主屏幕」只在安全上下文下生效。
> `.nojekyll` 用于关闭 GitHub Pages 的 Jekyll 处理，避免下划线开头的文件被忽略。

### 方式二：使用 git 命令

```bash
npm run build
cd dist
git init -b main
git add -A
git commit -m "deploy: 肝病指南要点库"
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -f origin main
```

再按上面第 5 步开启 Pages。

## 免责声明

本项目为指南与共识的**要点摘编**，仅用于快速查阅与教学参考，**不能替代原文，也不构成诊疗建议**。各指南持续更新，引用推荐等级、剂量、阈值前请核对官方正式发布的最新版原文；临床决策须结合患者具体情况与所在机构诊疗规范。

本项目为纯本地前端，无服务端、无账号体系、不采集任何用户数据。
