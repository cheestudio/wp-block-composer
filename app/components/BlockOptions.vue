<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { BlockOptionsSchema } from '~/types/schemas/blockJsonSchema'

const blockConfigStore = useBlockConfigStore()
const toast = useToast()

const alignOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Wide', value: 'wide' },
  { label: 'Full', value: 'full' },
]

const spacingSideOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
]

const layoutTypeItems = [
  { label: 'Constrained', value: 'constrained' },
  { label: 'Flex', value: 'flex' },
  { label: 'Grid', value: 'grid' },
]

const categoryItems = [
  { label: 'Text', value: 'text' },
  { label: 'Media', value: 'media' },
  { label: 'Design', value: 'design' },
  { label: 'Widgets', value: 'widgets' },
  { label: 'Theme', value: 'theme' },
  { label: 'Embed', value: 'embed' },
]

const apiVersionItems = [
  { label: 'Version 1', value: 1 },
  { label: 'Version 2', value: 2 },
  { label: 'Version 3 (recommended)', value: 3 },
]

const state = reactive<Partial<BlockOptionsSchema>>({
  name: '',
  title: '',
  description: '',
  category: 'text',
  icon: '',
  keywords: [],
  textdomain: '',
  apiVersion: 3,
  version: '0.1.0',
  parent: [],
  ancestor: [],
  allowedBlocks: [],
  supports: {
    anchor: false,
    align: false,
    alignWide: true,
    className: true,
    customClassName: true,
    html: true,
    inserter: true,
    multiple: true,
    reusable: true,
    lock: true,
    renaming: true,
    splitting: false,
    color: {
      text: true,
      background: true,
      link: false,
      gradients: false,
      heading: false,
      button: false,
    },
    typography: {
      fontSize: false,
      lineHeight: false,
      textAlign: false,
    },
    spacing: {
      margin: false,
      padding: false,
    },
    dimensions: {
      minHeight: false,
      aspectRatio: false,
    },
    border: {
      radius: false,
      color: false,
      width: false,
      style: false,
    },
    layout: false,
    position: {
      sticky: false,
    },
  },
})

const alignSelected = ref<string[]>([])
const marginSides = ref<string[]>([])
const paddingSides = ref<string[]>([])
const layoutEnabled = ref(false)
const layoutDefaultType = ref<'constrained' | 'flex' | 'grid' | undefined>(undefined)
const layoutAllowSwitching = ref(false)
const layoutAllowInheriting = ref(true)
const layoutAllowVerticalAlignment = ref(true)
const layoutAllowJustification = ref(true)
const layoutAllowOrientation = ref(true)
const marginEnabled = ref(false)
const paddingEnabled = ref(false)

watch(alignSelected, (val) => {
  if (!state.supports) return
  if (val.length === 0) state.supports.align = false
  else if (val.length === alignOptions.length) state.supports.align = true
  else state.supports.align = val as ('left' | 'center' | 'right' | 'wide' | 'full')[]
})

watch(marginEnabled, (val) => {
  if (!state.supports?.spacing) return
  if (!val) {
    state.supports.spacing.margin = false
    marginSides.value = []
  } else {
    state.supports.spacing.margin = marginSides.value.length ? marginSides.value as any : true
  }
})

watch(marginSides, (val) => {
  if (!state.supports?.spacing || !marginEnabled.value) return
  state.supports.spacing.margin = val.length === spacingSideOptions.length ? true : val.length ? val as any : true
})

watch(paddingEnabled, (val) => {
  if (!state.supports?.spacing) return
  if (!val) {
    state.supports.spacing.padding = false
    paddingSides.value = []
  } else {
    state.supports.spacing.padding = paddingSides.value.length ? paddingSides.value as any : true
  }
})

watch(paddingSides, (val) => {
  if (!state.supports?.spacing || !paddingEnabled.value) return
  state.supports.spacing.padding = val.length === spacingSideOptions.length ? true : val.length ? val as any : true
})

