$ErrorActionPreference = "Stop"
$SupabaseUrl = "https://ykrdwmbbieccfftierzc.supabase.co"
$SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzZG1tc2t6d25xaG14Ym9yZ2YiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc3ODQ5OTc0NiwiZXhwIjoyMDk0MDc1NzQ2fQ.4KfC7z7XaBtXgU9nBNe2l_efewT1dMINR2P9QBTDBF8"
$ProjectRef = "ykrdwmbbieccfftierzc"
$MapsKey = "AIzaSyBmvJph4LmrbtW7skeczzpBIyb9WWzFKo4"
$MapsTrack = "6886af4bc8d66430190b1df6e1fd0ed2"

function Set-VercelEnv {
  param(
    [string]$Cwd,
    [string]$Name,
    [string]$Value,
    [switch]$WorkerOnly
  )
  Push-Location $Cwd
  try {
    npx vercel env rm $Name production --yes 2>$null
    npx vercel env add $Name production --value $Value --yes
    Write-Host "OK $Name" -ForegroundColor Green
  } finally {
    Pop-Location
  }
}

$workerVars = [ordered]@{
  "VITE_SUPABASE_URL" = $SupabaseUrl
  "VITE_SUPABASE_PUBLISHABLE_KEY" = $SupabaseKey
  "VITE_SUPABASE_PROJECT_ID" = $ProjectRef
  "SUPABASE_URL" = $SupabaseUrl
  "SUPABASE_ANON_KEY" = $SupabaseKey
  "SUPABASE_PUBLISHABLE_KEY" = $SupabaseKey
  "NEXT_PUBLIC_SUPABASE_URL" = $SupabaseUrl
  "NEXT_PUBLIC_SUPABASE_ANON_KEY" = $SupabaseKey
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" = $SupabaseKey
  "VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY" = $MapsKey
  "VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID" = $MapsTrack
}

$adminVars = [ordered]@{
  "VITE_SUPABASE_URL" = $SupabaseUrl
  "VITE_SUPABASE_PUBLISHABLE_KEY" = $SupabaseKey
  "VITE_SUPABASE_PROJECT_ID" = $ProjectRef
  "SUPABASE_URL" = $SupabaseUrl
  "SUPABASE_ANON_KEY" = $SupabaseKey
  "SUPABASE_PUBLISHABLE_KEY" = $SupabaseKey
  "NEXT_PUBLIC_SUPABASE_URL" = $SupabaseUrl
  "NEXT_PUBLIC_SUPABASE_ANON_KEY" = $SupabaseKey
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" = $SupabaseKey
}

$root = Split-Path -Parent $PSScriptRoot
$workerCwd = Join-Path $root "apps\worker"
$adminCwd = Join-Path $root "apps\admin"

Write-Host "`n=== Worker env ===" -ForegroundColor Cyan
foreach ($entry in $workerVars.GetEnumerator()) {
  Set-VercelEnv -Cwd $workerCwd -Name $entry.Key -Value $entry.Value
}

Write-Host "`n=== Admin env ===" -ForegroundColor Cyan
foreach ($entry in $adminVars.GetEnumerator()) {
  Set-VercelEnv -Cwd $adminCwd -Name $entry.Key -Value $entry.Value
}

Write-Host "`nDone." -ForegroundColor Green
