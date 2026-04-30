---
name: vibe-coding-module
description: >-
  Module folder layout, thin UI vs controllers/model/hooks, Ant Design, Tailwind, and when
  to add shared components under src/core. Use with the vibe-coding index skill
  when building or refactoring feature code.
---

# Vibe coding — feature modules, UI, and `src/core`

Use this when creating or extending **feature areas** (pages, data flow, styling, shared components).

## Base directories

| Area | Base directory |
|------|----------------|
| Recruiter / business / org features | `src/modules/BusinessDashboard/<FeatureName>/` |
| Candidate / assessment chat and related UI | `src/modules/CandidateAssessment/` (follow existing `components/`, `hooks/`) |

## Per-feature structure (Business Dashboard)

Under `src/modules/BusinessDashboard/<FeatureName>/` use:

| Folder | Purpose |
|--------|---------|
| **`components/`** | React pages, modals, forms, and presentational pieces for this feature. |
| **`styles/`** | **Module-scoped global CSS** for Ant Design overrides, modal shells, and feature-specific selectors. One primary file per feature is typical (e.g. `styles/org-settings.css`). Import the stylesheet from any `components/` file that needs those rules. Do **not** use `<style jsx global>` in JSX; keep theme splits on `html.dark` / defaults (see `ThemeContext`). |
| **`controllers/`** | Remote/data access: Supabase and API calls, error mapping. Primary surface is `controllers/index.js`; split files when needed (e.g. `controllers/questions.js`). Imports: `from '../controllers'` or `from '../controllers/questions'`. |
| **`model/`** | Pure logic: transforms, validators, defaults (`model/index.js`). |
| **`hooks/`** | Custom hooks (`use*`) for state, effects, and glue between controllers/model and the UI. Add when hook logic is large enough to keep out of `components/`. |

**Entry point:** add or extend **`index.js`** at the feature root to re-export route-facing components; **`src/routes.js`** imports from `.../<Feature>` (default + named exports) instead of deep `components/` paths.

**Infra:** shared Supabase client helpers and search utilities live in **`src/core/infra/`** (not `core/lib`). Domain CRUD stays in feature **`controllers/`**.

**Naming:** keep route segment, `buildBusinessDashboardPath` argument, and feature folder name clearly related (see **vibe-coding-navigation**).

## Thin components, logic in `controllers`, `model`, and `hooks`

- **Components** should stay mostly **UI**: layout, Ant Design, local UI state (modals, selection), and props/callbacks.
- **`controllers/`:** fetch/mutate against Supabase/API; map errors for the UI.
- **`model/`:** validation, transforms, enums/helpers with no I/O.
- **`hooks`:** shared state+effect inside the feature, subscription wiring, `{ data, loading, error, refetch }` patterns.
- If a file under `components/` accumulates business logic, extract to `controllers`, `model`, or `hooks` and re-import.

## `src/core` — default: hands off

**Do not change** for routine feature work: theme, global styles, non-component layout internals, **`infra/`** (shared adapters), `auth/`, global Redux **`store/`** (except new slices under `store/slices/` when needed), and unrelated config.

**Exceptions:**

1. **`src/core/config/navigation.js`** — small changes for new sidebar items (see **vibe-coding-navigation**).
2. **`src/core/components/`** — only when promoting **reused** UI (see below).

## Ant Design (AntD)

- Prefer **Ant Design** for interactive UI: `Button`, `Table`, `Form`, `Modal`, `Input`, `Select`, `Card`, `Tabs`, `Typography`, `message` / `notification`, etc.
- Use project wrappers from `core/components` when the codebase already does (e.g. `Button`).
- **Icons:** in-page iconography is often Font Awesome in existing modules; stay consistent with the file you are editing, or with Ant Design icons if that file already uses them.

## Styling: Tailwind + AntD + module `styles/`

- Use **Tailwind** `className` for spacing, color, flex/grid, typography, and responsive layout on wrappers and custom regions.
- Pass `className` / `rootClassName` to AntD components when needed.
- **Ant Design overrides** (`.ant-*` classes, modal shells, dropdown panels) belong in **`styles/<feature>.css`** under the same feature folder, not inline in components. Use **`html.dark`** for dark-theme rules (the app sets `document.documentElement.classList` to `dark` via `ThemeContext`).
- **`src/modules/BusinessDashboard/styles/dashboard-toolbar-buttons.css`** holds the shared white toolbar action button pattern used across several list pages; import it where `dashboard-button` styling is needed.
- **`src/core/components/view-components/table-view/styles/table-view.css`** styles the shared `TableView` (`.enhanced-table`, `.dark-table`, etc.).
- Avoid adding new global CSS under `src/core` for routine feature work unless promoting a shared widget (see below).

## Reusable building blocks → `src/core/components`

If a component is (or will be) **reused across multiple feature modules** or unrelated screens:

- Add or update it under **`src/core/components/`** (e.g. `parts/`, or the subdirectory the project uses), including barrel re-exports if the repo has them.
- Keep it **UI-oriented**; keep business logic in module `controllers` / `model` / `hooks` or non-core helpers.

**Promotion flow:** build inside a feature `components/` first → when a second consumer appears, extract the shared piece into `core/components` and import from both.

This is the **only** case for adding or changing files under `src/core/components` (besides the navigation config exception above).

## Quick reference

| Task | Where |
|------|--------|
| Feature code | `src/modules/BusinessDashboard/<Feature>/{components,controllers,model,hooks}/` |
| Chat / candidate area | `src/modules/CandidateAssessment/` |
| Shared cross-feature UI | `src/core/components/` |
| New sidebar link + routes | **vibe-coding-navigation** skill |

When unsure, open a **neighboring feature** (e.g. `JobListings`, `Questionnaires`, `Lookups`) and mirror its `controllers` / `model` / `components` / `hooks` layout and import style.

**App constants:** route helpers and domain enums live in **`src/constants/`** (barrel `src/constants/index.js`). AI integration stays in **`src/lib/`**; do not confuse with **`src/core/infra/`**.
