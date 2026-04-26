<script setup lang="ts">
const { items, flatOrdered, blockType, blockFileStore, toast } = useBlockContext()
const { generatedIndexJs } = storeToRefs(blockFileStore)

const isLoading = ref(false)

const formatted = computed(() => generatedIndexJs.value?.markdown ?? '')

const handleGenerate = async () => {
  if (!items.value.length) {
    toast.add({ title: 'No components', description: 'Add components in Step 1 first.', color: 'error' })
    return
  }
  isLoading.value = true
	await delay(1000);
  try {
    generatedIndexJs.value = await $fetch<{ markdown: string }>('/api/generateIndex', {
      method: 'POST',
      body: { componentObjects: items.value, blockType: blockType.value }
    })
  } catch {
    toast.add({ title: 'Generation failed', description: 'Could not build index.js.', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <GenerateFileLayout>
    <template #left-title>Selected Components</template>

    <template #left-content>
      <div v-if="items.length" class="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800">
        <div v-for="{ item } in flatOrdered" :key="item.id" class="px-4 py-3 flex items-center justify-between gap-3">
          <span class="text-sm font-medium">{{ item.label }}</span>
          <span class="text-xs font-mono text-gray-500 dark:text-gray-400 shrink-0">{{ item.registryName }}</span>
        </div>
      </div>
      <div v-else class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        No components in the tree.
      </div>
    </template>

    <template #button>
      <UButton
        :loading="isLoading"
        :disabled="!items.length"
        color="secondary"
        :variant="generatedIndexJs ? 'solid' : 'outline'"
        size="lg"
        class="w-full justify-center"
        @click="handleGenerate"
      >
        {{ generatedIndexJs ? 'Re-generate index.js' : 'Generate index.js' }}
      </UButton>
    </template>

    <template #preview-title>index.js Preview</template>

    <template #preview-content>
      <MDC v-if="generatedIndexJs && !isLoading" class="[&_>div.group]:m-0!" :value="formatted" />
      <div v-else-if="isLoading" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-10 flex items-center justify-center">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-gray-400 size-6" />
      </div>
      <div v-else class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-10 flex items-center justify-center text-sm text-gray-400 dark:text-gray-600">
        Click "Generate index.js" to preview the output.
      </div>
    </template>
  </GenerateFileLayout>
</template>
