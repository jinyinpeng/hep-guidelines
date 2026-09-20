#!/usr/bin/env node
/**
 * 数据完整性校验（发布前门禁）
 *
 * 用法：node scripts/verify-data.mjs
 * 退出码：0 = 通过（可带警告）；1 = 存在错误，不应发布
 *
 * 校验内容：
 *   1. 指南 id 全局唯一、仅含 ASCII 小写字母/数字/连字符
 *   2. 每条指南的 dept 必须是 departments.ts 里登记的科室
 *   3. topic-map.ts 的 key 必须指向真实存在的指南
 *   4. topic-map.ts 的 value 必须是该科室 topics.ts 里定义过的病种
 *   5. 每个科室至少收录 1 部指南
 *   6. region / latest 字段取值合法，year 落在合理区间
 *   7. 警告项：未登记病种的指南（会落到「其他」）
 *   8. 提示项：定义了但还没有指南使用的病种（内容缺口，可按需补指南）
 *
 * 顶刊研究（src/data/research/）：
 *   9.  研究 id 唯一、仅含 ASCII 小写字母/数字/连字符，且以 r- 开头
 *   10. dept 必须是已登记科室，topic 必须是该科室定义过的病种
 *   11. date 必须是 YYYY-MM，且不能晚于当前月份
 *   12. journal 必须在 research/journals.ts 登记（层级由登记表统一决定）
 *   13. level 取值合法，results 至少 1 条、impact 非空
 *   14. 每个科室至少有 1 条研究
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(ROOT, 'src', 'data')
const read = (f) => readFileSync(join(DATA, f), 'utf8')

/** 非指南数据文件，解析时跳过 */
const NON_GUIDELINE_FILES = new Set([
  'types.ts',
  'departments.ts',
  'topics.ts',
  'topic-map.ts',
  'index.ts',
])

const errors = []
const warnings = []
const infos = []
const err = (m) => errors.push(m)
const warn = (m) => warnings.push(m)
const info = (m) => infos.push(m)

/* ------------------------------ 科室 ------------------------------ */

