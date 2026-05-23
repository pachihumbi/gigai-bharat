# @gigai/ui

Shared UI primitives for GigAI Bharat apps.

## Migration path

1. **Now:** `cn()` utility only — apps keep local shadcn copies.
2. **Next:** Move `Button`, `Card`, `Badge` from `apps/worker`.
3. **Later:** Single shadcn source; apps import `@gigai/ui/button`.

Do not duplicate shadcn in `apps/admin` long-term — import from here.
