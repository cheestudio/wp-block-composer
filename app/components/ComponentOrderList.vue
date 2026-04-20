<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { findRegistryEntry } from '~~/shared/wpComponentRegistry'
import type { ComponentItem, FlatOrderedItem } from '~/stores/componentStore'

const contextLabels: Record<string, string> = {
  editor: 'Editor',
  inspector: 'Sidebar',
  toolbar: 'Toolbar',
  save: 'Save',
  any: 'Any'
}

const emit = defineEmits<{
  edit: [item: ComponentItem]
}>()

const componentStore = useComponentStore()

// Local mutable copy for drag-and-drop
const dragList = ref<FlatOrderedItem[]>([])

watch(
  () => componentStore.flatOrdered,
  (val) => {
    dragList.value = val.map(flatItem => ({ item: flatItem.item, depth: flatItem.depth }))
  },
  { immediate: true }
)

function onDragEnd() {
  componentStore.reorder(dragList.value.map(flatItem => flatItem.item.id))
}

function getRegistryEntry(registryName: string) {
  return findRegistryEntry(registryName)
}

function formatOptions(options: Record<string, unknown>): string {
  const entries = Object.entries(options).filter(([, value]) => value !== '' && value !== false && value !== undefined)
  if (entries.length === 0) return ''
  return entries.map(([key, value]) => `${key}: ${value}`).join(', ')
}

function getRowActions(flatItem: FlatOrderedItem) {
  const id = flatItem.item.id
  return [
    [
      { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => emit('edit', flatItem.item) },
      { label: 'Duplicate', icon: 'i-lucide-copy', onSelect: () => componentStore.duplicateComponent(id) }
    ],
    [
      { label: 'Indent', icon: 'i-lucide-indent-increase', onSelect: () => componentStore.indent(id), disabled: !componentStore.canIndent(id) },
      { label: 'Outdent', icon: 'i-lucide-indent-decrease', onSelect: () => componentStore.outdent(id), disabled: !componentStore.canOutdent(id) }
    ],
    [
      { label: 'Delete', icon: 'i-lucide-trash-2', onSelect: () => componentStore.removeComponent(id), color: 'error' as const }
    ]
  ]
}

function isEmptyContainer(item: ComponentItem): boolean {
  const entry = findRegistryEntry(item.registryName)
  if (!entry?.canHaveChildren) return false
  return !componentStore.items.some(child => child.parentId === item.id)
}
</script>

<template>
  <VueDraggable
    v-model="dragList"
    :animation="150"
		display="nested"
    handle=".drag-handle"
    @end="onDragEnd"
  >
    <div
      v-for="flatItem in dragList"
      :key="flatItem.item.id"
      class="mb-2"
      :style="{ paddingLeft: `${flatItem.depth * 1.5}rem` }"
    >
      <UCard
        :ui="{
          root: 'ring-1 ring-gray-200 dark:ring-gray-700',
          body: 'p-3 sm:p-3'
        }"
      >
        <div class="flex items-center gap-3">
          <!-- Drag handle -->
          <button class="drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0">
            <UIcon name="i-lucide-grip-vertical" class="w-4 h-4" />
          </button>

          <!-- Category color dot -->
          <span
            class="w-2.5 h-2.5 rounded-full shrink-0"
            :style="{ backgroundColor: getRegistryEntry(flatItem.item.registryName)?.color ?? '#888' }"
          />

          <!-- Component info -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-medium text-sm">{{ flatItem.item.label }}</span>
              <span class="text-[13px] text-gray-400 dark:text-gray-500">{{ getRegistryEntry(flatItem.item.registryName)?.registryPackage.replace('@wordpress/', '@wp/') }}</span>
              <UBadge
                v-if="getRegistryEntry(flatItem.item.registryName)?.context"
                :label="contextLabels[getRegistryEntry(flatItem.item.registryName)!.context]"
                variant="subtle"
                size="sm"
              />
              <UBadge
                v-if="getRegistryEntry(flatItem.item.registryName)?.canHaveChildren"
                label="container"
                variant="subtle"
                color="warning"
                size="sm"
              />
            </div>

            <!-- Options summary -->
            <div
              v-if="formatOptions(flatItem.item.options)"
              class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5"
            >
              {{ formatOptions(flatItem.item.options) }}
            </div>

            <!-- Attribute value preview -->
            <div
              v-if="flatItem.item.attributeValue"
              class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5"
            >
              attr: <span class="font-mono">{{ flatItem.item.attributeValue }}</span>
              <template v-if="flatItem.item.attributeType">
                <span class="ml-1">({{ flatItem.item.attributeType }})</span>
              </template>
            </div>
          </div>

          <!-- Row actions -->
          <UDropdownMenu
            :items="getRowActions(flatItem)"
            :content="{ align: 'end' as const }"
          >
            <UButton
              icon="i-lucide-ellipsis-vertical"
              variant="ghost"
              color="neutral"
              size="sm"
            />
          </UDropdownMenu>
        </div>
      </UCard>

      <!-- Empty container warning -->
      <UAlert
        v-if="isEmptyContainer(flatItem.item)"
        title="Empty container"
        description="Add or indent components into this container."
        icon="i-lucide-alert-triangle"
        color="warning"
        variant="subtle"
        class="mt-1"
        :ui="{ root: 'py-2' }"
      />
    </div>
  </VueDraggable>
</template>
