# Phase 2 — Component Builder

> **Status:** `in-progress`
> **Goal:** A fully functional developer component tree builder on `/build` — users can search the `@wordpress/*` component registry, add developer components (RichText, InspectorControls, TextControl, etc.) with configured props, reorder via drag-and-drop, nest via indent/outdent to compose the edit.js JSX structure, and edit/duplicate/delete any component.
> **Acceptance:** Can add/nest/reorder 5+ developer components, `asTree()` mirrors visual nesting (edit.js JSX hierarchy), edit/duplicate/delete work, route guard blocks `/configure` when store is empty, `pnpm typecheck` passes.

---

## 1. Component Store

- [X] **1.1** Create `app/stores/componentStore.ts` — Pinia store with Composition API (`defineStore` + `setup` function):
  - State: `items: ComponentItem[]` (flat list with `parentId` + `order` for nesting)
  - `ComponentItem` interface: `id`, `registryName` (developer component name, e.g. 'RichText'), `label`, `parentId` (string | null), `order`, `options` (record of configured prop values), `notes` (string)
- [X] **1.2** Add CRUD actions:
  - `addComponent(registryName, options, notes)` — appends with unique `id` (uuid), `parentId: null`, next `order`
  - `updateComponent(id, updates)` — partial update of options/notes
  - `removeComponent(id)` — removes component and all descendants (recursive)
  - `duplicateComponent(id)` — deep-clones component (and descendants) with new IDs, remapped parentIds
- [X] **1.3** Add reorder actions:
  - `reorder(newFlatOrderedIds)` — groups by parentId, sorts each group by new visual position, renumbers
  - `indent(id)` — set `parentId` to previous sibling (only if that sibling `canHaveChildren`, e.g. InspectorControls, PanelBody)
  - `outdent(id)` — move component to parent's parent (placed right after parent in sibling order)
  - `canIndent(id)` / `canOutdent(id)` — boolean checks for UI disable state
- [X] **1.4** Add computed getters:
  - `asTree()` — returns nested `TreeNode[]` representing the edit.js JSX hierarchy
  - `flatOrdered()` — returns `FlatOrderedItem[]` in visual order (depth-first traversal of tree)
  - `isFlat()` — `true` when all components have `parentId === null`
  - `hasContainerWithoutChildren()` — `true` when any container component (e.g. InspectorControls, PanelBody) has zero children
  - `isEmpty()` — `true` when `items.length === 0`
- [X] **1.5** Exported interfaces: `ComponentItem`, `TreeNode`, `FlatOrderedItem`

## 2. Registry Composable

- [X] **2.1** Create `app/composables/useComponentRegistry.ts`:
  - Wraps `searchRegistry()` and `findRegistryEntry()` from `shared/wpComponentRegistry.ts`
  - Provides reactive `searchQuery` ref and `filteredEntries` computed
  - Provides `search(query)`, `getByCategory(category)`, `getByContext(context)`, `lookup(name)`, `categories`
- [X] **2.2** Auto-imported via Nuxt `composables/` convention

## 3. Component Picker Modal

- [X] **3.1** Create `app/components/ComponentPickerModal.vue`:
  - `<UModal>` with programmatic `v-model:open` control
  - Props: `open` (boolean), `editItem` (optional `ComponentItem` for edit mode)
  - Emits: `update:open`, `save`
- [X] **3.2** Implement search/browse interface:
  - `<UInput>` search field with live filtering against registry (searches name, label, and description)
  - Category filter buttons (`block-editor`, `controls`, `color`, `layout`, `feedback`) with icons
  - Result list showing component label, description, `@wordpress/*` package source, context badge, category color dot
  - Click to select → advances to configure step
- [X] **3.3** Implement dynamic options form:
  - When a registry entry is selected, render its `options[]` as form fields:
    - `select` → `<USelect>` with mapped `choices`
    - `boolean` → `<USwitch>` with label
    - `text` → `<UInput>`
    - `number` → `<UInput type="number">`
  - Show option `hint` text on form fields
  - Pre-fill with `default` values from registry
  - In edit mode: pre-fill with existing `ComponentItem` option values
- [X] **3.4** Add notes field:
  - `<UTextarea>` with autoresize for developer intent notes
  - In edit mode: pre-fill with existing notes
- [X] **3.5** Add save/cancel actions:
  - "Add to Block" / "Save Changes" button (label changes based on add vs edit mode)
  - "Cancel" button to close, "Back" button to return to search step
  - On save: emit `save` event with `{ registryName, options, notes }`

