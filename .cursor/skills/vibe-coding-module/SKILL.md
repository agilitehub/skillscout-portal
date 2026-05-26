---
name: vibe-coding-module
description: >-
  Module folder layout, thin UI vs controllers/model/hooks, Ant Design, Tailwind, token-based
  theming, and when to add shared components under src/core. Use with the vibe-coding index
  skill when building or refactoring feature code.
---

# Vibe coding — feature modules, UI, and `src/core`

Use this when creating or extending **feature areas** (pages, data flow, styling, shared components).

## Base directories

| Area | Base directory |
|------|----------------|
| Recruiter / business / org features | `src/modules/BusinessDashboard/<FeatureName>/` |
| Candidate / assessment chat and related UI | `src/modules/CandidateAssessment/` (follow existing `components/`, `hooks/`) |
| **Semantic light/dark tokens** | `src/core/theme/tokens.css` |
| **Shared Ant / toolbar CSS** | `src/core/theme/module-shared.css` |
| **Tailwind component classes** | `src/core/theme/tailwind/tailwindPlugin.js` |

## Per-feature structure (Business Dashboard)

Under `src/modules/BusinessDashboard/<FeatureName>/` use:

| Folder | Purpose |
|--------|---------|
| **`components/`** | React pages, modals, forms, and presentational pieces for this feature. |
| **`styles/`** | **Module-scoped CSS** for Ant Design overrides that need feature-specific selectors or Ant Design 6 `!important` rules. Use **`rgb(var(--color-*))`** from `tokens.css` — avoid hardcoded hex and duplicate `html.dark` blocks when tokens auto-switch. Import from any `components/` file that needs those rules. |
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

**Do not change** for routine feature work: auth, non-component layout internals, **`infra/`** (shared adapters), global Redux **`store/`** (except new slices under `store/slices/` when needed), and unrelated config.

**Exceptions:**

1. **`src/core/config/navigation.js`** — small changes for new sidebar items (see **vibe-coding-navigation**).
2. **`src/core/components/`** — only when promoting **reused** UI (see below).
3. **`src/core/theme/`** — when adding a **new semantic token**, shared Ant pattern, or Tailwind plugin component class used across modules (see **Styling** below).

## Ant Design (AntD)

- Prefer **Ant Design** for interactive UI: `Button`, `Table`, `Form`, `Modal`, `Input`, `Select`, `Card`, `Tabs`, `Typography`, `message` / `notification`, etc.
- Use project wrappers from `core/components` when the codebase already does (e.g. `Button`).
- **Forms:** add **`className="global-form"`** on `<Form>` for token-driven input/select/switch styling (defined in `tailwindPlugin.js`).
- **Icons:** in-page iconography is often Font Awesome in existing modules; stay consistent with the file you are editing.

## Styling: tokens → Tailwind → shared CSS → module CSS

### 1. Semantic tokens (`tokens.css`)

- Single source of truth for light/dark values (`:root` / `.dark`).
- Add new semantic colours here when multiple consumers need the same role (e.g. `--color-surface`, `--color-input-bg`).
- Consumed as Tailwind utilities via `themeColors.js` (`bg-background`, `text-foreground`, `border-border-input`, …).

### 2. Tailwind `className` (preferred for layout + chrome)

- Spacing, flex/grid, typography, responsive layout.
- **Semantic colours:** `bg-surface`, `text-muted`, `border-border` — not raw `gray-*` + `dark:` pairs.
- Use **`dark:`** only for non-colour behaviour (decorative gradients, conditional visibility).

### 3. Shared CSS (`module-shared.css` + Tailwind plugin)

Loaded globally via `src/core/theme/tailwind/tailwind.css`. Use existing classes before writing new CSS:

| Need | Class / location |
|------|------------------|
| Toolbar white pill buttons | `.dashboard-button`, `.accent-toolbar-btn`, `.add-branch-btn`, … in `module-shared.css` |
| Form theming | `.global-form` on `<Form>` (`tailwindPlugin.js`) |
| Tables | `.enhanced-table`, `.dark-table`, `.dark-pagination` (`tailwindPlugin.js` + `table-view.css`) |
| Modals (generic shells) | `.token-modal`, `.view-branch-modal`, `.permissions-modal`, … in `module-shared.css` |
| Dark dropdowns | `.token-dark-dropdown`, `*-dark-dropdown` aliases in `module-shared.css` |
| Form action buttons | `.form-btn-primary`, `.form-btn-secondary`, `.form-btn-danger` |

Promote a pattern to **`module-shared.css`** or **`tailwindPlugin.js`** when **two or more modules** need the same Ant override.

### 4. Module `styles/<feature>.css` (last resort)

- Only for **feature-specific** Ant Design 6 edge cases (scoped modal tokens, tab chrome, page-only layout).
- **Must** reference tokens: `color: rgb(var(--color-foreground));`, `background-color: rgb(var(--color-surface));`.
- Avoid duplicating form dark rules — use **`global-form`** instead.
- **`src/core/components/view-components/table-view/styles/table-view.css`** — shared `TableView` layout/token overrides.

### 5. JS colours (`colors.js`)

- Use **`BRAND_COLORS`**, **`LIGHT_THEME`**, **`DARK_THEME`** only when passing colours to Ant Design `styles` props, Recharts, or other JS APIs.
- Do **not** treat `colors.js` as the CSS source of truth — that is **`tokens.css`**.

### Dark mode mechanics

- **`ThemeContext`** sets `document.documentElement.classList` to `dark`.
- Root **`tailwind.config.js`**: `darkMode: 'class'`.
- Token values in `:root` switch under **`.dark`** — most module CSS does **not** need separate `html.dark` blocks if it uses `rgb(var(--color-*))`.

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
| New semantic colour | `src/core/theme/tokens.css` + `themeColors.js` if needed as Tailwind utility |
| Shared Ant / toolbar pattern | `src/core/theme/module-shared.css` or `tailwindPlugin.js` |
| Feature-specific Ant override | `src/modules/.../styles/<feature>.css` with token vars |
| Inline / chart colours | `src/core/theme/colors.js` |
| Shared cross-feature UI | `src/core/components/` |
| New sidebar link + routes | **vibe-coding-navigation** skill |

When unsure, open a **neighboring feature** (e.g. `JobListings`, `Questionnaires`, `OrgSettings`) and mirror its layout; check whether `global-form` and `module-shared.css` classes already cover your case before adding CSS.

**App constants:** route helpers and domain enums live in **`src/constants/`** (barrel `src/constants/index.js`). AI integration stays in **`src/lib/`**; do not confuse with **`src/core/infra/`**.
