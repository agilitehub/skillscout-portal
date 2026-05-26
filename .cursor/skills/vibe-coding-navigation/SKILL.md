---
name: vibe-coding-navigation
description: >-
  How to add business dashboard sidebar items, route wiring, and path helpers
  in this app. Use with the vibe-coding index skill when working on nav or
  routes.
---

# Vibe coding — navigation and routes

Use this when adding or changing the **left sidebar** or **business dashboard routes**.

## Data source: what appears in the menu

**File:** `src/core/config/navigation.js`

- **Main (always-visible) items:** `BUSINESS_SIDEBAR_MAIN_ITEMS` — add an object with:
  - `path` (see Paths below)
  - `icon` — Font Awesome solid icon from `@fortawesome/free-solid-svg-icons`
  - `label` — string shown in the sidebar
  - `exact` — `true` for the dashboard index only; usually `false` for nested sections
- **Collapsible "Settings" group:** `BUSINESS_SIDEBAR_SETTINGS_CATEGORY.items` — same object shape for items under Settings.

## Paths: `buildBusinessDashboardPath`

**File:** `src/constants/paths.js` (or import `buildBusinessDashboardPath` from the `src/constants` barrel)

Use `buildBusinessDashboardPath('your-segment')` so paths stay consistent (e.g. `buildBusinessDashboardPath('job-listings')` → `/business-dashboard/job-listings`). Import the helper at the top of `navigation.js` from `../../constants` like the existing entries.

The URL **segment** must match the route you register in `src/routes.js` (nested under `/business-dashboard`).

## Where the sidebar is rendered

**File:** `src/core/components/layout/BusinessSidebar.js`

This component reads `BUSINESS_SIDEBAR_MAIN_ITEMS` and `BUSINESS_SIDEBAR_SETTINGS_CATEGORY` and renders `NavLink` rows. You usually **do not** need to change it for a new standard link. Change it only for new layout or behavior, and only when necessary.

## Routes: register the page

**File:** `src/routes.js`

- Add a **child** of `path='/business-dashboard'`.
- **Import** the feature from `src/modules/BusinessDashboard/<Feature>` (default + named exports from the feature `index.js` barrel).
- Use `<Route path='your-segment' element={...} />` or nested `<Route>` blocks matching existing features (e.g. index + `create` + `:id/edit`).

**Parity rule:** the segment in the router, the argument to `buildBusinessDashboardPath`, and the feature folder name should align (e.g. `job-listings` ↔ `JobListings`).

## Checklist: new left menu item

1. Entry in `src/core/config/navigation.js` (main list or settings category).
2. Route(s) in `src/routes.js` under `/business-dashboard`.
3. Feature module under `src/modules/BusinessDashboard/<Feature>/` (see the **vibe-coding-module** skill).

## `src/core` policy for navigation

**Minimal edits to `src/core/config/navigation.js`** are the designated way to add or adjust business sidebar items. Do not use that as an excuse to rewrite `BusinessSidebar.js` or other core layers unless the product requires it.

For everything else in `src/core` (theme tokens, `module-shared.css`, `infra`, auth, layout internals), see the **vibe-coding-module** skill: default is hands off, with exceptions for shared components and theme/CSS promotion.

## Quick reference

| What | Where |
|------|--------|
| Menu labels and links | `src/core/config/navigation.js` |
| Path builder | `buildBusinessDashboardPath` in `src/constants/paths.js` (or `src/constants/index.js`) |
| Sidebar UI | `src/core/components/layout/BusinessSidebar.js` |
| App routes | `src/routes.js` |
