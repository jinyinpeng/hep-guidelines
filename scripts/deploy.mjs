#!/usr/bin/env node
/**
 * 一键发布：把本地最新的指南数据构建、提交、推送到 GitHub，并核验线上产物。
 *
 * 用法：
 *   node scripts/deploy.mjs                      # 自动生成提交信息
 *   node scripts/deploy.mjs "feat: 新增 xx 指南"  # 指定提交信息
 *   npm run deploy                               # 等价写法
 *
 * 环境变量：
 *   DEPLOY_NO_WAIT=1   只推送，不等待 CI、不核验线上（用于快速提交）
 *   DEPLOY_DRY_RUN=1   只做校验与构建，不提交不推送
 *
 * 流水线：
 *   1. 同步远端 main（CI 会把构建产物提交回 docs/，本地经常落后）
 *   2. 数据完整性校验（scripts/verify-data.mjs），不通过就终止
 *   3. 构建（tsc --noEmit + vite build）
 *   4. 提交并推送 main
 *   5. 轮询等待 GitHub Actions 产出新的 docs/ 提交并拉回
 *   6. 核验线上 index.html 引用的 JS 与本地 docs/ 产物一致
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BRANCH = 'main'
const COMMIT_IDENT = [
  '-c',
  'user.name=jinyinpeng',
  '-c',
  'user.email=jinyinpeng@users.noreply.github.com',
]
const TOTAL_STEPS = 6
const CI_POLL_MS = 15_000
const CI_TIMEOUT_MS = 10 * 60_000
const WEB_POLL_MS = 15_000
const WEB_TIMEOUT_MS = 10 * 60_000

const NO_WAIT = process.env.DEPLOY_NO_WAIT === '1'
const DRY_RUN = process.env.DEPLOY_DRY_RUN === '1'

/* ------------------------------ 基础工具 ------------------------------ */

const env = { ...process.env }
if (process.platform === 'win32') {
  const gitDir = 'C:\\Program Files\\Git\\cmd'
  if (existsSync(gitDir)) {
    env.Path = `${env.Path};${gitDir}`
    process.env.Path = env.Path
  }
}

/** Windows 下 CreateProcess 不认子进程 env 里的 PATH，这里直接解析 git 的绝对路径 */
function resolveGit() {
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Git\\cmd\\git.exe',
          'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
          join(process.env.LOCALAPPDATA ?? '', 'Programs', 'Git', 'cmd', 'git.exe'),
        ]
      : ['/usr/bin/git', '/usr/local/bin/git', '/opt/homebrew/bin/git']
  for (const p of candidates) {
    if (p && existsSync(p)) return p
  }
  return 'git'
}
const GIT = resolveGit()

function run(cmd, args, { capture = true, allowFail = false } = {}) {
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    env,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  })
  if (r.error) {
    if (allowFail) return { code: -1, out: '', err: String(r.error) }
    throw new Error(`无法执行 ${cmd}：${r.error.message}`)
  }
  if (r.status !== 0 && !allowFail) {
    const detail = capture ? (r.stderr || r.stdout || '').trim() : ''
    throw new Error(`${cmd} ${args.join(' ')} 执行失败（退出码 ${r.status}）${detail ? `\n${detail}` : ''}`)
  }
  return { code: r.status ?? 0, out: (r.stdout ?? '').trim(), err: (r.stderr ?? '').trim() }
}

const git = (args, opt) => run(GIT, args, opt)

const step = (n, title) => console.log(`\n[${n}/${TOTAL_STEPS}] ${title}`)
const ok = (msg) => console.log(`      ✓ ${msg}`)
const note = (msg) => console.log(`      · ${msg}`)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ------------------------------ 1. 前置检查 ------------------------------ */

step(1, '检查仓库状态')

const gitOk = git(['--version'], { allowFail: true })
if (gitOk.code !== 0) {
  console.error('找不到 git 命令，请确认已安装 Git for Windows。')
  process.exit(1)
}
note(gitOk.out)

