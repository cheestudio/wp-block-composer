// WordPress Component Registry
// Shared between client (pages/) and server (server/) via Nuxt shared/ directory

export type ComponentCategory = 'text' | 'media' | 'layout' | 'interactive' | 'embed'

export interface RegistryOption {
  key: string
  label: string
  type: 'select' | 'boolean' | 'text' | 'number' | 'color'
  choices?: string[]
  default?: unknown
}

export interface RegistryEntry {
  name: string
  label: string
  category: ComponentCategory
  color: string
  canHaveChildren: boolean
  innerBlocksRequired: boolean
  saveJsTemplate: string
  options: RegistryOption[]
}

const categoryColors: Record<ComponentCategory, string> = {
  text: '#3b82f6',
  media: '#8b5cf6',
  layout: '#f59e0b',
  interactive: '#10b981',
  embed: '#ef4444'
}

export const wpComponentRegistry: RegistryEntry[] = [
  // ── Text ──────────────────────────────────────────────────
  {
    name: 'core/paragraph',
    label: 'Paragraph',
    category: 'text',
    color: categoryColors.text,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<RichText.Content tagName="p" value={ attributes.content } />',
    options: [
      { key: 'placeholder', label: 'Placeholder text', type: 'text', default: '' },
      { key: 'dropCap', label: 'Drop cap', type: 'boolean', default: false }
    ]
  },
  {
    name: 'core/heading',
    label: 'Heading',
    category: 'text',
    color: categoryColors.text,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<RichText.Content tagName={ `h${ attributes.level }` } value={ attributes.content } />',
    options: [
      { key: 'level', label: 'Heading level', type: 'select', choices: ['1', '2', '3', '4', '5', '6'], default: '2' },
      { key: 'placeholder', label: 'Placeholder text', type: 'text', default: '' }
    ]
  },
  {
    name: 'core/list',
    label: 'List',
    category: 'text',
    color: categoryColors.text,
    canHaveChildren: true,
    innerBlocksRequired: true,
    saveJsTemplate: '',
    options: [
      { key: 'ordered', label: 'Ordered list', type: 'boolean', default: false },
      { key: 'reversed', label: 'Reversed', type: 'boolean', default: false },
      { key: 'start', label: 'Start value', type: 'number', default: 1 }
    ]
  },
  {
    name: 'core/list-item',
    label: 'List Item',
    category: 'text',
    color: categoryColors.text,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<li><RichText.Content value={ attributes.content } /></li>',
    options: [
      { key: 'placeholder', label: 'Placeholder text', type: 'text', default: '' }
    ]
  },
  {
    name: 'core/quote',
    label: 'Quote',
    category: 'text',
    color: categoryColors.text,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<blockquote><RichText.Content tagName="p" value={ attributes.value } /><RichText.Content tagName="cite" value={ attributes.citation } /></blockquote>',
    options: [
      { key: 'citation', label: 'Show citation', type: 'boolean', default: true }
    ]
  },
  {
    name: 'core/html',
    label: 'Custom HTML',
    category: 'text',
    color: categoryColors.text,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<RawHTML>{ attributes.content }</RawHTML>',
    options: []
  },

  // ── Media ─────────────────────────────────────────────────
  {
    name: 'core/image',
    label: 'Image',
    category: 'media',
    color: categoryColors.media,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<figure><img src={ attributes.url } alt={ attributes.alt } className={ `wp-image-${ attributes.id }` } /></figure>',
    options: [
      { key: 'linkTo', label: 'Link to', type: 'select', choices: ['none', 'media', 'attachment', 'custom'], default: 'none' },
      { key: 'sizeSlug', label: 'Image size', type: 'select', choices: ['thumbnail', 'medium', 'large', 'full'], default: 'large' }
    ]
  },
  {
    name: 'core/video',
    label: 'Video',
    category: 'media',
    color: categoryColors.media,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<figure><video controls src={ attributes.src } /></figure>',
    options: [
      { key: 'autoplay', label: 'Autoplay', type: 'boolean', default: false },
      { key: 'loop', label: 'Loop', type: 'boolean', default: false },
      { key: 'muted', label: 'Muted', type: 'boolean', default: false },
      { key: 'controls', label: 'Show controls', type: 'boolean', default: true }
    ]
  },
  {
    name: 'core/audio',
    label: 'Audio',
    category: 'media',
    color: categoryColors.media,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<figure><audio controls src={ attributes.src } /></figure>',
    options: [
      { key: 'autoplay', label: 'Autoplay', type: 'boolean', default: false },
      { key: 'loop', label: 'Loop', type: 'boolean', default: false }
    ]
  },
  {
    name: 'core/file',
    label: 'File',
    category: 'media',
    color: categoryColors.media,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<div><a href={ attributes.href }>{ attributes.fileName }</a><a href={ attributes.href } className="wp-block-file__button" download>Download</a></div>',
    options: [
      { key: 'showDownloadButton', label: 'Show download button', type: 'boolean', default: true },
      { key: 'displayPreview', label: 'Display inline preview', type: 'boolean', default: true }
    ]
  },
  {
    name: 'core/gallery',
    label: 'Gallery',
    category: 'media',
    color: categoryColors.media,
    canHaveChildren: true,
    innerBlocksRequired: true,
    saveJsTemplate: '',
    options: [
      { key: 'columns', label: 'Columns', type: 'number', default: 3 },
      { key: 'imageCrop', label: 'Crop images', type: 'boolean', default: true },
      { key: 'linkTo', label: 'Link to', type: 'select', choices: ['none', 'media', 'attachment'], default: 'none' }
    ]
  },

  // ── Layout ────────────────────────────────────────────────
  {
    name: 'core/group',
    label: 'Group',
    category: 'layout',
    color: categoryColors.layout,
    canHaveChildren: true,
    innerBlocksRequired: true,
    saveJsTemplate: '',
    options: [
      { key: 'tagName', label: 'HTML element', type: 'select', choices: ['div', 'header', 'main', 'section', 'article', 'aside', 'footer'], default: 'div' },
      { key: 'layout', label: 'Layout', type: 'select', choices: ['default', 'constrained', 'flex', 'grid'], default: 'default' }
    ]
  },
  {
    name: 'core/columns',
    label: 'Columns',
    category: 'layout',
    color: categoryColors.layout,
    canHaveChildren: true,
    innerBlocksRequired: true,
    saveJsTemplate: '',
    options: [
      { key: 'isStackedOnMobile', label: 'Stack on mobile', type: 'boolean', default: true },
      { key: 'verticalAlignment', label: 'Vertical alignment', type: 'select', choices: ['top', 'center', 'bottom', 'stretch'], default: 'top' }
    ]
  },
  {
    name: 'core/column',
    label: 'Column',
    category: 'layout',
    color: categoryColors.layout,
    canHaveChildren: true,
    innerBlocksRequired: true,
    saveJsTemplate: '',
    options: [
      { key: 'width', label: 'Width (%)', type: 'text', default: '' },
      { key: 'verticalAlignment', label: 'Vertical alignment', type: 'select', choices: ['top', 'center', 'bottom', 'stretch'], default: 'top' }
    ]
  },
  {
    name: 'core/cover',
    label: 'Cover',
    category: 'layout',
    color: categoryColors.layout,
    canHaveChildren: true,
    innerBlocksRequired: true,
    saveJsTemplate: '',
    options: [
      { key: 'dimRatio', label: 'Overlay opacity', type: 'number', default: 50 },
      { key: 'overlayColor', label: 'Overlay color', type: 'color', default: '#000000' },
      { key: 'minHeight', label: 'Minimum height (px)', type: 'number', default: 430 },
      { key: 'hasParallax', label: 'Fixed background', type: 'boolean', default: false }
    ]
  },
  {
    name: 'core/media-text',
    label: 'Media & Text',
    category: 'layout',
    color: categoryColors.layout,
    canHaveChildren: true,
    innerBlocksRequired: true,
    saveJsTemplate: '',
    options: [
      { key: 'mediaPosition', label: 'Media position', type: 'select', choices: ['left', 'right'], default: 'left' },
      { key: 'mediaWidth', label: 'Media width (%)', type: 'number', default: 50 },
      { key: 'isStackedOnMobile', label: 'Stack on mobile', type: 'boolean', default: true },
      { key: 'imageFill', label: 'Crop image to fill', type: 'boolean', default: false }
    ]
  },
  {
    name: 'core/buttons',
    label: 'Buttons',
    category: 'layout',
    color: categoryColors.layout,
    canHaveChildren: true,
    innerBlocksRequired: true,
    saveJsTemplate: '',
    options: [
      { key: 'layout', label: 'Layout', type: 'select', choices: ['horizontal', 'vertical'], default: 'horizontal' }
    ]
  },
  {
    name: 'core/button',
    label: 'Button',
    category: 'layout',
    color: categoryColors.layout,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<div className="wp-block-button"><RichText.Content tagName="a" className="wp-block-button__link" href={ attributes.url } value={ attributes.text } rel={ attributes.rel } /></div>',
    options: [
      { key: 'style', label: 'Style', type: 'select', choices: ['fill', 'outline'], default: 'fill' },
      { key: 'width', label: 'Width', type: 'select', choices: ['auto', '25', '50', '75', '100'], default: 'auto' },
      { key: 'placeholder', label: 'Placeholder text', type: 'text', default: '' }
    ]
  },
  {
    name: 'core/separator',
    label: 'Separator',
    category: 'layout',
    color: categoryColors.layout,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<hr className="wp-block-separator" />',
    options: [
      { key: 'style', label: 'Style', type: 'select', choices: ['default', 'wide', 'dots'], default: 'default' }
    ]
  },
  {
    name: 'core/spacer',
    label: 'Spacer',
    category: 'layout',
    color: categoryColors.layout,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<div style={ { height: attributes.height } } aria-hidden="true" className="wp-block-spacer" />',
    options: [
      { key: 'height', label: 'Height (px)', type: 'number', default: 100 }
    ]
  },

  // ── Interactive ───────────────────────────────────────────
  {
    name: 'core/search',
    label: 'Search',
    category: 'interactive',
    color: categoryColors.interactive,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '',
    options: [
      { key: 'label', label: 'Label text', type: 'text', default: 'Search' },
      { key: 'showLabel', label: 'Show label', type: 'boolean', default: true },
      { key: 'placeholder', label: 'Placeholder', type: 'text', default: '' },
      { key: 'buttonText', label: 'Button text', type: 'text', default: 'Search' },
      { key: 'buttonPosition', label: 'Button position', type: 'select', choices: ['button-outside', 'button-inside', 'no-button'], default: 'button-outside' }
    ]
  },
  {
    name: 'core/navigation',
    label: 'Navigation',
    category: 'interactive',
    color: categoryColors.interactive,
    canHaveChildren: true,
    innerBlocksRequired: true,
    saveJsTemplate: '',
    options: [
      { key: 'overlayMenu', label: 'Overlay menu', type: 'select', choices: ['never', 'mobile', 'always'], default: 'mobile' },
      { key: 'hasIcon', label: 'Show icon', type: 'boolean', default: true }
    ]
  },

  // ── Embed ─────────────────────────────────────────────────
  {
    name: 'core/embed',
    label: 'Embed',
    category: 'embed',
    color: categoryColors.embed,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<figure><div className="wp-block-embed__wrapper">{ attributes.url }</div></figure>',
    options: [
      { key: 'providerNameSlug', label: 'Provider', type: 'select', choices: ['youtube', 'vimeo', 'twitter', 'spotify', 'soundcloud', 'wordpress', 'other'], default: 'other' },
      { key: 'responsive', label: 'Responsive', type: 'boolean', default: true }
    ]
  },
  {
    name: 'core/shortcode',
    label: 'Shortcode',
    category: 'embed',
    color: categoryColors.embed,
    canHaveChildren: false,
    innerBlocksRequired: false,
    saveJsTemplate: '<RawHTML>{ attributes.text }</RawHTML>',
    options: []
  }
]

/**
 * Find a registry entry by its component name (e.g. 'core/paragraph')
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
    entry => entry.name.toLowerCase().includes(q) || entry.label.toLowerCase().includes(q)
  )
}
