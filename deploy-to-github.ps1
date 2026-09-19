<#
  一键把《肝病指南要点库》推送到 GitHub 并开启 GitHub Pages

  用法（在本目录打开 PowerShell）：
    .\deploy-to-github.ps1
    .\deploy-to-github.ps1 -Repo hep-guidelines

  若提示脚本被禁止运行，用：
    powershell -ExecutionPolicy Bypass -File .\deploy-to-github.ps1

  需要的 token 权限：勾选 repo（公开仓库勾 public_repo 即可）
  生成地址：https://github.com/settings/tokens  →  Tokens (classic)  →  Generate new token
  建议设置 7 天有效期，跑完立刻 Revoke。
#>
param(
  [string]$User,
  [string]$Repo = 'hep-guidelines',
  [string]$Token
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Get-StatusCode($err) {
  try { return [int]$err.Exception.Response.StatusCode } catch { return 0 }
}

# ---------- 确保 git 可用 ----------
$gitDir = 'C:\Program Files\Git\cmd'
if (Test-Path $gitDir) { $env:Path += ";$gitDir" }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw '找不到 git 命令。请确认已安装 Git for Windows，或新开一个终端后重试。'
}

# ---------- 收集输入 ----------
if (-not $User) { $User = (Read-Host 'GitHub 用户名').Trim() }
if (-not $Token) { $Token = (Read-Host 'GitHub Personal Access Token').Trim() }

$headers = @{
  Authorization          = "Bearer $Token"
  Accept                 = 'application/vnd.github+json'
  'X-GitHub-Api-Version' = '2022-11-28'
  'User-Agent'           = 'hep-guidelines-deploy'
}

Write-Host '==> 校验 token' -ForegroundColor Cyan
try {
  $me = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers
} catch {
  throw ("token 无效或已过期（HTTP {0}）。请到 https://github.com/settings/tokens 重新生成。" -f (Get-StatusCode $_))
}
Write-Host ("    已登录为 {0}" -f $me.login) -ForegroundColor Green

# 用 GitHub 的 noreply 邮箱提交，避免把真实邮箱写进公开仓库
$email = '{0}+{1}@users.noreply.github.com' -f $me.id, $me.login

Write-Host '==> 创建仓库（已存在则跳过）' -ForegroundColor Cyan
$repoBody = @{
  name        = $Repo
  private     = $false
  auto_init   = $false
  description = '肝病科国内外指南与共识要点速查，手机端优先、完全离线可用'
  has_issues  = $true
} | ConvertTo-Json

try {
  $null = Invoke-RestMethod -Uri 'https://api.github.com/user/repos' -Method Post `
    -Headers $headers -Body $repoBody -ContentType 'application/json'
  Write-Host '    仓库创建成功' -ForegroundColor Green
} catch {
  $code = Get-StatusCode $_
  if ($code -eq 422) { Write-Host '    仓库已存在，继续' -ForegroundColor Yellow }
  else { throw ("创建仓库失败（HTTP {0}）。请确认 token 勾选了 repo 权限。" -f $code) }
}

Write-Host '==> 提交本地改动' -ForegroundColor Cyan
git add -A
# 用 --quiet，仓库还没有提交时不会向 stderr 输出，避免 PowerShell 抛 NativeCommandError
& git rev-parse --verify --quiet HEAD | Out-Null
$hasCommit = ($LASTEXITCODE -eq 0)

if (-not $hasCommit) {
  git -c "user.name=$User" -c "user.email=$email" commit -m 'feat: 肝病指南要点库（国内外指南共识要点速查，支持离线）'
} elseif (git status --porcelain) {
  git -c "user.name=$User" -c "user.email=$email" commit -m 'chore: 更新站点与数据'
} else {
  Write-Host '    没有需要提交的改动' -ForegroundColor Yellow
}

Write-Host '==> 推送到 GitHub' -ForegroundColor Cyan
$remotes = git remote
if ($remotes -contains 'origin') { git remote remove origin }
# 推送时临时把 token 拼进地址，推完立即改回不带 token 的地址，避免明文留在 .git/config
git remote add origin "https://$User`:$Token@github.com/$User/$Repo.git"
git branch -M main
git push -u origin main
git remote set-url origin "https://github.com/$User/$Repo.git"
Write-Host '    推送完成' -ForegroundColor Green

Write-Host '==> 开启 GitHub Pages（main / docs）' -ForegroundColor Cyan
$pagesBody = @{ source = @{ branch = 'main'; path = '/docs' } } | ConvertTo-Json
try {
  $null = Invoke-RestMethod -Uri "https://api.github.com/repos/$User/$Repo/pages" -Method Post `
    -Headers $headers -Body $pagesBody -ContentType 'application/json'
  Write-Host '    Pages 已开启' -ForegroundColor Green
} catch {
  $code = Get-StatusCode $_
  if ($code -eq 409) {
    Write-Host '    Pages 之前已开启过，无需重复操作' -ForegroundColor Yellow
  } else {
    Write-Host ("    Pages 自动开启失败（HTTP {0}），请手动到仓库 Settings -> Pages 选择 main / docs" -f $code) -ForegroundColor Yellow
  }
}

Write-Host ''
Write-Host '全部完成。等 1-2 分钟后，手机打开：' -ForegroundColor Green
Write-Host ("    https://{0}.github.io/{1}/" -f $User, $Repo) -ForegroundColor White
Write-Host ''
Write-Host '提醒：' -ForegroundColor Gray
Write-Host '  1) 必须用 https:// 访问，Service Worker 与「添加到主屏幕」只在安全上下文生效。' -ForegroundColor Gray
Write-Host '  2) 安全起见，跑完请立刻到 https://github.com/settings/tokens 撤销这个 token。' -ForegroundColor Gray