watch(layoutEnabled, (val) => {
  if (!state.supports) return
  if (!val) {
    state.supports.layout = false
  } else {
    syncLayoutObject()
  }
})

const syncLayoutObject = () => {
  if (!state.supports || !layoutEnabled.value) return
  state.supports.layout = {
    allowSwitching: layoutAllowSwitching.value,
    allowInheriting: layoutAllowInheriting.value,
    allowVerticalAlignment: layoutAllowVerticalAlignment.value,
    allowJustification: layoutAllowJustification.value,
    allowOrientation: layoutAllowOrientation.value,
    default: layoutDefaultType.value ? { type: layoutDefaultType.value } : undefined,
  }
}

watch([layoutAllowSwitching, layoutAllowInheriting, layoutAllowVerticalAlignment, layoutAllowJustification, layoutAllowOrientation, layoutDefaultType], syncLayoutObject)

const handleSubmit = (event: FormSubmitEvent<BlockOptionsSchema>) => {
  blockConfigStore.setBlockOptions(event.data)

	toast.add({
		title: 'Block configuration saved',
		description: 'Your block configuration has been saved.',
		color: 'success',
	})
}

</script>

<template>
  <div>
    <h3 class="text-lg font-semibold mb-1">
      Block Configuration
    </h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      Define the core metadata for your <code class="text-xs">block.json</code>.
    </p>

    <UForm
      :schema="BlockOptionsSchema"
      :state="state"
      class="space-y-0"
      @submit="handleSubmit"
    >
      <div class="space-y-10">

        <!-- Core Metadata -->
        <div>
          <h4 class="text-base font-semibold mb-5">Core Metadata</h4>
          <div class="space-y-5">
            <UFormField
              label="Block Name"
              name="name"
              required
              hint="namespace/block-name — lowercase letters, numbers, and hyphens only"
            >
              <UInput
                v-model="state.name"
                placeholder="my-plugin/my-block"
                class="w-full"
                aria-label="Block name"
                aria-required="true"
                autocomplete="off"
              />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <UFormField label="Title" name="title" required>
                <UInput
                  v-model="state.title"
                  placeholder="My Block"
                  class="w-full"
                  aria-label="Block title"
                  aria-required="true"
                />
              </UFormField>

              <UFormField label="API Version" name="apiVersion">
                <USelect
                  v-model="state.apiVersion"
                  :items="apiVersionItems"
                  class="w-full"
                  aria-label="WordPress Block API version"
                />
              </UFormField>
            </div>

            <UFormField label="Description" name="description" hint="Max 400 characters">
              <UTextarea
                v-model="state.description"
                placeholder="A brief description of what this block does."
                :rows="3"
                autoresize
                class="w-full"
                aria-label="Block description"
              />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <UFormField label="Category" name="category">
                <USelect
                  v-model="state.category"
                  :items="categoryItems"
                  class="w-full"
                  aria-label="Block category"
                />
              </UFormField>

              <UFormField label="Icon" name="icon" hint="Dashicons identifier or leave blank">
                <UInput
                  v-model="state.icon"
                  placeholder="star-filled"
                  class="w-full"
                  aria-label="Block icon (Dashicons identifier)"
                >
                  <template #leading>
                    <span class="text-xs text-gray-400 select-none pl-1 pointer-events-none">dashicons-</span>
                  </template>
                </UInput>
              </UFormField>
            </div>

            <UFormField label="Keywords" name="keywords" hint="Up to 3 search keywords to help users discover your block">
              <UInputTags
                v-model="state.keywords"
                placeholder="Add keyword and press Enter…"
                class="w-full"
                aria-label="Block search keywords"
              />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <UFormField label="Text Domain" name="textdomain" hint="Matches your plugin or theme slug">
                <UInput
                  v-model="state.textdomain"
                  placeholder="my-plugin"
                  class="w-full"
                  aria-label="Text domain for internationalization"
                />
              </UFormField>

              <UFormField label="Version" name="version">
                <UInput
                  v-model="state.version"
                  placeholder="0.1.0"
                  class="w-full"
                  aria-label="Block version"
                />
              </UFormField>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Block Hierarchy -->
        <div>
          <h4 class="text-base font-semibold mb-1">Block Hierarchy</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Control where this block can appear and what it allows inside.</p>
          <div class="space-y-5">
            <UFormField
              label="Parent Blocks"
              name="parent"
              hint="Block becomes available only inside these direct parent blocks, e.g. core/group"
            >
              <UInputTags
                v-model="state.parent"
                placeholder="core/group — press Enter to add…"
                class="w-full"
                aria-label="Parent blocks"
              />
            </UFormField>

            <UFormField
              label="Ancestor Blocks"
              name="ancestor"
              hint="Block can be used anywhere inside these ancestor blocks, regardless of nesting depth"
            >
              <UInputTags
                v-model="state.ancestor"
                placeholder="core/columns — press Enter to add…"
                class="w-full"
                aria-label="Ancestor blocks"
              />
            </UFormField>

            <UFormField
              label="Allowed Nested Blocks"
              name="allowedBlocks"
              hint="Whitelist of blocks permitted as direct children of this block"
            >
              <UInputTags
                v-model="state.allowedBlocks"
                placeholder="core/paragraph — press Enter to add…"
                class="w-full"
                aria-label="Allowed nested blocks"
              />
            </UFormField>
          </div>
        </div>

        <USeparator />

        <!-- Supports: General -->
        <div>
          <h4 class="text-base font-semibold mb-1">Supports: General</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Core editor capabilities for this block.</p>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Anchor</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Exposes HTML anchor control</p>
                </div>
                <USwitch v-model="state.supports!.anchor" aria-label="Enable anchor support" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Align Wide</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Allow wide alignment if theme supports it</p>
                </div>
                <USwitch v-model="state.supports!.alignWide" aria-label="Enable align wide support" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Class Name</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Auto-add <code class="text-xs">.wp-block-*</code> class</p>
                </div>
                <USwitch v-model="state.supports!.className" aria-label="Enable className support" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Custom Class Name</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Show "Additional CSS class" field in Advanced</p>
                </div>
                <USwitch v-model="state.supports!.customClassName" aria-label="Enable custom class name support" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">HTML Edit</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Allow editing block HTML directly</p>
                </div>
                <USwitch v-model="state.supports!.html" aria-label="Enable HTML editing support" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Show in Inserter</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Display block in the inserter</p>
                </div>
                <USwitch v-model="state.supports!.inserter" aria-label="Enable inserter visibility" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Multiple</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Allow multiple instances per post</p>
                </div>
                <USwitch v-model="state.supports!.multiple" aria-label="Enable multiple instances support" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Reusable</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Allow conversion to reusable block</p>
                </div>
                <USwitch v-model="state.supports!.reusable" aria-label="Enable reusable block support" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Lock</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Allow user to change lock state</p>
                </div>
                <USwitch v-model="state.supports!.lock" aria-label="Enable lock support" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Renaming</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Allow user to rename the block</p>
                </div>
                <USwitch v-model="state.supports!.renaming" aria-label="Enable renaming support" />
              </div>

              <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium">Splitting</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Enable split on Enter / paste</p>
                </div>
                <USwitch v-model="state.supports!.splitting" aria-label="Enable splitting support" />
              </div>
            </div>

            <div class="p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium mb-1">Alignment Options</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Select which alignment values to enable. None = disabled, all = <code class="text-xs">true</code>, partial = array.</p>
              <div class="flex flex-wrap gap-4">
                <label
                  v-for="opt in alignOptions"
                  :key="opt.value"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <UCheckbox
                    :model-value="alignSelected.includes(opt.value)"
                    :aria-label="`Enable ${opt.label} alignment`"
                    @update:model-value="(checked) => {
                      if (checked) alignSelected = [...alignSelected, opt.value]
                      else alignSelected = alignSelected.filter(v => v !== opt.value)
                    }"
                  />
                  <span class="text-sm">{{ opt.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Supports: Color -->
        <div>
          <h4 class="text-base font-semibold mb-1">Supports: Color</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Color picker controls exposed in the editor sidebar.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Text Color</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Text color picker</p>
              </div>
              <USwitch v-model="state.supports!.color!.text" aria-label="Enable text color support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Background Color</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Background color picker</p>
              </div>
              <USwitch v-model="state.supports!.color!.background" aria-label="Enable background color support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Link Color</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Color picker for <code class="text-xs">&lt;a&gt;</code> elements</p>
              </div>
              <USwitch v-model="state.supports!.color!.link" aria-label="Enable link color support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Gradients</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Gradient picker for background</p>
              </div>
              <USwitch v-model="state.supports!.color!.gradients" aria-label="Enable gradient support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Heading Color</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Color picker for heading elements</p>
              </div>
              <USwitch v-model="state.supports!.color!.heading" aria-label="Enable heading color support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Button Color</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Color picker for button elements</p>
              </div>
              <USwitch v-model="state.supports!.color!.button" aria-label="Enable button color support" />
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Supports: Typography -->
        <div>
          <h4 class="text-base font-semibold mb-1">Supports: Typography</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Typography controls exposed in the editor sidebar.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Font Size</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Font size picker control</p>
              </div>
              <USwitch v-model="state.supports!.typography!.fontSize" aria-label="Enable font size support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Line Height</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Line height control</p>
              </div>
              <USwitch v-model="state.supports!.typography!.lineHeight" aria-label="Enable line height support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 sm:col-span-2">
              <div>
                <p class="text-sm font-medium">Text Align</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Text alignment toolbar (left / center / right)</p>
              </div>
              <USwitch v-model="state.supports!.typography!.textAlign" aria-label="Enable text align support" />
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Supports: Spacing -->
        <div>
          <h4 class="text-base font-semibold mb-1">Supports: Spacing</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Margin and padding controls. Optionally restrict to specific sides or axes.</p>
          <div class="space-y-4">
            <div class="p-3 rounded-md border border-gray-200 dark:border-gray-700 space-y-3">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-medium">Margin</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Enable margin controls</p>
                </div>
                <USwitch v-model="marginEnabled" aria-label="Enable margin support" />
              </div>
              <div v-if="marginEnabled" class="flex flex-wrap gap-4 pt-1 border-t border-gray-100 dark:border-gray-800">
                <label
                  v-for="side in spacingSideOptions"
                  :key="side.value"
                  class="flex items-center gap-2 cursor-pointer mt-2"
                >
                  <UCheckbox
                    :model-value="marginSides.includes(side.value)"
                    :aria-label="`Enable margin ${side.label}`"
                    @update:model-value="(checked) => {
                      if (checked) marginSides = [...marginSides, side.value]
                      else marginSides = marginSides.filter(v => v !== side.value)
                    }"
                  />
                  <span class="text-sm">{{ side.label }}</span>
                </label>
              </div>
            </div>

            <div class="p-3 rounded-md border border-gray-200 dark:border-gray-700 space-y-3">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-medium">Padding</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Enable padding controls</p>
                </div>
                <USwitch v-model="paddingEnabled" aria-label="Enable padding support" />
              </div>
              <div v-if="paddingEnabled" class="flex flex-wrap gap-4 pt-1 border-t border-gray-100 dark:border-gray-800">
                <label
                  v-for="side in spacingSideOptions"
                  :key="side.value"
                  class="flex items-center gap-2 cursor-pointer mt-2"
                >
                  <UCheckbox
                    :model-value="paddingSides.includes(side.value)"
                    :aria-label="`Enable padding ${side.label}`"
                    @update:model-value="(checked) => {
                      if (checked) paddingSides = [...paddingSides, side.value]
                      else paddingSides = paddingSides.filter(v => v !== side.value)
                    }"
                  />
                  <span class="text-sm">{{ side.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Supports: Dimensions -->
        <div>
          <h4 class="text-base font-semibold mb-1">Supports: Dimensions</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Dimension controls exposed in the editor sidebar.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Min Height</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Minimum height control</p>
              </div>
              <USwitch v-model="state.supports!.dimensions!.minHeight" aria-label="Enable min height support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Aspect Ratio</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Aspect ratio control</p>
              </div>
              <USwitch v-model="state.supports!.dimensions!.aspectRatio" aria-label="Enable aspect ratio support" />
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Supports: Border -->
        <div>
          <h4 class="text-base font-semibold mb-1">Supports: Border</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Border controls exposed in the editor sidebar.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Border Radius</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Corner radius control</p>
              </div>
              <USwitch v-model="state.supports!.border!.radius" aria-label="Enable border radius support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Border Color</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Border color picker</p>
              </div>
              <USwitch v-model="state.supports!.border!.color" aria-label="Enable border color support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Border Width</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Border width control</p>
              </div>
              <USwitch v-model="state.supports!.border!.width" aria-label="Enable border width support" />
            </div>

            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Border Style</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Border style (solid, dashed, dotted)</p>
              </div>
              <USwitch v-model="state.supports!.border!.style" aria-label="Enable border style support" />
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Supports: Layout -->
        <div>
          <h4 class="text-base font-semibold mb-1">Supports: Layout</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Layout controls for container blocks. Enable to reveal sub-options.</p>
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <div>
                <p class="text-sm font-medium">Enable Layout Support</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Enables layout controls for container blocks</p>
              </div>
              <USwitch v-model="layoutEnabled" aria-label="Enable layout support" />
            </div>

            <template v-if="layoutEnabled">
              <UFormField label="Default Layout Type" name="layoutDefaultType">
                <USelect
                  v-model="layoutDefaultType"
                  :items="layoutTypeItems"
                  placeholder="Select layout type…"
                  class="w-full"
                  aria-label="Default layout type"
                />
              </UFormField>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <div>
                    <p class="text-sm font-medium">Allow Switching</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Switcher for layout types</p>
                  </div>
                  <USwitch v-model="layoutAllowSwitching" aria-label="Allow layout switching" />
                </div>

                <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <div>
                    <p class="text-sm font-medium">Allow Inheriting</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Show "Inner blocks use content width"</p>
                  </div>
                  <USwitch v-model="layoutAllowInheriting" aria-label="Allow layout inheriting" />
                </div>

                <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <div>
                    <p class="text-sm font-medium">Vertical Alignment</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Vertical alignment controls (flex only)</p>
                  </div>
                  <USwitch v-model="layoutAllowVerticalAlignment" aria-label="Allow vertical alignment" />
                </div>

                <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <div>
                    <p class="text-sm font-medium">Justification</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Justify controls (flex and constrained)</p>
                  </div>
                  <USwitch v-model="layoutAllowJustification" aria-label="Allow justification" />
                </div>

                <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 sm:col-span-2">
                  <div>
                    <p class="text-sm font-medium">Orientation</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Orientation control (flex only)</p>
                  </div>
                  <USwitch v-model="layoutAllowOrientation" aria-label="Allow orientation" />
                </div>
              </div>
            </template>
          </div>
        </div>

        <USeparator />

        <!-- Supports: Position -->
        <div>
          <h4 class="text-base font-semibold mb-1">Supports: Position</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Positioning controls for the block.</p>
          <div class="flex items-center justify-between gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700">
            <div>
              <p class="text-sm font-medium">Sticky Position</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Sticky position relative to its container</p>
            </div>
            <USwitch v-model="state.supports!.position!.sticky" aria-label="Enable sticky position support" />
          </div>
        </div>

      </div>

      <div class="flex justify-end pt-10">
        <UButton
          type="submit"
          color="primary"
          size="md"
          aria-label="Save block configuration"
        >
          Save Configuration
        </UButton>
      </div>
    </UForm>
  </div>
</template>
