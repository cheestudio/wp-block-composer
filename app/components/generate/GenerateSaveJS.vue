<script setup lang="ts">
import type Anthropic from '@anthropic-ai/sdk'

const { items, flatOrdered, blockType, blockConfigState, blockFileStore, toast } = useBlockContext()
const { generatedSaveJs } = storeToRefs(blockFileStore)

const isLoading = ref(false)

const cleaned = computed(() => cleanMarkdown(generatedSaveJs.value))

const formatted = computed(() => blockType.value === 'dynamic'
  ? '```php\n' + cleaned.value + '\n```'
  : '```javascript\n' + cleaned.value + '\n```')

const previewTitle = computed(() =>
  blockType.value === 'dynamic' ? 'render.php Preview' : 'save.js Preview')

const buttonLabel = computed(() =>
  blockType.value === 'dynamic'
    ? (generatedSaveJs.value ? 'Re-generate render.php' : 'Generate render.php')
    : (generatedSaveJs.value ? 'Re-generate save.js' : 'Generate save.js'))

const handleGenerate = async () => {
  if (!items.value.length) {
    toast.add({ title: 'No components', description: 'Add components in Step 1 first.', color: 'error' })
    return
  }
  isLoading.value = true
  try {
    const { message } = await $fetch<{ message: Anthropic.Message['content'] }>('/api/generateFile', {
      method: 'POST',
      body: { fileType: 'save', blockType: blockType.value, blockConfig: blockConfigState.value, components: items.value }
    })
    const block = message[0]
    generatedSaveJs.value = block?.type === 'text' ? block.text : null
  } catch {
    toast.add({ title: 'Generation failed', description: 'Could not build save.js.', color: 'error' })
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
        :variant="generatedSaveJs ? 'solid' : 'outline'"
        size="lg"
        class="w-full justify-center"
        @click="handleGenerate"
      >
        {{ buttonLabel }}
      </UButton>
    </template>

    <template #preview-title>{{ previewTitle }}</template>

    <template #preview-content>
      <MDC v-if="generatedSaveJs && !isLoading" class="[&_>div.group]:m-0!" :value="formatted" />
      <div v-else-if="isLoading" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-10 flex items-center justify-center">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-gray-400 size-6" />
      </div>
      <div v-else class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-10 flex items-center justify-center text-sm text-gray-400 dark:text-gray-600">
        Click "{{ buttonLabel }}" to preview the output.
      </div>
    </template>
  </GenerateFileLayout>
</template>
