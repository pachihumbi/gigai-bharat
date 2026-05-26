#Requires -Version 5.1
<#
.SYNOPSIS
  Build marketing site for Spaceship and stage upload bundle.

.DESCRIPTION
  Output: apps/marketing/dist-spaceship/ (zip + extracted files ready for FTP/cPanel)

.EXAMPLE
  .\scripts\deploy-spaceship.ps1
  .\scripts\deploy-spaceship.ps1 -SkipBuild
#>
param(
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$env:DEPLOY_TARGET = "spaceship"
$env:VITE_SITE_URL = "https://www.bharatgig.live"

Write-Host "==> GigAI Bharat - Spaceship deploy bundle" -ForegroundColor Cyan
Write-Host "    DEPLOY_TARGET=$env:DEPLOY_TARGET"
Write-Host "    VITE_SITE_URL=$env:VITE_SITE_URL"

if (-not $SkipBuild) {
  Write-Host "`n==> npm ci" -ForegroundColor Yellow
  npm ci
  Write-Host "`n==> Build marketing (prerender to .output/public)" -ForegroundColor Yellow
  npm run build:spaceship -w @gigai/marketing
}

$OutputCandidates = @(
  Join-Path $Root "apps\marketing\.output\public"
  Join-Path $Root "apps\marketing\dist"
  Join-Path $Root "apps\marketing\.vercel\output\static"
)

$BuildDir = $OutputCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $BuildDir) {
  Write-Error "Build output not found. Expected one of:`n  $($OutputCandidates -join "`n  ")"
}

Write-Host "`n==> Build output: $BuildDir" -ForegroundColor Green

$Stage = Join-Path $Root "apps\marketing\dist-spaceship"
if (Test-Path $Stage) {
  Remove-Item $Stage -Recurse -Force
}
New-Item -ItemType Directory -Path $Stage | Out-Null

Write-Host "==> Staging files..." -ForegroundColor Yellow
Copy-Item -Path (Join-Path $BuildDir "*") -Destination $Stage -Recurse -Force

Copy-Item -Path (Join-Path $Root "deployment\spaceship\public\.htaccess") -Destination $Stage -Force
New-Item -ItemType Directory -Path (Join-Path $Stage "api") -Force | Out-Null
Copy-Item -Path (Join-Path $Root "deployment\spaceship\api\*.php") -Destination (Join-Path $Stage "api") -Force

$ZipPath = Join-Path $Root "apps\marketing\dist-spaceship.zip"
if (Test-Path $ZipPath) {
  Remove-Item $ZipPath -Force
}
Compress-Archive -Path (Join-Path $Stage "*") -DestinationPath $ZipPath

Write-Host "`n==> Ready for upload" -ForegroundColor Green
Write-Host "    Folder: $Stage"
Write-Host "    Zip:    $ZipPath"
Write-Host "`nUpload ALL contents of dist-spaceship/ to Spaceship document root (public_html)."
Write-Host "Then configure RESEND_API_KEY in api/contact.php (or cPanel env)."
Write-Host "See deployment/SPACESHIP_CHECKLIST.md for DNS + SSL steps."
