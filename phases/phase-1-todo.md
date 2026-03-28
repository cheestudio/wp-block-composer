# Phase 1 — Project Scaffold

> **Status:** `pending`
> **Goal:** A running Nuxt 3 app with all dependencies, core configuration, shared registry, app shell with step navigation, and Docker support.
> **Acceptance:** `nuxt dev` starts, NuxtUI renders, 20+ registry entries, `<UStepper>` visible, Docker builds, `pnpm typecheck` passes.

---

## 1. Project Initialization

- [X] **1.1** Initialize Nuxt 3 project with TypeScript (`npx nuxi init`)
- [X] **1.2** Verify project runs with `nuxt dev`
- [X] **1.3** Configure `tsconfig.json` with strict mode

## 2. Dependency Installation

- [X] **2.1** Install core framework dependencies:
  - `@nuxt/ui` (includes Tailwind CSS v4)
  - `@pinia/nuxt`
- [X] **2.2** Install LLM and server dependencies:
  - `@anthropic-ai/sdk`
  - `archiver` + `@types/archiver`
  - `fs-extra` + `@types/fs-extra`
- [X] **2.3** Install UI dependencies:
  - `vue-draggable-plus`
  - `codemirror`
  - `@codemirror/lang-javascript`
  - `@codemirror/lang-json`
  - `@codemirror/lang-php`
  - `@codemirror/lang-sass`
  - `@codemirror/theme-one-dark`
- [X] **2.4** Install validation and utility dependencies:
  - `zod`
  - `uuid` + `@types/uuid`
- [X] **2.5** Install dev dependencies:
  - `vitest`
  - `@vitest/coverage-v8`
  - `@nuxt/test-utils`
  - `@nuxt/eslint`
  - `@types/node`
- [X] **2.6** Verify all dependencies resolve and `nuxt dev` still starts cleanly

## 3. Nuxt Configuration

- [X] **3.1** Configure `nuxt.config.ts`:
  - Add full `runtimeConfig`:
    - `anthropicApiKey` (server-only, maps from `NUXT_ANTHROPIC_API_KEY`)
    - `claudeModel` (default: `claude-sonnet-4-20250514`)
    - `claudeMaxTokens` (default: `8000`)
    - `bundleDir` (default: `./.bundles`)
    - `bundleTtlMs` (default: `3600000`)
    - `public: {}` (empty — no client-side runtime config)
- [X] **3.2** Create `.env.example` with all env vars documented
- [X] **3.3** Verify `runtimeConfig` values accessible in a test server route

## 4. App Shell & Layout

- [X] **5.1** Create `app.vue` — `<NuxtLayout>` + `<NuxtPage>`
- [X] **5.2** Create `layouts/default.vue`:
  - `<UStepper>` with 4 steps: Build, Configure, Generate, Output
  - Stepper driven by current route (highlight active step)
  - `<UNotifications>` mounted once for app-wide toasts
  - `<NuxtPage>` for page content
  - Clean, centered layout wrapper
- [X] **5.3** Verify `<UStepper>` renders and highlights based on current route

## 5. Page Stubs

- [X] **6.1** Create `pages/index.vue` — redirect to `/build`
- [X] **6.2** Create `pages/build.vue` — Step 1 placeholder with title and description
- [X] **6.3** Create `pages/configure.vue` — Step 2 placeholder with title and description
- [X] **6.4** Create `pages/generate.vue` — Step 3 placeholder with title and description
- [X] **6.5** Create `pages/output.vue` — Step 4 placeholder with title and description
- [X] **6.6** Verify navigation between all 4 pages works; stepper updates accordingly

## 6. WordPress Component Registry

- [X] **7.1** Create `shared/wpComponentRegistry.ts` with TypeScript interfaces:
  - `RegistryEntry` — `name`, `label`, `category`, `color`, `canHaveChildren`, `innerBlocksRequired`, `saveJsTemplate`, `options[]`
  - `RegistryOption` — `key`, `label`, `type` (`select`/`boolean`/`text`/`number`/`color`), `choices?`, `default?`
  - Category type: `'text' | 'media' | 'layout' | 'interactive' | 'embed'`
- [X] **7.2** Populate minimum 20 registry entries with all required flags:
  - **Text:** `core/paragraph`, `core/heading`, `core/list`, `core/list-item`, `core/quote`, `core/html`
  - **Media:** `core/image`, `core/video`, `core/audio`, `core/file`, `core/gallery`
  - **Layout:** `core/group`, `core/columns`, `core/column`, `core/cover`, `core/media-text`, `core/buttons`, `core/button`, `core/separator`, `core/spacer`
  - **Interactive:** `core/search`, `core/navigation`
  - **Embed:** `core/embed`, `core/shortcode`
- [X] **7.3** For each entry, configure:
  - `canHaveChildren` — `true` for containers (group, columns, column, cover, media-text, buttons, list, navigation, gallery)
  - `innerBlocksRequired` — `true` for components that require InnerBlocks in save.js
  - `saveJsTemplate` — JSX snippet for flat save.js generation
  - `options[]` — component-specific configuration options with correct types and choices
- [X] **7.4** Export typed registry array and lookup helper functions
- [X] **7.5** Verify registry is importable from both `pages/` (client) and `server/` (server) via `shared/` directory

---

## Notes

_This to-do list will be updated as work progresses. Items may be added, modified, or reordered based on discoveries during implementation._