## 4. Component Order List

- [X] **4.1** Create `app/components/ComponentOrderList.vue`:
  - Uses `vue-draggable-plus` (`<VueDraggable>`) with local mutable copy synced from store
  - Renders `componentStore.flatOrdered` as a visual list
- [X] **4.2** Implement row rendering:
  - Each row is a `<UCard>` showing:
    - Drag handle icon (`i-lucide-grip-vertical`, `.drag-handle` class)
    - Visual indentation (`paddingLeft` based on `depth * 1.5rem`)
    - Category color indicator (colored dot from registry `color`)
    - Component label and `@wordpress/*` package source
    - Context badge (Editor/Sidebar/Toolbar)
    - Container badge for `canHaveChildren` components
    - Configured options summary (condensed, non-default values)
    - Notes preview (truncated, italic)
- [X] **4.3** Implement row actions:
  - `<UDropdownMenu>` per row with grouped actions:
    - **Edit** — emits `edit` event to parent
    - **Duplicate** — calls `componentStore.duplicateComponent(id)`
    - **Indent** — calls `componentStore.indent(id)`; disabled via `canIndent()`
    - **Outdent** — calls `componentStore.outdent(id)`; disabled via `canOutdent()`
    - **Delete** — calls `componentStore.removeComponent(id)` (color: error)
- [X] **4.4** Implement drag-and-drop:
  - On drag end: call `componentStore.reorder()` with new ID order from mutated list
  - Animated transitions (150ms)
  - Parent-child relationships preserved (only sibling order changes)
- [X] **4.5** Implement empty-container warning:
  - `<UAlert>` displayed inline below any container component with zero children
  - Warning variant with alert-triangle icon
  - Appears/disappears reactively as children are added/removed

## 5. Component Builder (Root)

- [X] **5.1** Create `app/components/ComponentBuilder.vue`:
  - Assembles `ComponentPickerModal` + `ComponentOrderList`
  - "Add Component" CTA button (opens picker modal in add mode)
  - Empty state: centered icon, heading, description ("Add developer components from the @wordpress library..."), and CTA when store is empty
- [X] **5.2** Wire up modal interactions:
  - Add mode: modal save → `componentStore.addComponent()`
  - Edit mode: modal save → `componentStore.updateComponent()`
  - Modal close → reset `editingItem` state
- [X] **5.3** Add component count summary:
  - Display total component count and max nesting depth
  - `<UBadge>` warning indicator if `hasContainerWithoutChildren` is true

## 6. Build Page

- [X] **6.1** Update `app/pages/build.vue`:
  - Replaced placeholder content with `<ComponentBuilder />`
  - Page header with title "Build Component Tree" and instructions about selecting @wordpress components
  - "Next: Configure →" navigation button (disabled when store is empty, links to `/configure`)

## 7. Route Guard

- [X] **7.1** Create `app/middleware/require-components.ts`:
  - Nuxt route middleware that checks `componentStore.isEmpty`
  - If store is empty: redirect to `/build`
  - Applied to `configure.vue`, `generate.vue`, and `output.vue` via `definePageMeta`
- [ ] **7.2** Verify redirect works when navigating directly to `/configure` with empty store

## 8. TypeScript & Validation

- [ ] **8.1** Run `pnpm typecheck` — fix any type errors
- [ ] **8.2** Verify all new interfaces are properly exported and reusable
- [ ] **8.3** Test full flow: add 5+ developer components including nested containers (e.g. InspectorControls → PanelBody → TextControl), reorder, edit, duplicate, delete

---

## Acceptance Criteria Checklist

- [ ] Can add 5+ developer components including nested containers (e.g., InspectorControls → PanelBody → TextControl)
- [ ] Drag-to-reorder correctly updates component order
- [ ] Indent/outdent correctly sets/clears `parentId`; indent disabled when row above is a leaf component
- [ ] `asTree()` output correctly mirrors visual nesting (represents the edit.js JSX hierarchy)
- [ ] Empty-container `<UAlert>` appears/disappears correctly
- [ ] Edit re-opens modal pre-populated with current values
- [ ] Duplicate creates an independent copy
- [ ] Route guard redirects to `/build` from `/configure` when store is empty
- [ ] TypeScript: `pnpm typecheck` passes

---

## Notes

_This to-do list will be updated as work progresses. Items may be added, modified, or reordered based on discoveries during implementation._
