# WP Block Composer — Registry Paradigm Refactor

> **Created:** 2026-03-28
> **Status:** Planning
> **Reason:** The current registry is populated with **end-user content blocks** (`core/paragraph`, `core/heading`, `core/image`, etc.) — blocks that content editors place on a page. The actual goal is to let developers select from **WordPress' developer component library** (the `@wordpress/block-editor` and `@wordpress/components` packages documented at [wp-gb.com](https://wp-gb.com/)) to compose a custom block's editor UI.

---

## The Paradigm Shift

### Current (wrong)

> "I want my block to contain a Paragraph, then an Image, then a Group with Columns"

The registry describes **finished WordPress blocks** that live in `post_content`. The user "composes" a block by selecting existing blocks and nesting them. This makes the tool a block-layout builder, not a block-scaffolding tool.

### Correct

> "I want my block's editor to use RichText for editable text, MediaUpload for image selection, and InspectorControls with a ColorPalette and ToggleControl in the sidebar"

The registry should describe **developer-facing editor components** from the `@wordpress/*` packages. The user composes a **component tree that represents the block's `edit.js` structure** — the React components WordPress provides for building custom block editor interfaces.

### What changes

| Aspect | Before | After |
|--------|--------|-------|
| Registry entries | End-user blocks (`core/paragraph`, `core/image`) | Developer components (`RichText`, `InspectorControls`, `MediaUpload`) |
| Categories | `text`, `media`, `layout`, `interactive`, `embed` | `block-editor`, `controls`, `color`, `layout`, `feedback` |
| Component source | WordPress block library | `@wordpress/block-editor` + `@wordpress/components` packages |
| Tree represents | Block content structure | `edit.js` component tree |
| `canHaveChildren` | "Can this block contain inner blocks?" | "Can this component contain child components?" (e.g., InspectorControls, PanelBody) |
| Options | Block settings (placeholder, level, ordered) | Component props (tagName, placeholder, allowedTypes, label) |
| Purpose of nesting | InnerBlocks layout | UI structure (InspectorControls → PanelBody → ToggleControl) |

---

## Affected Files

### 1. `shared/wpComponentRegistry.ts` — Full Rewrite

**Current state:** 24 entries representing WordPress content blocks with `saveJsTemplate`, `innerBlocksRequired`.

**New state:** 40+ entries representing `@wordpress/block-editor` and `@wordpress/components` developer components.

#### New TypeScript Interfaces

```ts
export type ComponentCategory =
  | 'block-editor'   // Core block editor components (RichText, InnerBlocks, MediaUpload)
  | 'controls'       // Form controls (TextControl, ToggleControl, SelectControl)
  | 'color'          // Color components (ColorPalette, ColorPicker, ContrastChecker)
  | 'layout'         // Structural/layout (PanelBody, PanelRow, BaseControl, Flex)
  | 'feedback'       // Display/feedback (Notice, Spinner, Tooltip, Placeholder)

export type ComponentContext =
  | 'editor'         // Used in the block's main edit area
  | 'inspector'      // Used inside InspectorControls (sidebar)
  | 'toolbar'        // Used inside BlockControls (toolbar)
  | 'save'           // Used in save.js output
  | 'any'            // Can be used in any context

export interface RegistryOption {
  key: string
  label: string
  type: 'select' | 'boolean' | 'text' | 'number'
  choices?: string[]
  default?: unknown
  hint?: string       // Short tooltip explaining what this prop does
}

export interface RegistryEntry {
  name: string                    // e.g. 'RichText', 'InspectorControls'
  label: string                   // Human-readable label
  category: ComponentCategory
  package: string                 // e.g. '@wordpress/block-editor', '@wordpress/components'
  color: string                   // Hex color for UI badge
  context: ComponentContext       // Where this component is typically placed
  canHaveChildren: boolean        // Can contain child components in the tree
  description: string             // One-line description of what this component does
  options: RegistryOption[]       // Configurable props for this component
}
```

