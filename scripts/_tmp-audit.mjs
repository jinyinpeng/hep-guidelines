#!/usr/bin/env node
/** 临时审计脚本：列出各科室 latest 条目与年份分布（用后即删） */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(ROOT, 'src', 'data')
const read = (f) => readFileSync(join(DATA, f), 'utf8')

const SKIP = new Set(['types.ts', 'departments.ts', 'topics.ts', 'topic-map.ts', 'index.ts'])
const files = readdirSync(DATA).filter((f) => f.endsWith('.ts') && !SKIP.has(f)).sort()

const out = []
for (const file of files) {
  const src = read(file)
  const marks = []
  const re = /^\s*id:\s*'([^']+)'/gm
  let m
  while ((m = re.exec(src))) marks.push({ id: m[1], at: m.index })
  marks.forEach((mark, i) => {
    const chunk = src.slice(mark.at, i + 1 < marks.length ? marks[i + 1].at : src.length)
    const pick = (k) => chunk.match(new RegExp(`\\b${k}:\\s*'([^']*)'`))?.[1]
    out.push({
      file,
      id: mark.id,
      dept: pick('dept'),
      region: pick('region'),
      year: Number(chunk.match(/\byear:\s*(\d{4})/)?.[1]),
      latest: /\blatest:\s*true\b/.test(chunk),
      title: pick('title'),
      org: pick('org'),
      topic: pick('topic'),
      grading: pick('grading'),
    })
  })
}

const byDept = new Map()
for (const g of out) {
  if (!byDept.has(g.dept)) byDept.set(g.dept, [])
  byDept.get(g.dept).push(g)
}

const deptSrc = read('departments.ts')
const DEPTS = [...deptSrc.matchAll(/^\s*\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'/gm)].map((m) => ({
  id: m[1],
  name: m[2],
}))

const only = process.argv[2]
const MAXYEAR = Number(process.argv[3] ?? 2000)

console.log('=== 各科室概览（按最新年升序）===')
const rows = DEPTS.map((d) => {
  const list = byDept.get(d.id) ?? []
  return {
    id: d.id,
    name: d.name,
    n: list.length,
    max: Math.max(...list.map((g) => g.year)),
    latest: list.filter((g) => g.latest).length,
    file: list[0]?.file,
  }
}).sort((a, b) => a.max - b.max)
for (const r of rows) {
  console.log(`${String(r.max).padEnd(5)} ${r.name} (${r.id})  共${r.n}条 latest${r.latest}条  ${r.file}`)
}

console.log(`\n=== latest 条目明细（最新年 <= ${MAXYEAR} 的科室）===`)
for (const r of rows) {
  if (r.max > MAXYEAR) continue
  const list = (byDept.get(r.id) ?? []).filter((g) => g.latest).sort((a, b) => b.year - a.year)
  console.log(`\n### ${r.name} (${r.id})`)
  for (const g of list) {
    console.log(`  [${g.region}] ${g.year} ${g.id} | ${g.title} | ${g.org} | topic=${g.topic} grading=${g.grading ? 'Y' : '-'}`)
  }
}
