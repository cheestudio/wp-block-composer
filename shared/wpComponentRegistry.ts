// WordPress Developer Component Registry
// Shared between client (pages/) and server (server/) via Nuxt shared/ directory
//
// Contains developer-facing editor components from @wordpress/block-editor and
// @wordpress/components — the React components WordPress provides for building
// custom block editor interfaces. Reference: https://wp-gb.com/
//
// These are NOT end-user content blocks (core/paragraph, core/image, etc.).

export type ComponentCategory = 'input' | 'interface' | 'color' | 'ui'

export type ComponentContext =
  | 'editor'     // Used in the block's main edit area
  | 'inspector'  // Used inside InspectorControls (sidebar)
  | 'toolbar'    // Used inside BlockControls (toolbar)
  | 'save'       // Used in save.js output
  | 'any'        // Can be used in any context

export type BlockAttributeJsonType =
  | 'string'
  | 'boolean'
  | 'object'
  | 'array'
  | 'integer'
  | 'number'
  | 'null'

export interface RegistryOption {
  key: string
  label: string
  type: 'select' | 'boolean' | 'text' | 'number'
  choices?: string[]
  default?: unknown
  hint?: string
}

export interface RegistryEntry {
  name: string
  label: string
  category: ComponentCategory
  registryPackage: string
  color: string
  context: ComponentContext
  defaultAttribute: BlockAttributeJsonType
  canHaveChildren: boolean
  description: string
  options: RegistryOption[]
}

const categoryColors: Record<ComponentCategory, string> = {
  'interface': '#fd971f',
  'input': '#66d9ef',
  'color': '#f92672',
  'ui': '#ae81ff'
}

