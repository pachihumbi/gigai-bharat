# GitHub Setup

Repo: **https://github.com/pachihumbi/gigai-bharat**

## Branch strategy

| Branch | Purpose | Deploy |
|--------|---------|--------|
| `main` | Production | Auto → Vercel via Actions |
| `develop` | Integration | CI only |
| `feat/*` | Features | PR → develop |
| `fix/*` | Hotfixes | PR → main (urgent) |

### Create develop (if missing)

```powershell
git checkout -b develop
git push -u origin develop
```

### Protect main

GitHub → Settings → Branches → Add rule:

- Branch name: `main`
- Require pull request before merging
- Require status checks: **CI / lint-and-build**
- Do not allow bypassing

## Required secrets

GitHub → Settings → Secrets and variables → Actions:

| Secret | Where to get it |
|--------|-----------------|
| `VERCEL_TOKEN` | vercel.com → Account → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` or Vercel team settings |
| `VERCEL_MARKETING_PROJECT_ID` | Marketing project → Settings → General |
| `VERCEL_WORKER_PROJECT_ID` | Worker project → Settings → General |
| `VITE_SUPABASE_URL` | Supabase → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | `jsdmmskzwnqhmxboergf` |
| `VITE_GOOGLE_MAPS_KEY` | Google Cloud Console |
| `VITE_GOOGLE_MAPS_TRACKING_ID` | Google Maps tracking ID |

Verify locally:

```powershell
npm run verify:secrets
```

(Checks env file presence — set real values in GitHub UI.)

## Workflows (already in repo)

| Workflow | File | Trigger |
|----------|------|---------|
| CI | `.github/workflows/ci.yml` | push/PR to main, develop |
| Deploy Production | `.github/workflows/deploy-production.yml` | push to main (app paths) |
| Validate Production | `.github/workflows/validate-production.yml` | every 6h + push |

### Manual production deploy

GitHub → Actions → **Deploy Production** → Run workflow → `skip_cache: true`

## Commit convention

```
feat(marketing): add investor metrics section
fix(worker): auth callback redirect
chore(deployment): update DNS runbook
docs: founder launch checklist
```

## Release tags

```powershell
git tag -a v0.1.0-launch -m "Founder launch — bharatgig.live"
git push origin v0.1.0-launch
```

Formats: `marketing-v0.1.0`, `worker-v0.2.0`, `platform-v0.3.0` (Supabase).
