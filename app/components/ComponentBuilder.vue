<script setup lang="ts">
import type { ComponentItem } from '~/stores/componentStore'

const componentStore = useComponentStore()

const pickerOpen = ref(false)
const editingItem = ref<ComponentItem | null>(null)

function openAddModal() {
  editingItem.value = null
  pickerOpen.value = true
}

function openEditModal(item: ComponentItem) {
  editingItem.value = item
  pickerOpen.value = true
}

function handleSave(data: { registryName: string, options: Record<string, unknown>, attributeValue: string, attributeType: string }) {
  if (editingItem.value) {
    componentStore.updateComponent(editingItem.value.id, {
      options: data.options,
      attributeValue: data.attributeValue,
      attributeType: data.attributeType
    })
  } else {
    componentStore.addComponent(data.registryName, data.options, data.attributeValue, data.attributeType)
  }
  editingItem.value = null
}

function handleModalClose(open: boolean) {
  pickerOpen.value = open
  if (!open) {
    editingItem.value = null
  }
}

const componentCount = computed(() => componentStore.items.length)
const maxDepth = computed(() => {
  const flat = componentStore.flatOrdered
  return flat.length > 0 ? Math.max(...flat.map(f => f.depth)) + 1 : 0
})
</script>

<template>
  <div>
    <!-- Empty state -->
    <div
      v-if="componentStore.isEmpty"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <UIcon name="i-lucide-blocks" class="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
        No components yet
      </h3>
      <p class="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-md">
        Add developer components from the @wordpress library to compose your block's editor interface. Arrange them into a tree that mirrors the edit.js JSX structure.
      </p>
      <UButton
        label="Add Component"
        icon="i-lucide-plus"
        color="primary"
        size="lg"
        @click="openAddModal"
      />
    </div>

    <!-- Component list -->
    <div v-else>
      <!-- Summary bar -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ componentCount }} component{{ componentCount !== 1 ? 's' : '' }}
            <template v-if="maxDepth > 1"> &middot; {{ maxDepth }} levels deep</template>
          </span>
          <UBadge
            v-if="componentStore.hasContainerWithoutChildren"
            label="Empty containers"
            icon="i-lucide-alert-triangle"
            color="warning"
            variant="subtle"
            size="xs"
          />
        </div>

        <UButton
          label="Add Component"
          icon="i-lucide-plus"
          color="primary"
          size="sm"
          @click="openAddModal"
        />
      </div>

      <!-- Order list -->
      <ComponentOrderList @edit="openEditModal" />
    </div>

    <!-- Picker modal -->
    <ComponentPickerModal
      :open="pickerOpen"
      :edit-item="editingItem"
      @update:open="handleModalClose"
      @save="handleSave"
    />
  </div>
</template>
