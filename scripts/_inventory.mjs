import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(ROOT, 'src', 'data')
const SKIP = new Set(['types.ts', 'departments.ts', 'topics.ts', 'topic-map.ts', 'index.ts'])

const files = readdirSync(DATA).filter((f) => f.endsWith('.ts') && !SKIP.has(f)).sort()
const rows = []
for (const file of files) {
  const src = readFileSync(join(DATA, file), 'utf8')
  const marks = []
  const re = /^\s*id:\s*'([^']+)'/gm
  let m
  while ((m = re.exec(src))) marks.push({ id: m[1], at: m.index })
  marks.forEach((mark, i) => {
    const chunk = src.slice(mark.at, i + 1 < marks.length ? marks[i + 1].at : src.length)
    const pick = (k) => chunk.match(new RegExp(`\\b${k}:\\s*'([^']*)'`))?.[1] ?? ''
    rows.push({
      file,
      id: mark.id,
      dept: pick('dept'),
      region: pick('region'),
      year: Number(chunk.match(/\byear:\s*(\d{4})/)?.[1] ?? 0),
      title: pick('title'),
      org: pick('org'),
      latest: /\blatest:\s*true\b/.test(chunk),
      short: pick('short'),
    })
  })
}

const byDept = new Map()
for (const r of rows) {
  if (!byDept.has(r.dept)) byDept.set(r.dept, [])
  byDept.get(r.dept).push(r)
}
for (const [dept, list] of [...byDept].sort()) {
  console.log(`\n===== ${dept} (${list.length}) =====`)
  for (const r of list.sort((a, b) => b.year - a.year)) {
    console.log(`${r.year} ${r.region} ${r.latest ? '*' : ' '} ${r.id} | ${r.title} | ${r.org}`)
  }
}
console.log(`\nTOTAL ${rows.length}`)