**Key differences from current:**
- Removed: `innerBlocksRequired`, `saveJsTemplate` (these were content-block concepts)
- Added: `package`, `context`, `description`
- Changed: `name` goes from `'core/paragraph'` to `'RichText'` (component name, not block name)

#### New Registry Entries (organized by category)

**Block Editor** (`@wordpress/block-editor`):
| Component | canHaveChildren | context | Description |
|-----------|----------------|---------|-------------|
| `RichText` | false | editor | Editable rich text field with formatting |
| `InnerBlocks` | false | editor | Nested block container allowing child blocks |
| `InspectorControls` | true | inspector | Sidebar panel container for block settings |
| `BlockControls` | true | toolbar | Block toolbar container |
| `InspectorAdvancedControls` | true | inspector | "Advanced" section in sidebar |
| `MediaUpload` | false | any | File/media upload trigger |
| `MediaPlaceholder` | false | editor | Placeholder UI for media selection |
| `AlignmentToolbar` | false | toolbar | Text alignment control (left/center/right) |
| `BlockAlignmentToolbar` | false | toolbar | Block alignment (center/wide/full) |
| `BlockVerticalAlignmentToolbar` | false | toolbar | Vertical alignment (top/center/bottom) |
| `ColorPaletteControl` | false | inspector | Theme-aware color palette selector |
| `ColorGradientControl` | false | inspector | Combined color + gradient picker |
| `ContrastChecker` | false | inspector | WCAG 2.0 AA contrast validator |
| `URLInput` | false | any | URL input with autocomplete |
| `BlockIcon` | false | any | Renders a block's icon |
| `PlainText` | false | editor | Plain (unformatted) text input |
| `BlockVariationPicker` | false | editor | Block variation selection UI |

**Controls** (`@wordpress/components`):
| Component | canHaveChildren | context | Description |
|-----------|----------------|---------|-------------|
| `TextControl` | false | inspector | Single-line text input |
| `TextareaControl` | false | inspector | Multi-line text input |
| `ToggleControl` | false | inspector | On/off switch |
| `SelectControl` | false | inspector | Dropdown select |
| `RangeControl` | false | inspector | Numeric slider |
| `CheckboxControl` | false | inspector | Checkbox input |
| `RadioControl` | false | inspector | Radio button group |
| `ComboboxControl` | false | inspector | Searchable dropdown |
| `NumberControl` | false | inspector | Numeric input with stepper |
| `AnglePickerControl` | false | inspector | Angle/rotation input |
| `FontSizePicker` | false | inspector | Theme-aware font size selector |
| `UnitControl` | false | inspector | Number + CSS unit selector |
| `DateTimePicker` | false | inspector | Date and time picker |
| `TimePicker` | false | inspector | Time-only picker |
| `DatePicker` | false | inspector | Date-only picker |
| `FormTokenField` | false | inspector | Tag/token input (like keywords) |

**Color** (`@wordpress/components`):
| Component | canHaveChildren | context | Description |
|-----------|----------------|---------|-------------|
| `ColorPalette` | false | inspector | Preset color selection |
| `ColorPicker` | false | inspector | Full custom color picker |
| `ColorIndicator` | false | any | Visual color swatch display |
| `GradientPicker` | false | inspector | Gradient selection |

**Layout** (`@wordpress/components`):
| Component | canHaveChildren | context | Description |
|-----------|----------------|---------|-------------|
| `PanelBody` | true | inspector | Collapsible panel section |
| `PanelRow` | true | inspector | Horizontal row within a panel |
| `BaseControl` | true | inspector | Label + input wrapper |
| `Card` | true | any | Card container with sections |
| `CardBody` | true | any | Card body section |
| `CardHeader` | true | any | Card header section |
| `Flex` | true | any | Flexbox container |
| `FlexItem` | true | any | Flex child |
| `ToolbarGroup` | true | toolbar | Groups toolbar buttons |
| `ToolbarButton` | false | toolbar | Individual toolbar button |
| `ButtonGroup` | true | any | Grouped button container |
| `Button` | false | any | Clickable button |
| `MenuGroup` | true | any | Menu item grouping |
| `MenuItem` | false | any | Individual menu item |

