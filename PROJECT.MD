# WP Block Composer — Project Build Plan

> **Project Outline** @wp-block-composer-outline.md
> **Status:** Phase 1 — Project Scaffold
> **Started:** 2026-03-27
> **Stack:** Nuxt 3 / NuxtUI v3 / Pinia / Anthropic Claude / Vitest

---

## Overview

WP Block Composer is an open-source web application that guides WordPress developers through composing a Gutenberg block component tree, configuring all `block.json` settings, and generating production-ready block scaffolding via a hybrid template engine + LLM pipeline.

**Hybrid generation model:**
- **Template engine** (deterministic, instant, free): `block.json`, `index.js`, `render.php`, `style.scss`, `editor.scss`, flat `save.js`
- **Claude LLM** (streamed, API cost): `edit.js`, nested `save.js`, `view.js`

---

## Phase Index

| Phase | Name | Status | To-Do File |
|-------|------|--------|------------|
| 1 | [Project Scaffold](#phase-1--project-scaffold) | `pending` | [phases/phase-1-todo.md](phases/phase-1-todo.md) |
| 2 | [Component Builder](#phase-2--component-builder) | `pending` | [phases/phase-2-todo.md](phases/phase-2-todo.md) |
| 3 | [Block Configuration](#phase-3--block-configuration) | `pending` | [phases/phase-3-todo.md](phases/phase-3-todo.md) |
| 4 | [PRD Builder & Generate Screen](#phase-4--prd-builder--generate-screen) | `pending` | [phases/phase-4-todo.md](phases/phase-4-todo.md) |
| 5 | [Template Engine](#phase-5--template-engine) | `pending` | [phases/phase-5-todo.md](phases/phase-5-todo.md) |
| 6 | [LLM Integration & Generation Orchestration](#phase-6--llm-integration--generation-orchestration) | `pending` | [phases/phase-6-todo.md](phases/phase-6-todo.md) |
| 7 | [Code Output UI](#phase-7--code-output-ui) | `pending` | [phases/phase-7-todo.md](phases/phase-7-todo.md) |
| 8 | [Polish & Open Source Release](#phase-8--polish--open-source-release) | `pending` | [phases/phase-8-todo.md](phases/phase-8-todo.md) |

> Each phase's to-do list is created when that phase begins. Completed phase to-do lists are kept for reference.

---

## Phase 1 — Project Scaffold

**Goal:** A running Nuxt 3 app with all dependencies installed, core configuration in place, the shared WP component registry fully typed and populated, and the app shell rendering with step navigation.

**Key deliverables:**
- Nuxt 3 project initialized with TypeScript
- All production and dev dependencies installed
- `nuxt.config.ts` with modules (`@nuxt/ui`, `@pinia/nuxt`) and `runtimeConfig` (Anthropic key server-only)
- `assets/css/app.css` with Tailwind directives and base design tokens
- `layouts/default.vue` with `<UStepper>` (4 steps driven by route), `<UNotifications>`, and `<NuxtPage>`
- `app.vue` root component
- `shared/wpComponentRegistry.ts` — full TypeScript interfaces (`RegistryEntry`, `RegistryOption`) + 20+ component entries with all flags (`canHaveChildren`, `innerBlocksRequired`, `saveJsTemplate`, `options[]`)
- 4 page stubs (`pages/index.vue`, `build.vue`, `configure.vue`, `generate.vue`, `output.vue`)
- `.env.example` with all env vars documented

**Acceptance criteria:**
- [X] `nuxt dev` starts without errors
- [X] NuxtUI components render (visible `<UButton>` on a page)
- [X] `shared/wpComponentRegistry.ts` exports 20+ typed entries
- [X] `<UStepper>` visible in default layout, reflects current route
- [X] Navigating between `/build`, `/configure`, `/generate`, `/output` works
- [X] TypeScript: `pnpm typecheck` passes

**Dependencies:** None (first phase)

---

## Phase 2 — Component Builder

**Goal:** A fully functional component tree builder on `/build` — users can search the WP registry, add components with configured options, reorder via drag-and-drop, nest via indent/outdent, and edit/duplicate/delete any component.

**Key deliverables:**
- `stores/componentStore.ts` — full Pinia store with CRUD actions + computed (`asTree()`, `isFlat()`, `hasContainerWithoutChildren()`)
- `composables/useComponentRegistry.ts` — search/filter/lookup against the registry
- `components/ComponentPickerModal.vue` — `<UModal>` + `<UCommandPalette>` search + dynamic options form + notes field
- `components/ComponentOrderList.vue` — `<VueDraggable>` list with `<UCard>` rows, indent/outdent, edit/duplicate/delete actions
- `components/ComponentBuilder.vue` — root component assembling picker + list + "Add Component" CTA
- `pages/build.vue` — composes `ComponentBuilder`
- `middleware/requireComponents.ts` — route guard blocking `/configure` when store is empty

**Acceptance criteria:**
- [ ] Can add 5+ components including nested containers
- [ ] Drag-to-reorder correctly updates component order
- [ ] Indent/outdent correctly sets/clears `parentId`; indent disabled when row above is a leaf
- [ ] `asTree()` output correctly mirrors visual nesting
- [ ] Empty-container `<UAlert>` appears/disappears correctly
- [ ] Edit re-opens modal pre-populated with current values
- [ ] Duplicate creates an independent copy
- [ ] Route guard redirects to `/build` from `/configure` when store is empty
- [ ] TypeScript: `pnpm typecheck` passes

**Dependencies:** Phase 1

---

## Phase 3 — Block Configuration

**Goal:** A complete, validated UI for all block type, metadata, and `block.json` options, with a real-time live JSON preview panel.

**Key deliverables:**
- `stores/blockConfigStore.ts` — full Pinia store with all `block.json` fields
- `components/BlockTypeToggle.vue` — Static/Dynamic `<UButtonGroup>`
- `components/BlockMetaForm.vue` — `<UForm>` + Zod validation for name, title, description, category, icon, keywords, textdomain
- `components/BlockJsonConfigurator.vue` — `<UAccordion>` with 7 panels:
  1. Attributes (draggable rows, inline editing, duplicate-name validation)
  2. Supports (checkbox grid with grouped sub-options)
  3. Styles (draggable rows: machine name + human label)
  4. Variations (title, icon, isDefault, attributes JSON)
  5. Script/Style Handles (4 inputs with "use default" checkboxes)
  6. API Version (select 1/2/3)
  7. Example (JSON textarea with blur validation)
- `components/JsonLivePreview.vue` — sticky `<UCard>` with computed `block.json`, validation indicator, copy button
- `pages/configure.vue` — composes all configuration components
- `middleware/requireConfig.ts` — route guard blocking `/generate` if name/title missing

**Acceptance criteria:**
- [ ] All fields update `blockConfigStore` correctly
- [ ] Live JSON preview reflects all changes in real time
- [ ] Schema validation indicator shows valid/invalid state
- [ ] Zod errors surface on required fields
- [ ] Namespace/slug format validated with inline error (`/^[a-z0-9-]+\/[a-z0-9-]+$/`)
- [ ] Supports sub-options enable/disable based on parent flag
- [ ] Route guard redirects correctly
- [ ] TypeScript: `pnpm typecheck` passes

**Dependencies:** Phase 2 (needs `componentStore` populated for context)

---

## Phase 4 — PRD Builder & Generate Screen

**Goal:** An accurate PRD assembled from all store state, a file selection UI with template/AI badges, and a generate trigger that initiates SSE.

**Key deliverables:**
- `server/services/prdBuilder.ts` — assembles full PRD markdown from `componentStore.asTree()` + `blockConfigStore`
- `components/PRDPreview.vue` — `<UAccordion>` with one panel per PRD section + "Edit" deep-links back to relevant steps
- `components/GenerationFilePicker.vue` — `<UCheckbox>` list with `[T]`/`[AI]` badges, tooltips, conditional `render.php` visibility
- `stores/outputStore.ts` — status tracking, file storage, stream buffer, bundle ID
- `composables/useSSE.ts` — EventSource wrapper that populates `outputStore` from SSE events
- `pages/generate.vue` — composes PRD preview + file picker + validation gate + generate button
- `middleware/requireGenerate.ts` — route guard for `/output`

**Acceptance criteria:**
- [ ] PRD accurately reflects all `componentStore` and `blockConfigStore` state
- [ ] Component tree section renders correct indentation hierarchy
- [ ] File checklist shows correct `[T]`/`[AI]` badges; `render.php` hidden for static blocks
- [ ] Generate button disabled until name + title + at least one component + at least one file selected
- [ ] Clicking Generate initiates SSE connection and transitions `outputStore.status`
- [ ] TypeScript: `pnpm typecheck` passes

**Dependencies:** Phase 3

---

## Phase 5 — Template Engine

**Goal:** All deterministic file generators implemented as pure functions and fully unit-tested with Vitest.

**Key deliverables:**
- Shared TypeScript interfaces: `GenerationPayload`, `Component`, `BlockConfig`
- `server/services/templateEngine/blockJson.ts` — WP Block API v3-compliant JSON serialization
- `server/services/templateEngine/indexJs.ts` — static template with namespace substitution
- `server/services/templateEngine/renderPhp.ts` — attribute iteration with correct escaping per type
- `server/services/templateEngine/styleScss.ts` — BEM scaffold from component tree
- `server/services/templateEngine/editorScss.ts` — minimal editor-override scaffold
- `server/services/templateEngine/saveJs.ts` — flat detection + JSX template generation or LLM deferral
- `server/services/templateEngine/index.ts` — orchestrator returning `{ files, deferredToLLM }`
- Vitest tests for every generator:
  - `tests/templateEngine/blockJson.test.ts`
  - `tests/templateEngine/indexJs.test.ts`
  - `tests/templateEngine/renderPhp.test.ts`
  - `tests/templateEngine/styleScss.test.ts`
  - `tests/templateEngine/saveJs.test.ts`

**Acceptance criteria:**
- [ ] All Vitest unit tests pass (`pnpm test`)
- [ ] `blockJson.ts` output is valid WP Block API v3 JSON
- [ ] `renderPhp.ts` applies correct escaping: `esc_html()` for strings, `esc_url()` for URLs, `wp_kses_post()` for HTML, `(bool)` cast for booleans, `intval()`/`floatval()` for numbers, `wp_json_encode()` for arrays/objects
- [ ] `saveJs.ts` flat detection: all top-level = flat (template), any nested = deferred, any `innerBlocksRequired` = deferred
- [ ] Orchestrator returns correct `{ files, deferredToLLM }` for both static and dynamic payloads
- [ ] TypeScript: `pnpm typecheck` passes

**Dependencies:** Phase 3 (needs `BlockConfig` types finalized). Can be worked in parallel with Phase 4.

---

## Phase 6 — LLM Integration & Generation Orchestration

**Goal:** End-to-end generation pipeline — template files arrive instantly via SSE, Claude streams `edit.js` (and other deferred files), `outputStore` is populated correctly throughout, and a downloadable ZIP is produced.

**Key deliverables:**
- `server/services/claudeClient.ts` — Anthropic SDK streaming wrapper
- `server/services/promptTemplates.ts` — system prompt + per-file instructions for `edit.js`, `save.js`, `view.js`
- `server/services/codeParser.ts` — `<file name="...">` tag extraction with graceful recovery
- `server/api/generate.post.ts` — full H3 SSE handler: validate body, run template engine, send `template-file` events, call Claude for deferred files, send `llm-token`/`llm-file` events, build ZIP, send `done` event
- `server/services/zipBuilder.ts` — builds ZIP with correct WP directory structure
- `server/api/download/[bundleId].get.ts` — streams ZIP to client
- Wire `useSSE.ts` composable to all event types

**Acceptance criteria:**
- [ ] `template-file` events arrive and populate `outputStore.templateFiles` before Claude call begins
- [ ] Claude streams `edit.js`; tokens appear in `outputStore.streamBuffer`
- [ ] `llm-file` event fires when Claude response is complete and parsed
- [ ] `outputStore.generatedFiles` correctly merges template + LLM files
- [ ] `done` event delivers `bundleId`; ZIP downloads with correct directory structure
- [ ] Non-fatal LLM error (timeout, rate limit) sets `outputStore.llmError` without blocking template file access
- [ ] `runtimeConfig.anthropicApiKey` is server-only; never in client network requests
- [ ] TypeScript: `pnpm typecheck` passes

**Dependencies:** Phase 4 + Phase 5

---

## Phase 7 — Code Output UI

**Goal:** Polished output interface with tabbed code display, streaming LLM indication, CodeMirror syntax highlighting, copy/download per file, and ZIP export.

**Key deliverables:**
- `composables/useCodeMirror.ts` — CodeMirror 6 setup, language detection (JS/JSX, JSON, PHP, SCSS), unmount cleanup
- `components/CodeOutput.vue` — CodeMirror 6 instance wrapper
- `components/ConfirmModal.vue` — reusable confirm/cancel dialog wrapping `<UModal>`
- `pages/output.vue`:
  - `<UTabs>` with dynamic items from `outputStore.generatedFiles`
  - Tab labels: filename + `<UBadge>` source indicator (`T`/`AI`)
  - Template tabs: `<CodeOutput>` mounted immediately
  - LLM tabs: `<USkeleton>` during streaming, replaced with `<CodeOutput>` on `llm-file`
  - Failed LLM tabs: `<UAlert color="red">` + "Retry" button
  - Per-tab: copy button (with `useToast()`) + individual file download
  - Footer: Regenerate LLM / Regenerate All / Download ZIP / Start Over
  - Start Over: `<ConfirmModal>` -> clears all stores -> navigates to `/build`

**Acceptance criteria:**
- [ ] Template tabs render with content before LLM call completes
- [ ] LLM tabs show skeleton during streaming; replace with editor on `llm-file`
- [ ] CodeMirror syntax highlighting correct for all file types
- [ ] Copy to clipboard works with toast confirmation
- [ ] Individual file download produces correctly named files
- [ ] ZIP download includes all generated files in correct directory structure
- [ ] Partial ZIP (template files only) works when LLM has failed
- [ ] Start Over clears all three Pinia stores and redirects to `/build`
- [ ] TypeScript: `pnpm typecheck` passes

**Dependencies:** Phase 6

---

## Phase 8 — Polish & Open Source Release

**Goal:** Production-ready quality — comprehensive error handling, accessible UI, CI pipeline, documentation, and self-hostable from README.

**Key deliverables:**
- `<UStepper>` in `default.vue` correctly reflects active step + completed step markers
- `useToast()` notifications for all async outcomes (file copy, generation complete, LLM error, download)
- Full error handling matrix:
  - Template engine errors -> fatal SSE error event
  - LLM rate limits -> non-fatal, retry-able
  - Malformed Claude response -> non-fatal, `codeParser` recovery
  - ZIP build failure -> fatal
- `<USkeleton>` loading states for all async UI transitions
- Responsive layout (Tailwind `sm:`/`md:`/`lg:`) — tablet-friendly minimum
- Keyboard accessibility: focus trapping in modals, `<VueDraggable>` keyboard support
- Nitro scheduled task for bundle cleanup (delete bundles older than `bundleTtlMs`)
- `CONTRIBUTING.md` — dev setup, PR guidelines, registry contribution guide
- `LICENSE` (MIT)
- GitHub issue templates: Bug Report, Feature Request, Registry Entry Request
- CI: GitHub Actions workflow (`nuxt build` + `vitest run` on every PR)

**Acceptance criteria:**
- [ ] No console errors or warnings in happy path (both static and dynamic block generation)
- [ ] `<UStepper>` accurately reflects state throughout full flow
- [ ] All async events produce appropriate toast notifications
- [ ] `nuxt build` passes in CI
- [ ] `vitest run` passes in CI
- [ ] README: a developer unfamiliar with the project can self-host in under 15 minutes
- [ ] TypeScript: `pnpm typecheck` passes

**Dependencies:** Phase 7

---

## Dependency Graph

```
Phase 1 (Scaffold)
  └─> Phase 2 (Component Builder)
        └─> Phase 3 (Block Configuration)
              ├─> Phase 4 (PRD & Generate Screen)
              └─> Phase 5 (Template Engine)  ← can parallel with Phase 4
                    └─> Phase 6 (LLM Integration)  ← needs Phase 4 + 5
                          └─> Phase 7 (Code Output UI)
                                └─> Phase 8 (Polish & Release)
```

---

## Cross-Cutting Concerns

These apply to every phase:

- **TypeScript strict mode** — run `pnpm typecheck` after every task
- **NuxtUI components** — always use specified NuxtUI components per the [Component Map](wp-block-builder-outline.md#5-nuxtui-component-map); never substitute raw HTML
- **Server-only secrets** — `anthropicApiKey` must never appear in client bundle or network requests
- **No visual CSS** — SCSS output is BEM naming scaffolds only; no colors, sizes, or visual values
- **Composition API** — all Vue components use `<script setup lang="ts">`
- **Pinia stores** — auto-imported via `@pinia/nuxt`; no manual registration

---

## File Generation Decision Table

| File | Generator | Condition | Cost |
|------|-----------|-----------|------|
| `block.json` | Template engine | Always | Free |
| `index.js` | Template engine | Always | Free |
| `render.php` | Template engine | Dynamic blocks only | Free |
| `style.scss` | Template engine | Always | Free |
| `editor.scss` | Template engine | If selected | Free |
| `save.js` | Template engine | Flat blocks (depth 1, no InnerBlocks) | Free |
| `save.js` | Claude LLM | Nested or InnerBlocks required | API |
| `edit.js` | Claude LLM | Always (when selected) | API |
| `view.js` | Claude LLM | If selected | API |
