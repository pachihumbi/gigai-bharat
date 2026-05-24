# GigAI Bharat — production deploy helper
# Usage:
#   $env:VERCEL_TOKEN = "..."   # from vercel.com/account/tokens
#   .\scripts\deploy-vercel.ps1 -Target all -SkipCache

param(
  [ValidateSet("marketing", "worker", "all")]
  [string]$Target = "all",
  [switch]$SkipCache
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

if (-not $env:VERCEL_TOKEN) {
  Write-Error "VERCEL_TOKEN not set. Create at https://vercel.com/account/tokens"
}

Set-Location $Root
npm install

function Deploy-Marketing {
  Write-Host "`n=== Marketing (www.bharatgig.live) ===" -ForegroundColor Cyan
  Set-Location "$Root\apps\marketing"
  $env:VERCEL = "1"
  npm run build
  $args = @("deploy", "--prebuilt", "--prod", "--yes", "--token", $env:VERCEL_TOKEN)
  if ($SkipCache) { $args += "--force" }
  npx vercel@latest @args
  Remove-Item Env:VERCEL -ErrorAction SilentlyContinue
}

function Deploy-Worker {
  Write-Host "`n=== Worker (app.bharatgig.live) ===" -ForegroundColor Cyan
  Set-Location "$Root\apps\worker"
  npm run build
  $outDir = Join-Path $Root ".vercel\output"
  $outStatic = Join-Path $outDir "static"
  Remove-Item $outDir -Recurse -Force -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Path $outStatic -Force | Out-Null
  Copy-Item (Join-Path "$Root\apps\worker\dist\*") $outStatic -Recurse
  @'
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
'@ | Set-Content (Join-Path $outDir "config.json") -Encoding utf8
  Set-Location $Root
  $args = @("deploy", "--prebuilt", "--prod", "--yes", "--project", "gigai-bharat-worker", "--token", $env:VERCEL_TOKEN)
  if ($SkipCache) { $args += "--force" }
  npx vercel@latest @args
}

switch ($Target) {
  "marketing" { Deploy-Marketing }
  "worker"    { Deploy-Worker }
  "all"       { Deploy-Marketing; Deploy-Worker }
}

Write-Host "`nDone. Verify:" -ForegroundColor Green
Write-Host "  https://www.bharatgig.live"
Write-Host "  https://app.bharatgig.live"
