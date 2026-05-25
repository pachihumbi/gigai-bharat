# GigAI Bharat — Production Go-Live (one command)
# Prerequisites: VERCEL_TOKEN from https://vercel.com/account/tokens

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

if (-not $env:VERCEL_TOKEN) {
  Write-Host "Set VERCEL_TOKEN first:" -ForegroundColor Red
  Write-Host '  $env:VERCEL_TOKEN = "your_token_here"' -ForegroundColor Yellow
  Write-Host "  .\scripts\go-live.ps1" -ForegroundColor Yellow
  exit 1
}

Write-Host "Starting go-live..." -ForegroundColor Cyan
node scripts/go-live.mjs
exit $LASTEXITCODE