export const wpComponentRegistry: RegistryEntry[] = [

	
  // ── Input (@wordpress/block-editor + @wordpress/components) ─────

  {
    name: 'RichText',
    label: 'Rich Text',
    category: 'input',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['input'],
    context: 'editor',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Editable rich text field with formatting toolbar',
    options: [
      { key: 'tagName', label: 'HTML tag', type: 'select', choices: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'blockquote', 'li'], default: 'p', hint: 'Wrapper element for the editable text' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', default: '', hint: 'Text shown when field is empty' },
      { key: 'multiline', label: 'Multiline', type: 'boolean', default: false, hint: 'Allow multiple paragraphs via Enter key' },
      { key: 'keepPlaceholderOnFocus', label: 'Keep placeholder on focus', type: 'boolean', default: false }
    ]
  },
  {
    name: 'InnerBlocks',
    label: 'Inner Blocks',
    category: 'input',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['input'],
    context: 'editor',
    defaultAttribute: 'null',
    canHaveChildren: false,
    description: 'Nested block container allowing child blocks inside this block',
    options: [
      { key: 'orientation', label: 'Orientation', type: 'select', choices: ['vertical', 'horizontal'], default: 'vertical', hint: 'Layout direction for child blocks' },
      { key: 'templateLock', label: 'Template lock', type: 'select', choices: ['false', 'all', 'insert', 'contentOnly'], default: 'false', hint: 'Restrict how users can modify inner blocks' },
      { key: 'renderAppender', label: 'Show block appender', type: 'boolean', default: true, hint: 'Show the "+" button to add blocks' }
    ]
  },
  {
    name: 'MediaUpload',
    label: 'Media Upload',
    category: 'input',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['input'],
    context: 'any',
    defaultAttribute: 'object',
    canHaveChildren: false,
    description: 'Media library upload trigger for images, videos, and files',
    options: [
      { key: 'allowedTypes', label: 'Allowed types', type: 'text', default: 'image', hint: 'Comma-separated: image, video, audio' },
      { key: 'multiple', label: 'Returns an array of media objects', type: 'boolean', default: false },
      { key: 'gallery', label: 'Enable gallery mode (multiple selection)', type: 'boolean', default: false }
    ]
  },
  {
    name: 'TextControl',
    label: 'Text Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Single-line text input for block settings',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'help', label: 'Help text', type: 'text', default: '', hint: 'Description shown below the input' },
      { key: 'type', label: 'Input type', type: 'select', choices: ['text', 'email', 'url', 'tel', 'password', 'number'], default: 'text' }
    ]
  },
  {
    name: 'TextareaControl',
    label: 'Textarea Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Multi-line text input for longer content',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'help', label: 'Help text', type: 'text', default: '' },
      { key: 'rows', label: 'Rows', type: 'number', default: 4 }
    ]
  },
  {
    name: 'ToggleControl',
    label: 'Toggle Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'boolean',
    canHaveChildren: false,
    description: 'On/off switch for boolean settings',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'help', label: 'Help text', type: 'text', default: '' }
    ]
  },
  {
    name: 'SelectControl',
    label: 'Select Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Dropdown select for choosing from predefined options',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'help', label: 'Help text', type: 'text', default: '' },
      { key: 'multiple', label: 'Multiple select', type: 'boolean', default: false }
    ]
  },
  {
    name: 'RangeControl',
    label: 'Range Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'number',
    canHaveChildren: false,
    description: 'Numeric slider for range values (e.g., opacity, columns)',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'help', label: 'Help text', type: 'text', default: '' },
      { key: 'min', label: 'Minimum', type: 'number', default: 0 },
      { key: 'max', label: 'Maximum', type: 'number', default: 100 },
      { key: 'step', label: 'Step', type: 'number', default: 1 },
      { key: 'withInputField', label: 'Show number input', type: 'boolean', default: true }
    ]
  },
  {
    name: 'CheckboxControl',
    label: 'Checkbox Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'boolean',
    canHaveChildren: false,
    description: 'Single checkbox for boolean options',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'help', label: 'Help text', type: 'text', default: '' }
    ]
  },
  {
    name: 'RadioControl',
    label: 'Radio Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Radio button group for mutually exclusive choices',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'help', label: 'Help text', type: 'text', default: '' }
    ]
  },
  {
    name: 'ComboboxControl',
    label: 'Combobox Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Searchable dropdown for large option sets',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'help', label: 'Help text', type: 'text', default: '' }
    ]
  },
  {
    name: 'NumberControl',
    label: 'Number Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'number',
    canHaveChildren: false,
    description: 'Numeric input with optional stepper buttons',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'min', label: 'Minimum', type: 'number', default: 0 },
      { key: 'max', label: 'Maximum', type: 'number', default: 100 },
      { key: 'step', label: 'Step', type: 'number', default: 1 }
    ]
  },
  {
    name: 'AnglePickerControl',
    label: 'Angle Picker',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'number',
    canHaveChildren: false,
    description: 'Angle/rotation input with visual dial',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: 'Angle' }
    ]
  },
  {
    name: 'FontSizePicker',
    label: 'Font Size Picker',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Theme-aware font size selector with presets',
    options: [
      { key: 'withSlider', label: 'Show slider', type: 'boolean', default: false },
      { key: 'withReset', label: 'Show reset button', type: 'boolean', default: true }
    ]
  },
  {
    name: 'UnitControl',
    label: 'Unit Control',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Number input with CSS unit selector (px, em, rem, %)',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'units', label: 'Available units', type: 'text', default: 'px,em,rem,%', hint: 'Comma-separated CSS units' }
    ]
  },
  {
    name: 'DateTimePicker',
    label: 'Date Time Picker',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Combined date and time picker',
    options: [
      { key: 'is12Hour', label: '12-hour format', type: 'boolean', default: true }
    ]
  },
  {
    name: 'TimePicker',
    label: 'Time Picker',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Time-only selection control',
    options: [
      { key: 'is12Hour', label: '12-hour format', type: 'boolean', default: true }
    ]
  },
  {
    name: 'DatePicker',
    label: 'Date Picker',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Date-only selection calendar',
    options: []
  },
  {
    name: 'FormTokenField',
    label: 'Form Token Field',
    category: 'input',
    registryPackage: '@wordpress/components',
    color: categoryColors['input'],
    context: 'inspector',
    defaultAttribute: 'array',
    canHaveChildren: false,
    description: 'Tag/token input for multiple values (like keywords)',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'maxLength', label: 'Max tokens', type: 'number', default: 0, hint: '0 = unlimited' }
    ]
  },

  // ── Interface (@wordpress/block-editor + @wordpress/components) ──

  {
    name: 'InspectorControls',
    label: 'Inspector Controls',
    category: 'interface',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['interface'],
    context: 'inspector',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Sidebar panel container for block settings',
    options: []
  },
  {
    name: 'InspectorAdvancedControls',
    label: 'Inspector Advanced Controls',
    category: 'interface',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['interface'],
    context: 'inspector',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Advanced section in sidebar (collapsed by default)',
    options: []
  },
  {
    name: 'BlockControls',
    label: 'Block Controls',
    category: 'interface',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['interface'],
    context: 'toolbar',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Block toolbar container shown above selected block',
    options: [
      { key: 'group', label: 'Toolbar group', type: 'select', choices: ['default', 'block', 'inline', 'other', 'parent'], default: 'default', hint: 'Which toolbar section to place controls in' }
    ]
  },
  {
    name: 'AlignmentToolbar',
    label: 'Alignment Toolbar',
    category: 'interface',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['interface'],
    context: 'toolbar',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Text alignment control (left, center, right)',
    options: []
  },
  {
    name: 'BlockAlignmentToolbar',
    label: 'Block Alignment Toolbar',
    category: 'interface',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['interface'],
    context: 'toolbar',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Block-level alignment control (center, wide, full width)',
    options: [
      { key: 'controls', label: 'Alignment options', type: 'text', default: 'center,wide,full', hint: 'Comma-separated alignment values' }
    ]
  },
  {
    name: 'BlockVerticalAlignmentToolbar',
    label: 'Block Vertical Alignment',
    category: 'interface',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['interface'],
    context: 'toolbar',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Vertical alignment control (top, center, bottom)',
    options: []
  },
  {
    name: 'BlockIcon',
    label: 'Block Icon',
    category: 'interface',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Renders a block type icon (Dashicon or SVG)',
    options: [
      { key: 'icon', label: 'Icon name', type: 'text', default: 'block-default', hint: 'Dashicon name or SVG component' }
    ]
  },
  {
    name: 'BlockVariationPicker',
    label: 'Block Variation Picker',
    category: 'interface',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['interface'],
    context: 'editor',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'UI for selecting between block variations on initial placement',
    options: []
  },
  {
    name: 'MediaPlaceholder',
    label: 'Media Placeholder',
    category: 'interface',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['interface'],
    context: 'editor',
    defaultAttribute: 'object',
    canHaveChildren: false,
    description: 'Placeholder UI for media selection with upload and URL options',
    options: [
      { key: 'allowedTypes', label: 'Allowed types', type: 'text', default: 'image', hint: 'Comma-separated: image, video, audio' },
      { key: 'multiple', label: 'Allow multiple', type: 'boolean', default: false },
      { key: 'labels', label: 'Label text', type: 'text', default: '', hint: 'Label shown on the placeholder' }
    ]
  },
  {
    name: 'PanelBody',
    label: 'Panel Body',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'inspector',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Collapsible panel section for grouping sidebar controls',
    options: [
      { key: 'title', label: 'Panel title', type: 'text', default: '', hint: 'Heading text for the collapsible section' },
      { key: 'initialOpen', label: 'Initially open', type: 'boolean', default: true }
    ]
  },
  {
    name: 'PanelRow',
    label: 'Panel Row',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'inspector',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Horizontal row layout within a panel section',
    options: []
  },
  {
    name: 'BaseControl',
    label: 'Base Control',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'inspector',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Label and help text wrapper for custom form inputs',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: '' },
      { key: 'help', label: 'Help text', type: 'text', default: '' }
    ]
  },
  {
    name: 'Card',
    label: 'Card',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Card container with optional header, body, footer sections',
    options: [
      { key: 'size', label: 'Size', type: 'select', choices: ['small', 'medium', 'large'], default: 'medium' },
      { key: 'isBorderless', label: 'Borderless', type: 'boolean', default: false }
    ]
  },
  {
    name: 'CardBody',
    label: 'Card Body',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Main content area within a Card',
    options: []
  },
  {
    name: 'CardHeader',
    label: 'Card Header',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Header section within a Card',
    options: []
  },
  {
    name: 'Flex',
    label: 'Flex',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Flexbox container for arranging child components',
    options: [
      { key: 'direction', label: 'Direction', type: 'select', choices: ['row', 'column'], default: 'row' },
      { key: 'gap', label: 'Gap (px)', type: 'number', default: 8 },
      { key: 'wrap', label: 'Wrap', type: 'boolean', default: false },
      { key: 'justify', label: 'Justify', type: 'select', choices: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], default: 'flex-start' },
      { key: 'align', label: 'Align', type: 'select', choices: ['flex-start', 'center', 'flex-end', 'stretch'], default: 'center' }
    ]
  },
  {
    name: 'FlexItem',
    label: 'Flex Item',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Child element within a Flex container',
    options: []
  },
  {
    name: 'ToolbarGroup',
    label: 'Toolbar Group',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'toolbar',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Groups toolbar buttons with visual separator',
    options: []
  },
  {
    name: 'ToolbarButton',
    label: 'Toolbar Button',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'toolbar',
    defaultAttribute: 'boolean',
    canHaveChildren: false,
    description: 'Individual button in the block toolbar',
    options: [
      { key: 'icon', label: 'Icon', type: 'text', default: '', hint: 'Dashicon name or SVG' },
      { key: 'title', label: 'Tooltip title', type: 'text', default: '' },
      { key: 'isActive', label: 'Active state', type: 'boolean', default: false }
    ]
  },
  {
    name: 'ButtonGroup',
    label: 'Button Group',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Grouped button container without spacing',
    options: []
  },
  {
    name: 'MenuGroup',
    label: 'Menu Group',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Groups menu items with optional label',
    options: [
      { key: 'label', label: 'Group label', type: 'text', default: '' }
    ]
  },
  {
    name: 'MenuItem',
    label: 'Menu Item',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Individual item within a menu group',
    options: [
      { key: 'icon', label: 'Icon', type: 'text', default: '' },
      { key: 'isDestructive', label: 'Destructive', type: 'boolean', default: false }
    ]
  },
  {
    name: 'Button',
    label: 'Button',
    category: 'interface',
    registryPackage: '@wordpress/components',
    color: categoryColors['interface'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: false,
    description: 'Clickable button with icon and variant support',
    options: [
      { key: 'variant', label: 'Variant', type: 'select', choices: ['primary', 'secondary', 'tertiary', 'link'], default: 'secondary' },
      { key: 'icon', label: 'Icon', type: 'text', default: '', hint: 'Dashicon name or SVG' },
      { key: 'isDestructive', label: 'Destructive', type: 'boolean', default: false },
      { key: 'isSmall', label: 'Small size', type: 'boolean', default: false }
    ]
  },

  // ── Color (@wordpress/block-editor + @wordpress/components) ─────

  {
    name: 'ColorPaletteControl',
    label: 'Color Palette Control',
    category: 'color',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['color'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Theme-aware color palette selector (uses editor color settings)',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: 'Color', hint: 'Label shown above the palette' }
    ]
  },
  {
    name: 'ContrastChecker',
    label: 'Contrast Checker',
    category: 'color',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['color'],
    context: 'inspector',
    defaultAttribute: 'null',
    canHaveChildren: false,
    description: 'WCAG 2.0 AA contrast validation between text and background colors',
    options: [
      { key: 'fontSize', label: 'Font size (px)', type: 'number', default: 14, hint: 'Text size for contrast calculation' }
    ]
  },
  {
    name: 'ColorGradientControl',
    label: 'Color Gradient Control',
    category: 'color',
    registryPackage: '@wordpress/block-editor',
    color: categoryColors['color'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Combined color and gradient picker using theme settings',
    options: [
      { key: 'label', label: 'Label', type: 'text', default: 'Color', hint: 'Label shown above the control' },
      { key: 'enableAlpha', label: 'Enable alpha', type: 'boolean', default: false, hint: 'Allow transparent colors' }
    ]
  },
  {
    name: 'ColorPalette',
    label: 'Color Palette',
    category: 'color',
    registryPackage: '@wordpress/components',
    color: categoryColors['color'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Preset color selection from a defined palette',
    options: [
      { key: 'clearable', label: 'Allow clear', type: 'boolean', default: true, hint: 'Show a clear/reset button' },
      { key: 'enableAlpha', label: 'Enable alpha', type: 'boolean', default: false }
    ]
  },
  {
    name: 'ColorPicker',
    label: 'Color Picker',
    category: 'color',
    registryPackage: '@wordpress/components',
    color: categoryColors['color'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Full custom color picker with hex/rgb input',
    options: [
      { key: 'enableAlpha', label: 'Enable alpha', type: 'boolean', default: false },
      { key: 'copyFormat', label: 'Copy format', type: 'select', choices: ['hex', 'hsl', 'rgb'], default: 'hex' }
    ]
  },
  {
    name: 'ColorIndicator',
    label: 'Color Indicator',
    category: 'color',
    registryPackage: '@wordpress/components',
    color: categoryColors['color'],
    context: 'any',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Visual color swatch display (non-interactive)',
    options: []
  },
  {
    name: 'GradientPicker',
    label: 'Gradient Picker',
    category: 'color',
    registryPackage: '@wordpress/components',
    color: categoryColors['color'],
    context: 'inspector',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'CSS gradient builder with visual stops editor',
    options: []
  },

  // ── UI (@wordpress/components) ────────────────────────────────

  {
    name: 'Notice',
    label: 'Notice',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'Notification message with status color and optional dismiss',
    options: [
      { key: 'status', label: 'Status', type: 'select', choices: ['info', 'success', 'warning', 'error'], default: 'info' },
      { key: 'isDismissible', label: 'Dismissible', type: 'boolean', default: true }
    ]
  },
  {
    name: 'Spinner',
    label: 'Spinner',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: false,
    description: 'Loading indicator animation',
    options: []
  },
  {
    name: 'Placeholder',
    label: 'Placeholder',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'editor',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Empty state placeholder with icon, label, and action buttons',
    options: [
      { key: 'icon', label: 'Icon', type: 'text', default: 'block-default', hint: 'Dashicon or SVG component' },
      { key: 'label', label: 'Label', type: 'text', default: '' }
    ]
  },
  {
    name: 'Tooltip',
    label: 'Tooltip',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'string',
    canHaveChildren: true,
    description: 'Hover tooltip wrapper for any element',
    options: [
      { key: 'text', label: 'Tooltip text', type: 'text', default: '' },
      { key: 'position', label: 'Position', type: 'select', choices: ['top', 'bottom', 'left', 'right'], default: 'top' }
    ]
  },
  {
    name: 'Icon',
    label: 'Icon',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'SVG icon display component',
    options: [
      { key: 'icon', label: 'Icon', type: 'text', default: '', hint: 'Dashicon name or SVG component' },
      { key: 'size', label: 'Size (px)', type: 'number', default: 24 }
    ]
  },
  {
    name: 'Dashicon',
    label: 'Dashicon',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'string',
    canHaveChildren: false,
    description: 'WordPress Dashicon by name',
    options: [
      { key: 'icon', label: 'Dashicon name', type: 'text', default: 'admin-generic', hint: 'e.g., admin-post, format-image' }
    ]
  },
  {
    name: 'Disabled',
    label: 'Disabled',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Wrapper that disables all child input components',
    options: []
  },
  {
    name: 'Dropdown',
    label: 'Dropdown',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Dropdown toggle that reveals content on click',
    options: [
      { key: 'position', label: 'Position', type: 'select', choices: ['top left', 'top right', 'bottom left', 'bottom right'], default: 'bottom left' }
    ]
  },
  {
    name: 'DropdownMenu',
    label: 'Dropdown Menu',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: false,
    description: 'Icon-triggered dropdown menu with actions',
    options: [
      { key: 'icon', label: 'Trigger icon', type: 'text', default: 'ellipsis', hint: 'Dashicon name for the trigger button' },
      { key: 'label', label: 'Accessible label', type: 'text', default: 'More options' }
    ]
  },
  {
    name: 'Modal',
    label: 'Modal',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Modal dialog overlay with focus trapping',
    options: [
      { key: 'title', label: 'Title', type: 'text', default: '' },
      { key: 'isDismissible', label: 'Show close button', type: 'boolean', default: true }
    ]
  },
  {
    name: 'TabPanel',
    label: 'Tab Panel',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'string',
    canHaveChildren: true,
    description: 'Tabbed content interface with multiple panels',
    options: [
      { key: 'orientation', label: 'Orientation', type: 'select', choices: ['horizontal', 'vertical'], default: 'horizontal' }
    ]
  },
  {
    name: 'Popover',
    label: 'Popover',
    category: 'ui',
    registryPackage: '@wordpress/components',
    color: categoryColors['ui'],
    context: 'any',
    defaultAttribute: 'null',
    canHaveChildren: true,
    description: 'Floating content container anchored to a trigger element',
    options: [
      { key: 'position', label: 'Position', type: 'select', choices: ['top', 'bottom', 'left', 'right'], default: 'bottom' },
      { key: 'noArrow', label: 'Hide arrow', type: 'boolean', default: false }
    ]
  }
]

/**
 * Find a registry entry by its component name (e.g. 'RichText')
 */
export function findRegistryEntry(name: string): RegistryEntry | undefined {
  return wpComponentRegistry.find(entry => entry.name === name)
}

/**
 * Get all registry entries for a given category
 */
export function getEntriesByCategory(category: ComponentCategory): RegistryEntry[] {
  return wpComponentRegistry.filter(entry => entry.category === category)
}

/**
 * Get all registry entries for a given context
 */
export function getEntriesByContext(context: ComponentContext): RegistryEntry[] {
  return wpComponentRegistry.filter(entry => entry.context === context || entry.context === 'any')
}

/**
 * Get all unique categories present in the registry
 */
export function getCategories(): ComponentCategory[] {
  return [...new Set(wpComponentRegistry.map(entry => entry.category))]
}

/**
 * Search registry entries by name or label (case-insensitive)
 */
export function searchRegistry(query: string): RegistryEntry[] {
  const q = query.toLowerCase()
  return wpComponentRegistry.filter(
    entry => entry.name.toLowerCase().includes(q)
      || entry.label.toLowerCase().includes(q)
      || entry.description.toLowerCase().includes(q)
  )
}
