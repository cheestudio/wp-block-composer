# Phase 1 — Project Scaffold

> **Status:** `pending`
> **Goal:** A running Nuxt 3 app with all dependencies, core configuration, shared @wordpress/* developer component registry, app shell with step navigation, and Docker support.
> **Acceptance:** `nuxt dev` starts, NuxtUI renders, 50+ developer component registry entries, `<UStepper>` visible, Docker builds, `pnpm typecheck` passes.

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

## 6. WordPress Developer Component Registry

- [X] **7.1** Create `shared/wpComponentRegistry.ts` with TypeScript interfaces:
  - `RegistryEntry` — `name`, `label`, `category`, `package`, `color`, `context`, `canHaveChildren`, `description`, `options[]`
  - `RegistryOption` — `key`, `label`, `type` (`select`/`boolean`/`text`/`number`), `choices?`, `default?`, `hint?`
  - `ComponentCategory` type: `'block-editor' | 'controls' | 'color' | 'layout' | 'feedback'`
  - `ComponentContext` type: `'editor' | 'inspector' | 'toolbar' | 'save' | 'any'`
- [X] **7.2** Populate 50+ developer component entries from `@wordpress/block-editor` and `@wordpress/components`:
  - **Block Editor:** `RichText`, `InnerBlocks`, `InspectorControls`, `BlockControls`, `InspectorAdvancedControls`, `MediaUpload`, `MediaPlaceholder`, `AlignmentToolbar`, `BlockAlignmentToolbar`, `BlockVerticalAlignmentToolbar`, `ColorPaletteControl`, `ColorGradientControl`, `ContrastChecker`, `URLInput`, `PlainText`, `BlockIcon`, `BlockVariationPicker`
  - **Controls:** `TextControl`, `TextareaControl`, `ToggleControl`, `SelectControl`, `RangeControl`, `CheckboxControl`, `RadioControl`, `ComboboxControl`, `NumberControl`, `AnglePickerControl`, `FontSizePicker`, `UnitControl`, `DateTimePicker`, `TimePicker`, `DatePicker`, `FormTokenField`
  - **Color:** `ColorPalette`, `ColorPicker`, `ColorIndicator`, `GradientPicker`
  - **Layout:** `PanelBody`, `PanelRow`, `BaseControl`, `Card`, `CardBody`, `CardHeader`, `Flex`, `FlexItem`, `ToolbarGroup`, `ToolbarButton`, `ButtonGroup`, `Button`, `MenuGroup`, `MenuItem`
  - **Feedback:** `Notice`, `Spinner`, `Placeholder`, `Tooltip`, `Icon`, `Dashicon`, `Disabled`, `Dropdown`, `DropdownMenu`, `Modal`, `TabPanel`, `Popover`
- [X] **7.3** For each entry, configure:
  - `package` — `@wordpress/block-editor` or `@wordpress/components`
  - `context` — where the component is typically used (editor, inspector, toolbar, save, any)
  - `canHaveChildren` — `true` for containers (InspectorControls, BlockControls, PanelBody, Flex, etc.)
  - `description` — one-line description of the component
  - `options[]` — configurable props with correct types, choices, defaults, and hints
- [X] **7.4** Export typed registry array and helper functions (`findRegistryEntry`, `getEntriesByCategory`, `getEntriesByContext`, `getCategories`, `searchRegistry`)
- [X] **7.5** Verify registry is importable from both `pages/` (client) and `server/` (server) via `shared/` directory

---

## Notes

_This to-do list will be updated as work progresses. Items may be added, modified, or reordered based on discoveries during implementation._