const dirty = git(['status', '--porcelain']).out
const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']).out
if (branch !== BRANCH) {
  console.error(`当前分支是 ${branch}，请在 ${BRANCH} 分支上发布。`)
  process.exit(1)
}
ok(`分支 ${branch}${dirty ? `，有 ${dirty.split('\n').length} 项待提交改动` : '，工作区干净'}`)

/* ------------------------------ 2. 同步远端 ------------------------------ */

step(2, '同步远端')

git(['fetch', 'origin', '--prune'], { allowFail: true })
const behind = Number(git(['rev-list', '--count', `HEAD..origin/${BRANCH}`], { allowFail: true }).out || 0)
if (behind > 0) {
  note(`本地落后远端 ${behind} 个提交，先拉取`)
  git([...COMMIT_IDENT, 'pull', '--no-rebase', '--no-edit', 'origin', BRANCH])
  ok(`已拉取，当前 HEAD ${git(['rev-parse', '--short', 'HEAD']).out}`)
} else {
  ok('本地与远端一致')
}

/* ------------------------------ 3. 数据校验 ------------------------------ */

step(3, '数据完整性校验')
const verify = run(process.execPath, [join('scripts', 'verify-data.mjs')], { capture: false, allowFail: true })
if (verify.code !== 0) {
  console.error('\n数据校验未通过，已终止发布。')
  process.exit(1)
}

/* ------------------------------ 4. 构建 ------------------------------ */

step(4, '构建')

const tscBin = join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc')
const viteBin = join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
if (!existsSync(viteBin)) {
  console.error('未找到本地依赖，请先执行 npm install。')
  process.exit(1)
}

const tsc = run(process.execPath, [tscBin, '--noEmit'], { capture: false, allowFail: true })
if (tsc.code !== 0) {
  console.error('\n类型检查未通过，已终止发布。')
  process.exit(1)
}
ok('类型检查通过')

const build = run(process.execPath, [viteBin, 'build'], { capture: false, allowFail: true })
if (build.code !== 0) {
  console.error('\n构建失败，已终止发布。')
  process.exit(1)
}

const distAssets = join(ROOT, 'dist', 'assets')
const freshAsset = readdirSync(distAssets)
  .filter((f) => f.startsWith('index-') && f.endsWith('.js'))
  .sort()
  .pop()
ok(`构建产物 ${freshAsset}`)

if (DRY_RUN) {
  console.log('\nDEPLOY_DRY_RUN=1，仅校验与构建，不提交、不推送。')
  process.exit(0)
}

/* ------------------------------ 5. 提交并推送 ------------------------------ */

step(5, '提交并推送')

git(['add', '-A'])
const staged = git(['diff', '--cached', '--name-only']).out

if (!staged) {
  note('没有需要提交的改动')
} else {
  const files = staged.split('\n').length
  const message = process.argv[2]?.trim() || guessMessage(staged)
  git([...COMMIT_IDENT, 'commit', '-m', message])
  ok(`提交 ${git(['rev-parse', '--short', 'HEAD']).out} · ${files} 个文件 · ${message}`)

  const push = git(['push', 'origin', BRANCH], { allowFail: true })
  if (push.code !== 0) {
    console.error(`\n推送失败：${push.err || push.out}`)
    process.exit(1)
  }
  ok('已推送到 origin/main')
}

const localHead = git(['rev-parse', 'HEAD']).out

/* ------------------------------ 6. 等待 CI 并核验线上 ------------------------------ */

if (NO_WAIT) {
  note('DEPLOY_NO_WAIT=1，跳过等待 CI 与线上核验')
  process.exit(0)
}

step(6, '等待 GitHub Actions 构建并核验线上')

// 构建产物与已发布的 docs/ 一致 → 源码改动不影响产物（如只改了脚本/文档），CI 不会产生新提交，无需等待
const docsBefore = newestDocsAsset()
const ciNeeded = !docsBefore || docsBefore !== freshAsset

