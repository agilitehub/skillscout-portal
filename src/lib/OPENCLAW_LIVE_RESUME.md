# Live Resume — OpenClaw + Supabase Integration

Candidate chat and CV upload persist resume data to Supabase (`live_resumes`, `resumes`, `user_data_sources`, `users`).

---

## Architecture

```mermaid
flowchart TD
  UserMsg[User message] --> App[React app]
  App --> Gateway[OpenClaw Gateway agent]
  Gateway --> MCP[Supabase MCP tools]
  MCP --> DB[(live_resumes + users)]
  Gateway --> ChatBubble[Assistant reply]
  ChatBubble --> Refresh[App refreshLiveResume]
  Refresh --> DB
```

| Flow | Who writes | What the app does |
|------|------------|-------------------|
| **Chat updates** | OpenClaw via Supabase MCP | Send message → show reply → **refresh** live resume from DB |
| **CV upload** | React app (`ingestResumeFile`) | Extract, write, merge — unchanged |

The React app does **not** extract or upsert live resume data after chat replies. OpenClaw + MCP is the sole writer for chat-driven changes.

---

## OpenClaw gateway — Supabase MCP

Add Supabase MCP to `~/.openclaw/openclaw.json` (example shape — adjust to your OpenClaw version):

```json5
{
  mcp: {
    servers: {
      supabase: {
        command: 'npx',
        args: ['-y', '@supabase/mcp-server-supabase', '--access-token', 'YOUR_SUPABASE_ACCESS_TOKEN'],
        env: {
          SUPABASE_PROJECT_REF: 'your-project-ref'
        }
      }
    }
  }
}
```

The React app passes the authenticated user's UUID via the chat `user` parameter:

```
skillscout-candidate-chat:{userId}
```

The system prompt also includes the user id for MCP scoping (never shown to the candidate).

---

## Gateway agent instructions (copy-paste)

Add these rules to your OpenClaw gateway agent / skill configuration:

### User-facing replies

- Confirm resume changes in **plain, conversational language** only.
- **Never** mention table names, column names, JSON keys, MCP, Supabase, or `` `field: value` `` syntax.
- **Never** narrate tool calls or describe what was written to storage.
- Good: *"Done — I've updated your Agilit-e role to 2018–present."*
- Bad: *"Updated end_date to Current and is_current to true in resume records."*

### MCP write behavior (surgical updates)

When the candidate asks to change part of their resume:

1. **Read** the current `live_resumes` row and `users` row for the session user id.
2. Apply **surgical changes only** — e.g. match an experience entry by `company` or `title`, update only the requested fields (`end_date`, `is_current`, etc.).
3. **Write back the full merged JSON** — do not replace `live_resumes.content` with a partial object that drops other jobs, skills, or education.
4. If the user says *"don't change anything else"*, change only the matched item/fields.
5. Do not replace entire sections unless the user explicitly asks for a full rewrite.

---

## Environment variables

See [`OPENCLAW_CV_README.md`](./OPENCLAW_CV_README.md).

| Variable | Purpose |
|----------|---------|
| `REACT_APP_OPENCLAW_BASE_URL` | Gateway URL (`/openclaw/v1` in dev) |
| `REACT_APP_OPENCLAW_GATEWAY_TOKEN` | Bearer token |
| `REACT_APP_MOCK_AI` | `true` — mock chat responses; **chat does not persist** to live resume (no MCP) |

---

## Tables

| Table | Purpose |
|-------|---------|
| `users` | Contact fields: name, email, phone, location, title, summary |
| `user_data_sources` | Registry: `resume_upload`, `chat`, `manual` |
| `resumes` | Parsed CV rows with `content` JSONB |
| `live_resumes` | Canonical merged profile (one row per user) |

RLS: authenticated users can only access their own rows (`user_id = auth.uid()`).

---

## Mock mode behaviour

When `REACT_APP_MOCK_AI=true` or OpenClaw is not configured:

- CV upload still works via the React app (sample "Alex Sample" data in mock mode).
- Chat returns canned responses — **no live resume updates** (MCP is not invoked).
- The app still calls `refreshLiveResume()` after chat; the panel will not change until a real MCP-backed gateway is used or a CV is uploaded.

---

## Smoke test

1. Log in as a candidate and open `/dashboard`.
2. Upload a PDF/DOCX resume — confirm the live resume panel populates.
3. Chat: *"Update my Agilit-e experience to 2018–present, don't change anything else."*
4. Confirm OpenClaw MCP updates only that entry; other jobs/skills unchanged after refresh.
5. Confirm the chat reply uses plain language with no `end_date`, `is_current`, or table names.