**Feedback** (`@wordpress/components`):
| Component | canHaveChildren | context | Description |
|-----------|----------------|---------|-------------|
| `Notice` | false | any | Notification/alert message |
| `Spinner` | false | any | Loading indicator |
| `Placeholder` | true | editor | Empty state placeholder with actions |
| `Tooltip` | true | any | Hover tooltip wrapper |
| `Icon` | false | any | SVG icon display |
| `Dashicon` | false | any | WordPress Dashicon |
| `Disabled` | true | any | Disables all child inputs |
| `Dropdown` | true | any | Dropdown toggle + content |
| `DropdownMenu` | false | any | Icon-triggered dropdown menu |
| `Modal` | true | any | Modal dialog |
| `TabPanel` | true | any | Tabbed content interface |
| `Popover` | true | any | Floating content container |

---

### 2. `app/stores/componentStore.ts` — Interface Update

**Current `ComponentItem`:**
```ts
interface ComponentItem {
  id: string
  registryName: string   // 'core/paragraph'
  label: string
  parentId: string | null
  order: number
  options: Record<string, unknown>
  notes: string
}
```

**New `ComponentItem`:**
```ts
interface ComponentItem {
  id: string
  registryName: string   // 'RichText' — now references a developer component
  label: string
  parentId: string | null
  order: number
  options: Record<string, unknown>
  notes: string
}
```

The interface itself doesn't change structurally — `registryName` just references a different kind of entity. However, store logic needs review:

- **`canHaveChildren` checks** — Still valid. `InspectorControls`, `PanelBody`, `BlockControls` etc. can have children; `TextControl`, `RichText` cannot.
- **`asTree()`** — Still valid. The tree now represents `edit.js` component nesting instead of block content nesting.
- **`isFlat()`** — Semantic change. Previously: "no nested blocks." Now: "no nested components" (rare — most blocks have at least InspectorControls with children).
- **`hasContainerWithoutChildren()`** — Still valid. An `InspectorControls` or `PanelBody` with no children is an empty container.

**Changes needed:**
- No structural changes to the store actions/computed
- Remove any references to old registry entry fields (`innerBlocksRequired`, `saveJsTemplate`) if they exist in store logic
- Update the `addComponent` default label mapping

---

### 3. `app/composables/useComponentRegistry.ts` — Category Update

- Update `categories` list to match new `ComponentCategory` type
- `filteredEntries`, `search`, `getByCategory`, `lookup` all work unchanged (they operate on the registry array generically)
- Consider adding a `getByContext(context: ComponentContext)` filter to help users find components appropriate for their current tree position

---

### 4. `app/components/ComponentPickerModal.vue` — UX Adjustments

- **Category filter** — Update to new categories (`block-editor`, `controls`, `color`, `layout`, `feedback`)
- **Search** — Works unchanged (searches `name` and `label`)
- **Component display** — Show `package` source (e.g., "@wordpress/block-editor") and `context` indicator
- **Options form** — Works unchanged (still renders from `RegistryOption[]`)
- **Context guidance** — Consider showing a hint like "Typically used in: Sidebar" based on the `context` field to help developers place components correctly

---

### 5. `app/components/ComponentOrderList.vue` — Display Updates

- **Category badge** — Update color mapping for new categories
- **Container badge** — Still shows when `canHaveChildren` is true
- **Context indicator** — New: show where this component typically lives (editor/inspector/toolbar)
- **Nesting validation** — Consider context-aware nesting hints (e.g., warn if a `TextControl` is placed outside `InspectorControls`)

---