const deptSrc = read('departments.ts')
const DEPTS = [
  ...deptSrc.matchAll(/^\s*\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'[^\n]*?group:\s*'([^']+)'/gm),
].map((m) => ({ id: m[1], name: m[2], group: m[3] }))
const DEPT_IDS = new Set(DEPTS.map((d) => d.id))
const DEPT_NAME = new Map(DEPTS.map((d) => [d.id, d.name]))

if (!DEPTS.length) err('未能从 departments.ts 解析出任何科室，请检查文件格式')

/* ------------------------------ 病种 ------------------------------ */

const topicSrc = read('topics.ts')
const TOPICS = new Map()
{
  let current = null
  for (const line of topicSrc.split(/\r?\n/)) {
    const open = line.match(/^  (\w+):\s*\[$/)
    if (open) {
      current = open[1]
      if (!TOPICS.has(current)) TOPICS.set(current, [])
      if (!DEPT_IDS.has(current)) err(`topics.ts 出现了未登记的科室：${current}`)
      continue
    }
    if (/^  \],?$/.test(line)) {
      current = null
      continue
    }
    if (current) {
      for (const m of line.matchAll(/\{\s*id:\s*'([^']+)'/g)) TOPICS.get(current).push(m[1])
    }
  }
}
const topicSetOf = (dept) => new Set(TOPICS.get(dept) ?? [])

for (const d of DEPTS) {
  if (!TOPICS.has(d.id)) err(`topics.ts 缺少科室「${d.name}」(${d.id}) 的病种定义`)
}
for (const [dept, list] of TOPICS) {
  const dup = list.filter((id, i) => list.indexOf(id) !== i)
  if (dup.length) err(`topics.ts 科室 ${dept} 病种 id 重复：${[...new Set(dup)].join('、')}`)
  if (!list.length) warn(`topics.ts 科室 ${dept} 没有定义任何病种`)
}

/* ------------------------------ 指南 ------------------------------ */

const guidelineFiles = readdirSync(DATA)
  .filter((f) => f.endsWith('.ts') && !NON_GUIDELINE_FILES.has(f))
  .sort()

/** 解析单个数据文件里的所有指南条目（id / dept / region / year / latest） */
function parseGuidelines(file) {
  const src = read(file)
  const marks = []
  const re = /^\s*id:\s*'([^']+)'/gm
  let m
  while ((m = re.exec(src))) marks.push({ id: m[1], at: m.index })

  return marks.map((mark, i) => {
    const chunk = src.slice(mark.at, i + 1 < marks.length ? marks[i + 1].at : src.length)
    const pick = (key) => chunk.match(new RegExp(`\\b${key}:\\s*'([^']*)'`))?.[1]
    const num = chunk.match(/\byear:\s*(\d{4})/)?.[1]
    return {
      id: mark.id,
      file,
      dept: pick('dept'),
      region: pick('region'),
      title: pick('title'),
      org: pick('org'),
      year: num ? Number(num) : undefined,
      latest: /\blatest:\s*true\b/.test(chunk),
      hasSections: /\bsections:\s*\[/.test(chunk),
    }
  })
}

const GUIDES = guidelineFiles.flatMap(parseGuidelines)

if (GUIDES.length < 100) err(`只解析到 ${GUIDES.length} 条指南，疑似解析逻辑或数据文件异常`)

/* 1. id 唯一 + 字符集 */
const byId = new Map()
const seenId = new Map()
for (const g of GUIDES) {
  if (seenId.has(g.id)) err(`指南 id 重复：${g.id}（${seenId.get(g.id)} 与 ${g.file}）`)
  else seenId.set(g.id, g.file)
  byId.set(g.id, g)

  if (!/^[a-z0-9-]+$/.test(g.id)) {
    const bad = [...g.id].filter((c) => !/[a-z0-9-]/.test(c)).join('')
    err(`指南 id 含非法字符：${g.id}（${g.file}）非法字符 → ${bad || '未知'}`)
  }
}

/* 2. 字段合法性 */
const THIS_YEAR = new Date().getFullYear()
for (const g of GUIDES) {
  if (!g.dept) err(`${g.file} 的 ${g.id} 缺少 dept 字段`)
  else if (!DEPT_IDS.has(g.dept)) err(`${g.file} 的 ${g.id} 指向未登记科室：${g.dept}`)

  if (!g.title) err(`${g.file} 的 ${g.id} 缺少 title`)
  if (g.region !== 'cn' && g.region !== 'intl') {
    err(`${g.file} 的 ${g.id} 的 region 非法：${g.region ?? '(空)'}（应为 cn / intl）`)
  }
  if (!g.year || g.year < 1990 || g.year > THIS_YEAR + 1) {
    err(`${g.file} 的 ${g.id} 的 year 异常：${g.year ?? '(空)'}`)
  }
  if (!g.hasSections) err(`${g.file} 的 ${g.id} 没有 sections 内容`)
}

/* 3. topic-map 校验 */
const mapSrc = read('topic-map.ts')
const MAP = new Map()
for (const m of mapSrc.matchAll(/'([^']+)':\s*'([^']+)'/g)) {
  if (MAP.has(m[1])) err(`topic-map.ts 重复登记：${m[1]}`)
  MAP.set(m[1], m[2])
}

const badTopic = []
for (const [gid, tid] of MAP) {
  const g = byId.get(gid)
  if (!g) {
    err(`topic-map.ts 登记了不存在的指南：${gid}`)
    continue
  }
  if (!g.dept) continue
  if (!topicSetOf(g.dept).has(tid)) {
    badTopic.push(`${gid} → ${tid}（${DEPT_NAME.get(g.dept) ?? g.dept} 无此病种）`)
  }
}
if (badTopic.length) err(`病种 id 与科室不匹配：${badTopic.length} 条\n      - ${badTopic.join('\n      - ')}`)

/* 4. 科室覆盖 */
for (const d of DEPTS) {
  const n = GUIDES.filter((g) => g.dept === d.id).length
  if (n === 0) err(`科室「${d.name}」(${d.id}) 没有任何指南`)
}

/* 5. 警告项 */
const unmapped = GUIDES.filter((g) => !MAP.has(g.id))
if (unmapped.length) {
  warn(
    `未登记病种的指南 ${unmapped.length} 条（会落到本科室「其他」）：\n      - ` +
      unmapped.map((g) => `${g.id}（${g.file}）`).join('\n      - '),
  )
}

const usedTopics = new Map()
for (const g of GUIDES) {
  const t = MAP.get(g.id)
  if (!t || !g.dept) continue
  usedTopics.set(`${g.dept}/${t}`, (usedTopics.get(`${g.dept}/${t}`) ?? 0) + 1)
}
const unused = []
for (const [dept, list] of TOPICS) {
  for (const t of list) if (!usedTopics.has(`${dept}/${t}`)) unused.push(`${dept}/${t}`)
}
if (unused.length) info(`定义了但还没有指南使用的病种 ${unused.length} 个：${unused.join('、')}`)

/* ------------------------------ 顶刊研究 ------------------------------ */

const RESEARCH = join(DATA, 'research')
const RESEARCH_SKIP = new Set(['types.ts', 'index.ts', 'link.ts'])
const researchFiles = existsSync(RESEARCH)
  ? readdirSync(RESEARCH)
      .filter((f) => f.endsWith('.ts') && !RESEARCH_SKIP.has(f))
      .sort()
  : []

const LEVELS = new Set(['practice', 'promising', 'exploratory'])

/** 从 journals.ts 读期刊登记表：name → tier */
const journalSrc = readFileSync(join(RESEARCH, 'journals.ts'), 'utf8')
const JOURNALS = new Map()
for (const m of journalSrc.matchAll(/^[ \t]*'?([^':\r\n][^':\r\n]*?)'?:[ \t]*\['(top|field|major)',[ \t]*'([^']+)'\]/gm)) {
  if (JOURNALS.has(m[1])) err(`journals.ts 期刊重复登记：${m[1]}`)
  JOURNALS.set(m[1], { tier: m[2], field: m[3] })
}
if (JOURNALS.size < 40) err(`journals.ts 只解析到 ${JOURNALS.size} 个期刊，疑似解析逻辑或数据异常`)

/** 解析单个研究数据文件里的所有条目 */
function parseFindings(file) {
  const src = readFileSync(join(RESEARCH, file), 'utf8')
  const marks = []
  const re = /^\s*id:\s*'([^']+)'/gm
  let m
  while ((m = re.exec(src))) marks.push({ id: m[1], at: m.index })

  return marks.map((mark, i) => {
    const chunk = src.slice(mark.at, i + 1 < marks.length ? marks[i + 1].at : src.length)
    const pick = (key) => chunk.match(new RegExp(`\\b${key}:\\s*'([^']*)'`))?.[1]
    return {
      id: mark.id,
      file,
      dept: pick('dept'),
      topic: pick('topic'),
      journal: pick('journal'),
      date: pick('date'),
      level: pick('level'),
      impact: pick('impact'),
      title: pick('title'),
      population: pick('population'),
      arms: pick('arms'),
      endpoint: pick('endpoint'),
      stats: pick('stats'),
      resultCount: (chunk.match(/^\s*'[^']*',\s*$/gm) ?? []).length,
      hasResults: /\bresults:\s*\[/.test(chunk),
    }
  })
}

const FINDINGS = researchFiles.flatMap(parseFindings)

if (!FINDINGS.length) err('未能从 src/data/research/ 解析出任何研究条目，请检查数据或解析逻辑')

const now = new Date()
const nowNum = now.getFullYear() * 12 + now.getMonth()
const seenFinding = new Map()

for (const f of FINDINGS) {
  if (seenFinding.has(f.id)) err(`研究 id 重复：${f.id}（${seenFinding.get(f.id)} 与 ${f.file}）`)
  else seenFinding.set(f.id, f.file)

  if (!/^r-[a-z0-9-]+$/.test(f.id)) err(`研究 id 命名不规范：${f.id}（${f.file}，应形如 r-cardio-01）`)
  if (!f.title) err(`${f.file} 的 ${f.id} 缺少 title`)
  if (!f.journal) err(`${f.file} 的 ${f.id} 缺少 journal`)
  if (!f.impact) err(`${f.file} 的 ${f.id} 缺少 impact（临床意义）`)
  if (!f.hasResults || !f.resultCount) err(`${f.file} 的 ${f.id} 没有 results 内容`)

  if (!f.journal) {
    // 上面已报缺失
  } else if (!JOURNALS.has(f.journal)) {
    err(`${f.file} 的 ${f.id} 用了未登记的期刊「${f.journal}」，请在 research/journals.ts 补一行`)
  }

  if (!f.level || !LEVELS.has(f.level)) {
    err(
      `${f.file} 的 ${f.id} 的 level 非法：${f.level ?? '(空)'}（应为 practice / promising / exploratory）`,
    )
  }

  // 研究方法四要素：人群、干预与对照、主要终点、统计分析，缺一不可
  const methodMissing = ['population', 'arms', 'endpoint', 'stats'].filter((k) => !f[k])
  if (methodMissing.length) {
    err(`${f.file} 的 ${f.id} 缺少研究方法字段：${methodMissing.join('、')}`)
  }

  if (!f.dept) err(`${f.file} 的 ${f.id} 缺少 dept`)
  else if (!DEPT_IDS.has(f.dept)) err(`${f.file} 的 ${f.id} 指向未登记科室：${f.dept}`)
  else if (f.topic && !topicSetOf(f.dept).has(f.topic)) {
    err(`${f.file} 的 ${f.id} 的病种 ${f.topic} 不属于科室 ${f.dept}`)
  }

  const dm = f.date?.match(/^(\d{4})-(\d{2})$/)
  if (!dm) {
    err(`${f.file} 的 ${f.id} 的 date 格式错误：${f.date ?? '(空)'}（应为 YYYY-MM）`)
  } else {
    const mn = Number(dm[2])
    const num = Number(dm[1]) * 12 + (mn - 1)
    if (mn < 1 || mn > 12) err(`${f.file} 的 ${f.id} 的 date 月份非法：${f.date}`)
    else if (num > nowNum) err(`${f.file} 的 ${f.id} 的 date 晚于当前月份：${f.date}`)
  }
}

for (const d of DEPTS) {
  if (!FINDINGS.some((f) => f.dept === d.id)) {
    err(`科室「${d.name}」(${d.id}) 没有任何顶刊研究`)
  }
}

const findingsInWindow = FINDINGS.filter((f) => {
  const num = Number(f.date?.slice(0, 4)) * 12 + (Number(f.date?.slice(5, 7)) - 1)
  return num > nowNum - 12
}).length

/* ------------------------------ 输出 ------------------------------ */

const cn = GUIDES.filter((g) => g.region === 'cn').length
const intl = GUIDES.filter((g) => g.region === 'intl').length
const usedTopicCount = usedTopics.size

console.log('=== 数据校验 ===')
console.log(`指南数据文件：${guidelineFiles.length} 个`)
console.log(`指南条目：${GUIDES.length}（国内 ${cn} / 国际 ${intl}）`)
const tierCount = { top: 0, field: 0, major: 0 }
for (const f of FINDINGS) {
  const t = JOURNALS.get(f.journal)?.tier
  if (t) tierCount[t]++
}
console.log(`研究数据文件：${researchFiles.length} 个 · 研究条目：${FINDINGS.length}（近一年 ${findingsInWindow} 条）`)
console.log(
  `研究期刊：登记 ${JOURNALS.size} 种 / 已使用 ${new Set(FINDINGS.map((f) => f.journal)).size} 种` +
    `（综合顶刊 ${tierCount.top} 条 / 本领域顶刊 ${tierCount.field} 条 / 权威期刊 ${tierCount.major} 条）`,
)
console.log(`科室：${DEPTS.length}`)
console.log(`病种：定义 ${[...TOPICS.values()].reduce((n, l) => n + l.length, 0)} / 已使用 ${usedTopicCount}`)
console.log(`病种归属登记：${MAP.size} 条`)

for (const w of warnings) console.log(`[警告] ${w}`)
for (const i of infos) console.log(`[提示] ${i}`)
for (const e of errors) console.log(`[错误] ${e}`)

console.log(`\n结果：错误 ${errors.length} 个，警告 ${warnings.length} 个，提示 ${infos.length} 个`)
if (errors.length) {
  console.log('校验未通过，已阻止发布。')
  process.exit(1)
}
console.log('校验通过。')
