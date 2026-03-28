<script setup lang="ts">
import type { RegistryEntry, ComponentCategory } from '~~/shared/wpComponentRegistry'
import { wpComponentRegistry, findRegistryEntry, getCategories } from '~~/shared/wpComponentRegistry'
import type { ComponentItem } from '~/stores/componentStore'

const props = defineProps<{
  open: boolean
  editItem?: ComponentItem | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'save': [data: { registryName: string, options: Record<string, unknown>, notes: string }]
}>()

// ── State ────────────────────────────────────────────────────

const searchQuery = ref('')
const activeCategory = ref<ComponentCategory | null>(null)
const selectedEntry = ref<RegistryEntry | null>(null)
const optionValues = ref<Record<string, unknown>>({})
const notes = ref('')

const categories = getCategories()

const categoryIcons: Record<ComponentCategory, string> = {
  text: 'i-lucide-type',
  media: 'i-lucide-image',
  layout: 'i-lucide-layout-grid',
  interactive: 'i-lucide-mouse-pointer',
  embed: 'i-lucide-code'
}

// ── Computed ─────────────────────────────────────────────────

const isEditMode = computed(() => !!props.editItem)

const modalTitle = computed(() => {
  if (isEditMode.value) return `Edit ${selectedEntry.value?.label ?? 'Component'}`
  if (selectedEntry.value) return `Configure ${selectedEntry.value.label}`
  return 'Add Component'
})

const filteredEntries = computed(() => {
  let entries = wpComponentRegistry

  if (activeCategory.value) {
    entries = entries.filter(e => e.category === activeCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    entries = entries.filter(e =>
      e.label.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)
    )
  }

  return entries
})

// ── Watchers ─────────────────────────────────────────────────

watch(() => props.editItem, (item) => {
  if (item) {
    const entry = findRegistryEntry(item.registryName)
    if (entry) {
      selectedEntry.value = entry
      optionValues.value = { ...item.options }
      notes.value = item.notes
    }
  }
}, { immediate: true })

watch(() => props.open, (open) => {
  if (!open) {
    setTimeout(resetState, 300)
  }
})

// ── Actions ──────────────────────────────────────────────────

function resetState() {
  if (!props.editItem) {
    selectedEntry.value = null
  }
  optionValues.value = {}
  notes.value = ''
  searchQuery.value = ''
  activeCategory.value = null
}

function selectEntry(entry: RegistryEntry) {
  selectedEntry.value = entry
  optionValues.value = {}
  for (const opt of entry.options) {
    optionValues.value[opt.key] = opt.default ?? (opt.type === 'boolean' ? false : '')
  }
  notes.value = ''
}

function goBack() {
  if (isEditMode.value) {
    emit('update:open', false)
    return
  }
  selectedEntry.value = null
  optionValues.value = {}
  notes.value = ''
}

function toggleCategory(cat: ComponentCategory) {
  activeCategory.value = activeCategory.value === cat ? null : cat
}

function save() {
  if (!selectedEntry.value) return
  emit('save', {
    registryName: selectedEntry.value.name,
    options: { ...optionValues.value },
    notes: notes.value
  })
  emit('update:open', false)
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}


</script>

<template>
  <UModal
    :open="open"
    :title="modalTitle"
    :ui="{ width: 'sm:max-w-lg' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <!-- Step 1: Search & Select Component -->
      <div v-if="!selectedEntry" class="space-y-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search components..."
          icon="i-lucide-search"
          autofocus
        />

        <!-- Category filters -->
        <div class="flex gap-2 flex-wrap">
          <UButton
            v-for="cat in categories"
            :key="cat"
            :label="capitalize(cat)"
            :icon="categoryIcons[cat]"
            :variant="activeCategory === cat ? 'solid' : 'outline'"
            size="xs"
            @click="toggleCategory(cat)"
          />
        </div>

        <!-- Results list -->
        <div class="max-h-72 overflow-y-auto space-y-1">
          <button
            v-for="entry in filteredEntries"
            :key="entry.name"
            class="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
            @click="selectEntry(entry)"
          >
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0"
              :style="{ backgroundColor: entry.color }"
            />
            <div class="min-w-0 flex-1">
              <div class="font-medium text-sm">
                {{ entry.label }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ entry.name }}
              </div>
            </div>
            <UBadge
              :label="entry.canHaveChildren ? 'container' : 'leaf'"
              :color="entry.canHaveChildren ? 'warning' : 'neutral'"
              variant="subtle"
              size="xs"
            />
          </button>

          <p
            v-if="filteredEntries.length === 0"
            class="text-center text-sm text-gray-400 py-6"
          >
            No components found.
          </p>
        </div>
      </div>

      <!-- Step 2: Configure Options -->
      <div v-else class="space-y-4">
        <!-- Component info -->
        <div class="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <span
            class="w-3 h-3 rounded-full shrink-0"
            :style="{ backgroundColor: selectedEntry.color }"
          />
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ selectedEntry.name }}</span>
          <UBadge :label="selectedEntry.category" variant="subtle" size="xs" class="ml-auto" />
        </div>

        <!-- Dynamic options form -->
        <template v-if="selectedEntry.options.length > 0">
          <div v-for="opt in selectedEntry.options" :key="opt.key">
            <!-- Boolean → USwitch -->
            <USwitch
              v-if="opt.type === 'boolean'"
              :model-value="!!optionValues[opt.key]"
              :label="opt.label"
              @update:model-value="optionValues[opt.key] = $event"
            />

            <!-- Select → USelect -->
            <UFormField v-else-if="opt.type === 'select'" :label="opt.label">
              <USelect
                :model-value="String(optionValues[opt.key] ?? '')"
                :items="(opt.choices ?? []).map(c => ({ label: c, value: c }))"
                class="w-full"
                @update:model-value="optionValues[opt.key] = $event"
              />
            </UFormField>

            <!-- Number → UInput type=number -->
            <UFormField v-else-if="opt.type === 'number'" :label="opt.label">
              <UInput
                :model-value="String(optionValues[opt.key] ?? '')"
                type="number"
                class="w-full"
                @update:model-value="optionValues[opt.key] = $event"
              />
            </UFormField>

            <!-- Color → UInput -->
            <UFormField v-else-if="opt.type === 'color'" :label="opt.label">
              <UInput
                :model-value="String(optionValues[opt.key] ?? '')"
                placeholder="#000000"
                class="w-full"
                @update:model-value="optionValues[opt.key] = $event"
              />
            </UFormField>

            <!-- Text (default) → UInput -->
            <UFormField v-else :label="opt.label">
              <UInput
                :model-value="String(optionValues[opt.key] ?? '')"
                class="w-full"
                @update:model-value="optionValues[opt.key] = $event"
              />
            </UFormField>
          </div>
        </template>
        <p v-else class="text-sm text-gray-400">
          No configuration options for this component.
        </p>

        <!-- Notes -->
        <UFormField label="Notes" hint="Optional">
          <UTextarea
            v-model="notes"
            placeholder="Describe the purpose or content of this component..."
            :rows="3"
            autoresize
            class="w-full"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton
          v-if="selectedEntry && !isEditMode"
          label="Back"
          icon="i-lucide-arrow-left"
          variant="ghost"
          @click="goBack"
        />
        <div v-else />

        <div class="flex gap-2">
          <UButton
            label="Cancel"
            variant="outline"
            @click="emit('update:open', false)"
          />
          <UButton
            v-if="selectedEntry"
            :label="isEditMode ? 'Save Changes' : 'Add Component'"
            icon="i-lucide-check"
            color="primary"
            @click="save"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
