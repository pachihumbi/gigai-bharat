# Set all marketing email env vars on Vercel (Production + Preview + Development)
# Usage:
#   $env:RESEND_API_KEY = "re_..."
#   $env:TURNSTILE_SECRET_KEY = "..."
#   $env:VITE_TURNSTILE_SITE_KEY = "..."
#   .\scripts\lockdown-production.ps1

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\..\apps\marketing"

function Add-VercelEnv($Name, $Value, $Targets) {
  if (-not $Value) {
    Write-Host "SKIP $Name (not set locally)" -ForegroundColor Yellow
    return
  }
  foreach ($target in $Targets) {
    Write-Host "Adding $Name → $target" -ForegroundColor Cyan
    $Value | npx vercel env add $Name $target --force 2>&1
  }
}

$targets = @("production", "preview", "development")

Add-VercelEnv "RESEND_API_KEY" $env:RESEND_API_KEY $targets
Add-VercelEnv "EMAIL_FROM" $(if ($env:EMAIL_FROM) { $env:EMAIL_FROM } else { "GigAI Bharat <no-reply@bharatgig.live>" }) $targets
Add-VercelEnv "VITE_SITE_URL" $(if ($env:VITE_SITE_URL) { $env:VITE_SITE_URL } else { "https://www.bharatgig.live" }) $targets
Add-VercelEnv "TURNSTILE_SECRET_KEY" $env:TURNSTILE_SECRET_KEY $targets
Add-VercelEnv "VITE_TURNSTILE_SITE_KEY" $env:VITE_TURNSTILE_SITE_KEY $targets
Add-VercelEnv "CONTACT_ADMIN_NOTIFY" $env:CONTACT_ADMIN_NOTIFY @("production")

Write-Host "`nRedeploying marketing (prebuilt, force)..." -ForegroundColor Green
Set-Location "$PSScriptRoot\.."
$env:VERCEL = "1"
$env:VITE_SITE_URL = "https://www.bharatgig.live"
npm run build -w @gigai/marketing
Set-Location apps/marketing
npx vercel deploy --prebuilt --prod --force

Write-Host "`nRunning validation..." -ForegroundColor Green
Set-Location "$PSScriptRoot\.."
Start-Sleep -Seconds 20
npm run health:production
node scripts/verify-email-dns.mjs
node scripts/test-contact-api.mjs

if ($env:CONTACT_TEST_EMAIL) {
  node scripts/test-contact-api.mjs --send
}

Write-Host "`nLockdown complete." -ForegroundColor Green
