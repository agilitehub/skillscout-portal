# Business Dashboard — Job listing → candidate matching (OpenClaw Scout)

Automated matching finds **potential candidates** for each org’s **active Job Listings** (`job_opportunities` + linked `job_descriptions`), scores them with **vector recall** + **OpenClaw** (`skillscout-scout`), and stores results in `potential_candidate_matches` for the Business Dashboard **Potential Candidates** section.

Personal Dashboard candidate chat remains **Hermes + Honcho** — see [`HERMES_CANDIDATE_CHAT.md`](./HERMES_CANDIDATE_CHAT.md).

---

## Pipeline

1. **Index** `live_resumes` into `search_index` (`source_table = 'live_resumes'`).
2. For each **active** listing (org from `created_by` → `users.org_id`):
   - Build requirements text from `job_descriptions`.
   - **Vector recall** top K candidates via `match_live_resumes_for_embedding`.
   - **OpenClaw** (`user: skillscout-scout`) returns JSON `confidence_score` + `rationale`.
   - **Upsert** `potential_candidate_matches` (org-scoped RLS for reads).

---

## Node worker

From repo root (loads `.env` if present):

```bash
# Full match run (needs service role + OpenAI + OpenClaw)
npm run matcher:run

# Index all live_resumes only
npm run matcher:backfill

# Vector-only scoring (no OpenClaw calls)
node scripts/candidate-matcher/index.mjs --skip-openclaw
```

### Server env (never put the service role in `REACT_APP_*`)

The matcher reads `.env` / `.env.local` at the repo root. Copy [.env.example](../.env.example) and set:

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` or `REACT_APP_SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **Required.** Worker writes + RPC. From Supabase → **Project Settings → API → service_role** (not the anon key) |
| `SUPABASE_SERVICE_KEY` | Optional alias for the same service role secret |
| `OPENAI_API_KEY` or `REACT_APP_OPENAI_API_KEY` | **Required** for embeddings (`text-embedding-3-small` via api.openai.com) |
| `OPENCLAW_GATEWAY_TOKEN` | Gateway auth for **scoring** only (not embeddings) |
| `OPENCLAW_BASE_URL` | e.g. `http://127.0.0.1:18789/v1` |
| `OPENCLAW_MODEL` | Agent target, e.g. `openclaw/default` |
| `OPENCLAW_MATCHER_USER` | Default `skillscout-scout` |
| `MATCHER_TOP_K` | Default `15` |
| `MATCHER_VECTOR_THRESHOLD` | Default `0.65` |
| `MATCHER_CONFIDENCE_THRESHOLD` | Default `70` |
| `MATCHER_MAX_LISTINGS_PER_RUN` | Default `50` |

---

## OpenClaw cron (every 5 minutes)

1. Gateway running with chat completions enabled ([`OPENCLAW_CV_README.md`](./OPENCLAW_CV_README.md)).
2. `cron.enabled: true` in `~/.openclaw/openclaw.json`.
3. Tool/exec policy allows running `node` (or run worker via system cron instead).

```bash
openclaw cron add \
  --name "skillscout-candidate-matcher" \
  --every 5m \
  --session session:skillscout-scout \
  --message "Run the SkillScout candidate matcher: cd /path/to/skillscout-portal && npm run matcher:run"
```

Manual trigger:

```bash
openclaw cron run <jobId>
```

Change interval: `openclaw cron edit <jobId>` or recreate with `--every 10m` / cron expression.

---

## Troubleshooting embeddings

The worker calls **OpenAI directly** (`POST https://api.openai.com/v1/embeddings`). You need a valid **`OPENAI_API_KEY`** with billing/quota for `text-embedding-3-small`.

- **401** — wrong or missing API key.
- **429 insufficient_quota** — add billing at [OpenAI billing](https://platform.openai.com/account/billing).

OpenClaw is only used for **match scoring** (`npm run matcher:run`); use `--skip-openclaw` to test vector recall without the gateway.

---

## Database

Apply migration: `supabase/migrations/20260527130000_potential_candidate_matches.sql` (includes `vector` extension + `search_index` if missing).

On hosted SkillScout, these MCP migrations were applied: `enable_vector_extension`, `create_search_index_table`, `create_match_search_index_rpc`, `potential_candidate_matches`.

- Table: `potential_candidate_matches`
- RPC: `match_live_resumes_for_embedding`
- RLS: org members `SELECT` only; worker uses **service role**

---

## Portal

Business Dashboard home → **Potential Candidates** (reads `potential_candidate_matches` via anon client + RLS). Clicking a match opens recruiter CV chat — see [`OPENCLAW_BUSINESS_CANDIDATE_CHAT.md`](./OPENCLAW_BUSINESS_CANDIDATE_CHAT.md).
