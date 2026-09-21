import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'src/data'
const files = readdirSync(dir).filter(
  (f) => f.endsWith('.ts') && !['index.ts', 'types.ts', 'departments.ts', 'topics.ts', 'topic-map.ts'].includes(f),
)

const rows = []
for (const f of files) {
  const txt = readFileSync(join(dir, f), 'utf8')
  const parts = txt.split(/\n\s*id:\s*'/)
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i]
    const id = p.slice(0, p.indexOf("'"))
    const g = (re) => (p.match(re)?.[1] ?? '').trim()
    rows.push({
      file: f,
      id,
      dept: g(/\n\s*dept:\s*'([^']+)'/),
      year: Number(g(/\n\s*year:\s*(\d+)/) || 0),
      latest: /\n\s*latest:\s*true/.test('\n' + p),
      title: g(/\n\s*title:\s*'([^']+)'/),
      short: g(/\n\s*short:\s*'([^']+)'/),
      grading: /\n\s*grading:/.test('\n' + p) ? 'G' : '',
      hasRec: /\brec:\s*'/.test(p) ? 'R' : '',
    })
  }
}

const byDept = (list) => list.sort((a, b) => a.dept.localeCompare(b.dept) || a.year - b.year || a.id.localeCompare(b.id))

let out = ''
out += `TOTAL ${rows.length}\n\n## A. latest=true 且 year <= 2023（疑似已有新版可替代）\n`
for (const r of byDept(rows.filter((r) => r.latest && r.year <= 2023))) {
  out += `${r.dept}\t${r.id}\t${r.year}\t${r.short}\n`
}
out += `\n## B. latest=false（历史版本，仅备查）\n`
for (const r of byDept(rows.filter((r) => !r.latest))) {
  out += `${r.dept}\t${r.id}\t${r.year}\t${r.short}\n`
}
out += `\n## C. 各科室条目数与年份分布\n`
const depts = [...new Set(rows.map((r) => r.dept))].sort()
for (const d of depts) {
  const list = rows.filter((r) => r.dept === d)
  const yrs = {}
  for (const r of list) yrs[r.year] = (yrs[r.year] ?? 0) + 1
  out += `${d}\t共 ${list.length}\t${Object.keys(yrs).sort().map((y) => `${y}:${yrs[y]}`).join(' ')}\n`
}
out += `\n## D. 全部条目（按科室/年份）\n`
let cur = ''
for (const r of byDept(rows)) {
  if (r.dept !== cur) {
    cur = r.dept
    out += `\n===== ${cur} (${r.file}) =====\n`
  }
  out += `${r.id}\t${r.year}\t${r.latest ? 'L' : '-'}\t${r.hasRec}${r.grading}\t${r.short}\n`
}

writeFileSync('_tmp_inventory.txt', out, 'utf8')
console.log('written', rows.length)
