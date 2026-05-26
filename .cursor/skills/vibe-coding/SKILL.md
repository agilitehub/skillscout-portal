---
name: vibe-coding
description: >-
  Main entry for this repo’s frontend conventions. Points to focused skills for
  navigation/routes and for feature module structure, AntD, Tailwind, token-based
  theming, and src/core rules.
---

# Vibe coding (main)

Use this skill when adding **pages**, **sidebar items**, or **feature areas** under the authenticated business shell, or when refactoring module layout.

## Sub-skills (read these for detail)

| Topic | Skill | Path |
|-------|--------|------|
| Left sidebar, `navigation.js`, `routes.js`, `buildBusinessDashboardPath` | **vibe-coding-navigation** | `.cursor/skills/vibe-coding-navigation/SKILL.md` |
| Module folders, AntD, Tailwind, **token theming**, `src/core` and shared components | **vibe-coding-module** | `.cursor/skills/vibe-coding-module/SKILL.md` |

**When working on nav or route wiring:** read **vibe-coding-navigation** (and use **vibe-coding-module** for where the new page lives).

**When working on feature code, styling, or shared UI:** read **vibe-coding-module** (and use **vibe-coding-navigation** if the feature needs a new sidebar link).

## One-minute overview

- **New business sidebar item:** config in `src/core/config/navigation.js` + routes in `src/routes.js` + feature under `src/modules/BusinessDashboard/<Feature>/` — full steps in **vibe-coding-navigation**.
- **Feature structure:** `components/`, `styles/` (token-based Ant overrides when needed), `controllers/`, `model/`, `hooks/`; feature root `index.js` barrels for routes — full rules in **vibe-coding-module**.
- **UI stack:** Ant Design for components; Tailwind semantic utilities (`bg-surface`, `text-foreground`) from **`src/core/theme/tokens.css`**.
- **Theming:** `ThemeContext` toggles `dark` on `<html>`; colours defined once in `tokens.css`; shared Ant patterns in `module-shared.css` + `tailwindPlugin.js`; forms use **`global-form`**.
- **`src/core`:** avoid changes except navigation, shared components, theme tokens/shared CSS, and **`core/infra`** / **`core/store`** — see **vibe-coding-module**.

## Quick map

| Task | Go to |
|------|--------|
| Add or change a left menu item or URL | **vibe-coding-navigation** |
| New screen, data loading, modals, hooks, or styling | **vibe-coding-module** |
| New semantic colour or shared Ant pattern | **vibe-coding-module** → `tokens.css` / `module-shared.css` |
| Both (new page + new nav link) | Read **both**, then implement navigation first, then the module. |
