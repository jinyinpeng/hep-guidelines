import { spawnSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

function resolveGit() {
  const candidates = [
    'C:\\Program Files\\Git\\cmd\\git.exe',
    'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
    join(process.env.LOCALAPPDATA ?? '', 'Programs', 'Git', 'cmd', 'git.exe'),
  ]
  for (const p of candidates) if (p && existsSync(p)) return p
  return 'git'
}
const GIT = resolveGit()
const run = (args) => {
  const r = spawnSync(GIT, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  return ((r.stdout || '') + (r.stderr || '')).trim()
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

run(['fetch', 'origin', '--prune'])
const head = run(['rev-parse', '--short', 'HEAD'])
const remote = run(['rev-parse', '--short', 'origin/main'])
console.log(`HEAD=${head} origin/main=${remote}`)
console.log('已推送:', head === remote)
console.log('--- status ---')
console.log(run(['status', '--porcelain']) || '(干净)')

if (head !== remote) {
  console.log('本地领先远端，等待对方推送…')
  for (let i = 1; i <= 12; i++) {
    await sleep(15000)
    run(['fetch', 'origin', '--prune'])
    const r = run(['rev-parse', '--short', 'origin/main'])
    const h = run(['rev-parse', '--short', 'HEAD'])
    console.log(`[${i}] HEAD=${h} origin/main=${r}`)
    if (r !== remote) break
  }
}
console.log('--- log -5 (含远端) ---')
console.log(run(['--no-pager', 'log', '--oneline', '-5', 'origin/main']))
console.log('--- docs/version.json ---')
console.log(require0())
function require0() {
  const p = join(process.cwd(), 'docs', 'version.json')
  return existsSync(p) ? require('node:fs').readFileSync(p, 'utf8') : '(缺失)'
}
console.log('--- docs/version.json mtime ---')
const vp = join(process.cwd(), 'docs', 'version.json')
if (existsSync(vp)) console.log(statSync(vp).mtime.toISOString())
