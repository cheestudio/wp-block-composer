<script setup lang="ts">
const { items, blockType, blockConfigState, blockFileStore, toast } = useBlockContext()
const { generatedBlockJson } = storeToRefs(blockFileStore)

const blockAttributes = computed(() =>
  items.value.reduce((acc, { attributeValue, attributeType }) => {
    acc[attributeValue] = { type: attributeType, default: '' }
    return acc
  }, {} as Record<string, { type: string, default: string }>)
)

const isLoading = ref(false)

const cleaned = computed(() => cleanMarkdown(generatedBlockJson.value?.markdown))

const formatted = computed(() => '```json\n' + cleaned.value + '\n```')

const handleGenerate = async () => {
  if (!blockConfigState.value) {
    toast.add({ title: 'No configuration', description: 'Complete Step 2 before generating.', color: 'error' })
    return
  }
  isLoading.value = true
	await delay(1000);
  try {
    const mergedOptions = { ...blockConfigState.value, attributes: blockAttributes.value }
    generatedBlockJson.value = await $fetch<{ markdown: string }>('/api/generateJSON', {
      method: 'POST',
      body: { blockOptions: mergedOptions, blockType: blockType.value }
    })
  } catch {
    toast.add({ title: 'Generation failed', description: 'Could not build block.json. Check your configuration.', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <GenerateFileLayout>
    <template #left-title>Block Configuration</template>

    <template #left-content>
      <div v-if="blockConfigState" class="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800">
        <div class="px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Block Name</span>
          <span class="text-sm font-mono font-medium">{{ blockConfigState.name }}</span>
        </div>
        <div class="px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Title</span>
          <span class="text-sm">{{ blockConfigState.title }}</span>
        </div>
        <div class="px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Block Type</span>
          <UBadge :color="blockType === 'dynamic' ? 'primary' : 'neutral'" variant="subtle" size="md">
            {{ blockType }}
          </UBadge>
        </div>
        <div class="px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Category</span>
          <span class="text-sm capitalize">{{ blockConfigState.category }}</span>
        </div>
        <div class="px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Version</span>
          <span class="text-sm font-mono">{{ blockConfigState.version }}</span>
        </div>
        <div v-if="blockConfigState.textdomain" class="px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Text Domain</span>
          <span class="text-sm font-mono">{{ blockConfigState.textdomain }}</span>
        </div>
        <div v-if="blockConfigState.keywords?.length" class="px-4 py-3 flex items-center justify-between gap-3">
          <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium shrink-0">Keywords</span>
          <div class="flex flex-wrap gap-1 justify-end">
            <UBadge v-for="kw in blockConfigState.keywords" :key="kw" color="neutral" variant="outline" size="md">
              {{ kw }}
            </UBadge>
          </div>
        </div>
      </div>
      <div v-else class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        No block configuration found. Complete Step 2 first.
      </div>
    </template>

    <template #button>
      <UButton
        :loading="isLoading"
        :disabled="!blockConfigState"
        color="secondary"
        :variant="generatedBlockJson ? 'solid' : 'outline'"
        size="lg"
        class="w-full justify-center"
        @click="handleGenerate"
      >
        {{ generatedBlockJson ? 'Re-generate block.json' : 'Generate block.json' }}
      </UButton>
    </template>

    <template #preview-title>block.json Preview</template>

    <template #preview-content>
      <MDC v-if="generatedBlockJson && !isLoading" class="[&_>div.group]:m-0!" :value="formatted" />
      <div v-else-if="isLoading" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-10 flex items-center justify-center">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-gray-400 size-6" />
      </div>
      <div v-else class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-10 flex items-center justify-center text-sm text-gray-400 dark:text-gray-600">
        Click "Generate block.json" to preview the output.
      </div>
    </template>
  </GenerateFileLayout>
</template>
