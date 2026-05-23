# AI Infrastructure — GigAI Bharat

Future home for model routing, prompts, evals, and worker-owned data pipelines.

## Current (Phase 0)

| Capability | Location | Model |
|------------|----------|-------|
| Earnings screenshot OCR | `supabase/functions/parse-earning` | `google/gemini-2.5-flash` |

## Planned layout

```
infra/ai/
├── README.md           # This file
├── prompts/            # Versioned system prompts
│   └── parse-earning.md
├── schemas/            # JSON schemas for tool-calling
│   └── earnings-row.json
├── evals/              # Golden screenshots + expected outputs
└── gateways/           # Provider adapters (Lovable, OpenAI, local)
```

## Principles

1. **AI never writes directly to DB** — Edge Functions return structured data; clients insert with RLS.
2. **Auth + quota on every AI endpoint** — prevent credit abuse.
3. **Audit everything** — `log_audit` RPC on each invocation.
4. **Human-in-the-loop** — confidence < 0.85 → pending review queue (admin app).
5. **Worker-owned narrative** — exportable ledger + opt-in training data (Phase 3).

## Roadmap

| Phase | Deliverable |
|-------|-------------|
| 1 | Pending earnings review + admin UI |
| 2 | Shift coach (RAG over ledger + demand) |
| 3 | Voice onboarding (Kannada/Hindi) |
| 4 | City demand forecasting batch job |