if (!ciNeeded) {
  note(`本地构建产物与已发布版本一致（${freshAsset}），无需等待 CI`)
} else {
  const startedAt = Date.now()
  const deadline = startedAt + CI_TIMEOUT_MS
  let ciCommit = null
  while (Date.now() < deadline) {
    git(['fetch', 'origin', BRANCH], { allowFail: true })
    const remote = git(['rev-parse', `origin/${BRANCH}`], { allowFail: true }).out
    if (remote && remote !== localHead) {
      ciCommit = remote
      break
    }
    note(`CI 构建中… 已等待 ${Math.round((Date.now() - startedAt) / 1000)}s`)
    await sleep(CI_POLL_MS)
  }

  if (!ciCommit) {
    console.log('\n等待 CI 超时。可稍后自行执行：git pull origin main，或到仓库 Actions 页查看失败原因。')
    process.exit(1)
  }

  git([...COMMIT_IDENT, 'pull', '--no-rebase', '--no-edit', 'origin', BRANCH], { allowFail: true })
  ok(`CI 已产出 docs 提交 ${ciCommit.slice(0, 7)}`)

  const docsAfter = newestDocsAsset()
  if (docsAfter === freshAsset) ok('CI 产物与本地构建一致')
  else note(`CI 产物为 ${docsAfter ?? '(缺失)'}，与本地 ${freshAsset} 不同`)
}

const url = pagesUrl()
if (!url) {
  note('无法从 origin 推断 Pages 地址，跳过线上核验')
  process.exit(0)
}

if (await waitForOnline(url, freshAsset)) {
  console.log(`\n线上已是最新版本：${url}`)
  console.log(`线上产物 ${freshAsset}`)
} else {
  console.log(`\n线上核验超时：${url}`)
  console.log(`期望产物 ${freshAsset}，请稍后手动刷新确认，或到仓库 Actions 页查看部署日志。`)
  process.exit(1)
}

/* ------------------------------ 辅助 ------------------------------ */

function newestDocsAsset() {
  const dir = join(ROOT, 'docs', 'assets')
  if (!existsSync(dir)) return null
  return (
    readdirSync(dir)
      .filter((f) => f.startsWith('index-') && f.endsWith('.js'))
      .sort()
      .pop() ?? null
  )
}

function pagesUrl() {
  const remote = git(['remote', 'get-url', 'origin'], { allowFail: true }).out
  const m = remote.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/)
  if (!m) return null
  const [, user, repo] = m
  if (/\.github\.io$/i.test(user)) return `https://${user}/${repo}/`
  return `https://${user}.github.io/${repo}/`
}

async function waitForOnline(url, asset) {
  if (!asset) return false
  const deadline = Date.now() + WEB_TIMEOUT_MS
  let seen = null
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' })
      if (res.ok) {
        const html = await res.text()
        seen = html.match(/assets\/(index-[\w-]+\.js)/)?.[1] ?? null
        if (seen === asset) return true
      }
    } catch {
      /* 网络抖动，继续重试 */
    }
    note(`线上产物 ${seen ?? '未知'}，等待刷新…`)
    await sleep(WEB_POLL_MS)
  }
  return false
}

/** 按改动文件猜一个说得过去的提交信息 */
function guessMessage(files) {
  const list = files.split('\n')
  const data = list.filter((f) => f.startsWith('src/data/'))
  const topicFiles = list.filter((f) => f === 'src/data/topics.ts' || f === 'src/data/topic-map.ts')
  if (data.length && topicFiles.length === data.length) return 'chore: 更新病种分类'
  if (data.length) return `chore: 更新指南数据（${data.length} 个数据文件）`
  if (list.every((f) => f.startsWith('docs/'))) return 'chore: rebuild docs [skip ci]'
  return 'chore: 更新站点'
}
