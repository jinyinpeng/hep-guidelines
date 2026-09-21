#!/usr/bin/env node
/**
 * 构建期数据生成：把 src/data 下的 TS 数据编译成静态分片。
 *
 * 为什么要这一步：
 *   指南数据放进 JS 包会让入口 chunk 随内容无限膨胀（每加一条要点都要重新解析整个包）。
 *   拆成「卡片索引 + 各科室正文」两类 JSON 资源后：
 *     - 入口 chunk 只含应用代码，与内容总量脱钩；
 *     - 卡片索引先到手即可渲染所有列表（首页/科室页/指南库/收藏）；
 *     - 各科室正文按需加载，详情页只取该科室一片。
 *
 * 产物（均在 .gitignore 中，由本脚本生成）：
 *   public/data/cards.<hash>.json          全部指南的卡片级字段（不含 sections）
 *   public/data/dept/<dept>.<hash>.json    各科室指南全文（含 sections）
 *   src/data/generated/urls.ts             上述文件的 URL 清单
 *
 * 文件名带内容哈希：配合 Service Worker 的「缓存优先」策略，
 * 内容一变文件名就变，不可能命中旧缓存（也是「打开即最新版」机制的前提）。
 *
 * 用法：node scripts/gen-data.mjs
 */
import { createHash } from 'node:crypto'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src', 'data')
const OUT = join(ROOT, 'public', 'data')
const GEN = join(SRC, 'generated')

/** 科室 → 数据文件（肝病科拆成国内/国际两个文件） */
const DEPT_FILES = {
  hepatology: ['hepatology-cn', 'hepatology-intl'],
  cardio: ['cardio'],
  resp: ['resp'],
  gi: ['gi'],
  renal: ['renal'],
  heme: ['heme'],
  endo: ['endo'],
  rheum: ['rheum'],
  neuro: ['neuro'],
  infectious: ['infectious'],
  oncology: ['oncology'],
  geriatrics: ['geriatrics'],
  psychiatry: ['psychiatry'],
  derm: ['derm'],
  gensurg: ['gensurg'],
  ortho: ['ortho'],
  neurosurg: ['neurosurg'],
  urology: ['urology'],
  cts: ['cts'],
  vascular: ['vascular'],
  obgyn: ['obgyn'],
  peds: ['peds'],
  emergency: ['emergency'],
  icu: ['icu'],
  anes: ['anes'],
  ophtho: ['ophtho'],
  ent: ['ent'],
  stomatology: ['stomatology'],
  rehab: ['rehab'],
  pain: ['pain'],
}

/** 数据文件 → 导出名（显式登记，避免误取到别的数组） */
const EXPORT_NAME = {
  'hepatology-cn': 'CN_GUIDELINES',
  'hepatology-intl': 'INTL_GUIDELINES',
  cardio: 'CARDIO',
  resp: 'RESP',
  gi: 'GI',
  renal: 'RENAL',
  heme: 'HEME',
  endo: 'ENDO',
  rheum: 'RHEUM',
  neuro: 'NEURO',
  infectious: 'INFECTIOUS',
  oncology: 'ONCOLOGY',
  geriatrics: 'GERIATRICS',
  psychiatry: 'PSYCHIATRY',
  derm: 'DERM',
  gensurg: 'GENSURG',
  ortho: 'ORTHO',
  neurosurg: 'NEUROSURG',
  urology: 'UROLOGY',
  cts: 'CTS',
  vascular: 'VASCULAR',
  obgyn: 'OBGYN',
  peds: 'PEDS',
  emergency: 'EMERGENCY',
  icu: 'ICU',
  anes: 'ANES',
  ophtho: 'OPHTHO',
  ent: 'ENT',
  stomatology: 'STOMATOLOGY',
  rehab: 'REHAB',
  pain: 'PAIN',
}

const loadTs = async (file) => import(pathToFileURL(join(SRC, `${file}.ts`)).href)
const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 8)

/* ------------------------------ 读取并整理数据 ------------------------------ */

const { TOPIC_OF } = await loadTs('topic-map')
const { TOPICS } = await loadTs('topics')

/** 补病种归属：数据文件写了就用数据文件里的，否则查 topic-map，再退到本科室「其他」 */
const withTopic = (dept, g) => {
  if (g.topic) return g
  const fallback = (TOPICS[dept] ?? []).find((t) => t.id === 'other')?.id
  return { ...g, topic: TOPIC_OF[g.id] ?? fallback }
}

const byDept = {}
for (const [dept, files] of Object.entries(DEPT_FILES)) {
  const list = []
  for (const file of files) {
    const mod = await loadTs(file)
    const arr = mod[EXPORT_NAME[file]]
    if (!Array.isArray(arr)) throw new Error(`${file}.ts 未导出数组 ${EXPORT_NAME[file]}`)
    for (const raw of arr) {
      const g = withTopic(dept, raw)
      if (g.dept !== dept) {
        throw new Error(`${file}.ts 的 ${g.id} 登记科室为 ${g.dept}，与 ${dept} 不一致`)
      }
      list.push(g)
    }
  }
  byDept[dept] = list
}

/** 卡片字段：列表页与详情页头部所需的全部字段，唯独不含 sections */
const toCard = (g) => {
  const { sections, ...rest } = g
  const points = sections.reduce((n, s) => n + s.points.length, 0)
  const graded = sections.reduce((n, s) => n + s.points.filter((p) => p.rec || p.ev).length, 0)
  return { ...rest, points, graded }
}

const cards = Object.keys(DEPT_FILES).flatMap((dept) => byDept[dept].map(toCard))

const seen = new Set()
for (const c of cards) {
  if (seen.has(c.id)) throw new Error(`指南 id 重复：${c.id}`)
  seen.add(c.id)
}

/* ------------------------------ 写出分片 ------------------------------ */

rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, 'dept'), { recursive: true })

const emit = (relPath, payload) => {
  const json = JSON.stringify(payload)
  const dot = relPath.lastIndexOf('.')
  const file = `${relPath.slice(0, dot)}.${hash(json)}${relPath.slice(dot)}`
  writeFileSync(join(OUT, file), json)
  return `data/${file}`
}

const deptUrls = {}
for (const dept of Object.keys(DEPT_FILES)) {
  deptUrls[dept] = emit(`dept/${dept}.json`, byDept[dept])
}
const cardsUrl = emit('cards.json', cards)

mkdirSync(GEN, { recursive: true })
writeFileSync(
  join(GEN, 'urls.ts'),
  [
    '/**',
    ' * 本文件由 scripts/gen-data.mjs 生成，请勿手工修改。',
    ' * 内容为数据分片的 URL 清单（文件名带内容哈希）。',
    ' */',
    `export const CARDS_URL = '${cardsUrl}'`,
    '',
    'export const DEPT_URLS: Record<string, string> = {',
    ...Object.keys(deptUrls)
      .sort()
      .map((dept) => `  ${dept}: '${deptUrls[dept]}',`),
    '}',
    '',
  ].join('\n'),
)

const points = cards.reduce((n, c) => n + c.points, 0)
const graded = cards.reduce((n, c) => n + c.graded, 0)
console.log(
  `数据分片已生成：指南 ${cards.length} 部（要点 ${points} 条 · 含等级 ${graded} 条）· 科室正文 ${Object.keys(deptUrls).length} 片`,
)
console.log(`  卡片索引 ${cardsUrl} · 目录 public/data/`)