### 6. `app/components/ComponentBuilder.vue` — Minor Updates

- Update empty-state messaging: "Add developer components to compose your block's editor interface" instead of "Add components to your block"
- Update count/summary labels

---

### 7. Downstream Impact on Later Phases

#### Template Engine (Phase 5)
- **`saveJs.ts`** — The decision of template vs LLM for `save.js` changes. Instead of checking `innerBlocksRequired` on content blocks, the logic should look at whether the component tree contains components that produce save-side output (e.g., `RichText` has a `<RichText.Content>` counterpart, `InnerBlocks` has `<InnerBlocks.Content>`).
- **`styleScss.ts`** — BEM scaffold generation changes. Instead of generating element selectors per content block type, generate selectors based on the block's semantic structure defined by the developer components.

#### LLM Generation (Phase 6)
- **PRD builder** — The component tree section of the PRD becomes more directly useful. Instead of "this block contains a Paragraph and an Image," it says "this block uses RichText for the heading, MediaUpload for the hero image, and InspectorControls with a ColorPalette and RangeControl." This is exactly the information Claude needs to generate `edit.js`.
- **Prompt quality** — This paradigm actually improves LLM generation quality because the component tree directly maps to the `edit.js` JSX tree. The current approach requires Claude to infer which developer components to use from a list of content blocks.

#### `block.json` Generation
- No change. `block.json` is configured in Phase 3 (block configuration) independently of the component tree.

---

## Implementation Plan

### Step 1: Rewrite `shared/wpComponentRegistry.ts`

1. Update `ComponentCategory` type to new values
2. Add `ComponentContext` type
3. Update `RegistryEntry` interface (remove `innerBlocksRequired`, `saveJsTemplate`; add `package`, `context`, `description`)
4. Replace all 24 content-block entries with 50+ developer component entries organized by category
5. Update `categoryColors` mapping
6. All existing helper functions (`findRegistryEntry`, `getEntriesByCategory`, `searchRegistry`, `getCategories`) remain but operate on new data
7. Add `getEntriesByContext(context: ComponentContext)` helper

### Step 2: Update `app/stores/componentStore.ts`

1. No structural interface changes needed — `ComponentItem` shape stays the same
2. Verify all computed properties and actions still make sense with new registry semantics
3. Update any JSDoc comments referencing "content blocks"

### Step 3: Update `app/composables/useComponentRegistry.ts`

1. Update category references
2. Add context-based filtering if desired
3. Verify search/filter still works against new entry shapes

### Step 4: Update `app/components/ComponentPickerModal.vue`

1. Update category filter chips to new categories
2. Add package source display in component list items
3. Add context indicator
4. Options form rendering unchanged (still driven by `RegistryOption[]`)

### Step 5: Update `app/components/ComponentOrderList.vue`

1. Update category badge color mapping
2. Add context indicator per row
3. Update any descriptive text

### Step 6: Update `app/components/ComponentBuilder.vue`

1. Update empty-state copy
2. Update summary/count labels

### Step 7: Update Documentation

1. Update `PROJECT.MD` Section 9 (WordPress Component Registry) to reflect new paradigm
2. Update `wp-block-composer-outline.md` Section 9 and related sections
3. Update phase descriptions where they reference "content blocks"

---

## Validation Criteria

After refactoring:
- [ ] Registry exports 50+ developer component entries covering all major `@wordpress/block-editor` and `@wordpress/components` components documented at wp-gb.com
- [ ] All TypeScript interfaces compile cleanly
- [ ] Component picker modal correctly displays new categories and component info
- [ ] Component tree builder still supports add/edit/delete/duplicate/reorder/indent/outdent
- [ ] Nesting logic works correctly (e.g., `TextControl` inside `PanelBody` inside `InspectorControls`)
- [ ] `pnpm typecheck` passes
- [ ] Existing Phase 2 acceptance criteria still pass (functionally identical, different data)
