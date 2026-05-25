# GigAI Bharat — Vercel production env bootstrap (PowerShell)
# Run from repo root after: npx vercel login && cd apps/marketing && npx vercel link

$ErrorActionPreference = "Stop"

Write-Host "Link marketing project first: cd apps/marketing; npx vercel link" -ForegroundColor Cyan
Write-Host "Then run each env add interactively when prompted:" -ForegroundColor Cyan
Write-Host ""

$vars = @(
  @{ Name = "RESEND_API_KEY"; Envs = "production" },
  @{ Name = "EMAIL_FROM"; Envs = "production"; Default = "GigAI Bharat <no-reply@bharatgig.live>" },
  @{ Name = "VITE_SITE_URL"; Envs = "production"; Default = "https://www.bharatgig.live" },
  @{ Name = "TURNSTILE_SECRET_KEY"; Envs = "production" },
  @{ Name = "VITE_TURNSTILE_SITE_KEY"; Envs = "production preview" },
  @{ Name = "CONTACT_ADMIN_NOTIFY"; Envs = "production" }
)

foreach ($v in $vars) {
  Write-Host "vercel env add $($v.Name) $($v.Envs)" -ForegroundColor Yellow
  if ($v.Default) { Write-Host "  suggested: $($v.Default)" -ForegroundColor DarkGray }
}

Write-Host ""
Write-Host "Redeploy: npx vercel deploy --prebuilt --prod" -ForegroundColor Green
Write-Host "Verify:   npm run verify:email-dns && npm run health:production" -ForegroundColor Green
