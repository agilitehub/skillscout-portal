---
name: vibe-coding-module
description: >-
  Module folder layout, thin UI vs utils/hooks, Ant Design, Tailwind, and when
  to add shared components under src/core. Use with the vibe-coding index skill
  when building or refactoring feature code.
---

# Vibe coding — feature modules, UI, and `src/core`

Use this when creating or extending **feature areas** (pages, data flow, styling, shared components).

## Base directories

| Area | Base directory |
|------|----------------|
| Recruiter / business / org features | `src/modules/BusinessDashboard/<FeatureName>/` |
| Candidate / assessment chat and related UI | `src/modules/Dashboard/` (follow existing `components/`, `hooks/`) |

## Per-feature structure (Business Dashboard)

Under `src/modules/BusinessDashboard/<FeatureName>/` use:

| Folder | Purpose |
|--------|---------|
| **`components/`** | React pages, modals, forms, and presentational pieces for this feature. |
| **`utils/`** | Data shaping, API/Supabase controllers, mappers, validation, non-UI helpers. The repo often uses `controller.js` and `data-model.js` — copy patterns from a neighboring feature. |
| **`hooks/`** | Custom hooks (`use*`) for state, effects, and glue between `utils` and the UI. Add when hook logic is large enough to keep out of `components/`. |

**Entry point:** the router imports from `.../<Feature>/components` (often `index.js` or a named page file as default export).

**Naming:** keep route segment, `buildBusinessDashboardPath` argument, and feature folder name clearly related (see **vibe-coding-navigation**).

## Thin components, logic in `utils` and `hooks`

- **Components** should stay mostly **UI**: layout, Ant Design, local UI state (modals, selection), and props/callbacks.
- **`utils`:** fetch/mutate, business rules, API ↔ view mapping, non-React helpers.
- **`hooks`:** shared state+effect inside the feature, subscription wiring, `{ data, loading, error, refetch }` patterns.
- If a file under `components/` accumulates business logic, extract to `utils` or `hooks` and re-import.

## `src/core` — default: hands off

**Do not change** for routine feature work: theme, global styles, non-component layout internals, `lib/`, `auth/`, and unrelated config.

**Exceptions:**

1. **`src/core/config/navigation.js`** — small changes for new sidebar items (see **vibe-coding-navigation**).
2. **`src/core/components/`** — only when promoting **reused** UI (see below).

## Ant Design (AntD)

- Prefer **Ant Design** for interactive UI: `Button`, `Table`, `Form`, `Modal`, `Input`, `Select`, `Card`, `Tabs`, `Typography`, `message` / `notification`, etc.
- Use project wrappers from `core/components` when the codebase already does (e.g. `Button`).
- **Icons:** in-page iconography is often Font Awesome in existing modules; stay consistent with the file you are editing, or with Ant Design icons if that file already uses them.

## Styling: Tailwind + AntD

- Use **Tailwind** `className` for spacing, color, flex/grid, typography, and responsive layout on wrappers and custom regions.
- Pass `className` / `rootClassName` to AntD components when needed. Avoid new global CSS in `core` for feature work; keep styling local via Tailwind + AntD unless the app already uses a specific pattern (e.g. sidebar gradients).

## Reusable building blocks → `src/core/components`

If a component is (or will be) **reused across multiple feature modules** or unrelated screens:

- Add or update it under **`src/core/components/`** (e.g. `parts/`, or the subdirectory the project uses), including barrel re-exports if the repo has them.
- Keep it **UI-oriented**; keep business logic in module `utils` / `hooks` or non-core helpers.

**Promotion flow:** build inside a feature `components/` first → when a second consumer appears, extract the shared piece into `core/components` and import from both.

This is the **only** case for adding or changing files under `src/core/components` (besides the navigation config exception above).

## Quick reference

| Task | Where |
|------|--------|
| Feature code | `src/modules/BusinessDashboard/<Feature>/{components,utils,hooks}/` |
| Chat / candidate area | `src/modules/Dashboard/` |
| Shared cross-feature UI | `src/core/components/` |
| New sidebar link + routes | **vibe-coding-navigation** skill |

When unsure, open a **neighboring feature** (e.g. `JobListings`, `Questionnaires`, `Lookups`, `Applications`) and mirror its `utils` / `components` / `hooks` layout and import style.
