# Contributing to GigAI Bharat

Thank you for helping build infrastructure for India's gig workers. This guide is written for **solo founders today** and **engineering hires tomorrow**.

---

## Before you start

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) — understand boundaries between apps and `supabase/`.
2. Read [SECURITY.md](./SECURITY.md) — never commit secrets.
3. Copy `.env.example` → `.env.local` (root + relevant app).

---

## Development setup

```bash
npm install
npm run dev:worker    # or dev:marketing / dev:admin
```

Supabase commands run from **repository root**:

```bash
npx supabase start
npm run db:reset
npm run functions:serve
```

---

## Git workflow (solo founder → small team)

### Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready only |
| `develop` | Integration branch |
| `feat/*` | Features |
| `fix/*` | Bug fixes |
| `chore/*` | Tooling, deps |

### Solo founder (now)

```
main ─────────────────────────────────────► deploy prod
  └── develop ──► feat/ocr-review ──► merge ──► main (weekly releases)
```

**Daily habit:**

1. Branch from `develop`: `git checkout -b feat/short-description`
2. Small commits with clear messages
3. Open PR to `develop` (even solo — CI runs)
4. Weekly: PR `develop` → `main` + tag `v0.x.y`

### When you hire (3+ engineers)

- Require 1 approval on `develop`
- `main` protected — only release PRs
- Add CODEOWNERS:
  - `@you` → `supabase/`
  - `@frontend-lead` → `apps/worker`, `packages/ui`

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(worker): add pending earnings review UI
fix(supabase): dedupe increment_balance migration
docs: update deployment checklist
```

---

## Code standards

| Area | Standard |
|------|----------|
| TypeScript | `strict` — no `any` without comment |
| React | Functional components, hooks |
| Styling | Tailwind; shared `cn()` from `@gigai/ui` |
| Data access | Supabase client + RLS; no raw SQL in apps |
| AI | Edge Functions only; structured tool outputs |
| Tests | Required for RPCs and payment logic |

### Where to put code

| Change | Location |
|--------|----------|
| Worker screen | `apps/worker/src/pages/` |
| Admin screen | `apps/admin/src/pages/` |
| Shared button | `packages/ui/` |
| DB schema | `supabase/migrations/` (new file) |
| Server AI | `supabase/functions/` |
| Prompt text | `infra/ai/prompts/` |

**Never** edit an already-applied migration — add a new one.

---

## Database changes

1. `npx supabase migration new descriptive_name`
2. Write SQL + RLS policies
3. Test locally: `npm run db:reset`
4. Regenerate types: `npm run db:types`
5. Update app imports if needed

---

## Pull request checklist

- [ ] `npm run lint` passes
- [ ] `npm run test` passes (worker)
- [ ] `npm run build` passes for affected apps
- [ ] No secrets in diff
- [ ] Migration reviewed for RLS
- [ ] Screenshots for UI changes
- [ ] ARCHITECTURE.md updated if boundaries changed

---

## Releases

Tag format: `worker-v0.3.0`, `marketing-v0.1.0`, `platform-v0.3.0` (schema + functions).

```bash
git tag -a platform-v0.3.0 -m "Supabase migrations through 20260523"
git push origin platform-v0.3.0
```

---

## Questions

Open a GitHub Discussion or contact the maintainer listed in SECURITY.md.
