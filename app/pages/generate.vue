<script setup lang="ts">
definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'Generate — WP Block Composer' })

const blockConfigStore = useBlockConfigStore()
const toast = useToast()

const { blockOptions, blockType } = storeToRefs(blockConfigStore)

const blockJson = ref<Record<string, unknown> | null>(null)
const isLoading = ref(false)
const copied = ref(false)

const formattedJson = computed(() =>
  blockJson.value ? JSON.stringify(blockJson.value, null, 2) : ''
)

const handleGenerate = async () => {
  if (!blockOptions.value) {
    toast.add({ title: 'No configuration', description: 'Complete Step 2 before generating.', color: 'error' })
    return
  }

  isLoading.value = true
  blockJson.value = null

  try {
    blockJson.value = await $fetch<Record<string, unknown>>('/api/generateBlockJson', {
      method: 'POST',
      body: { blockOptions: blockOptions.value, blockType: blockType.value },
    })
  } catch {
    toast.add({ title: 'Generation failed', description: 'Could not build block.json. Check your configuration.', color: 'error' })
  } finally {
    isLoading.value = false
  }
}

const handleCopy = async () => {
  if (!formattedJson.value) return
  await navigator.clipboard.writeText(formattedJson.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const handleDownload = () => {
  if (!formattedJson.value) return
  const blob = new Blob([formattedJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'block.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-2">
      Step 3: Review &amp; Generate
    </h2>
    <p class="text-gray-500 dark:text-gray-400 mb-8">
      Review your block configuration and generate the <code class="text-xs">block.json</code> file.
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">

      <div class="space-y-6">
        <div
          v-if="blockOptions"
          class="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800"
          aria-label="Block configuration summary"
        >
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Block Name</span>
            <span class="text-sm font-mono font-medium">{{ blockOptions.name }}</span>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Title</span>
            <span class="text-sm">{{ blockOptions.title }}</span>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Block Type</span>
            <UBadge :color="blockType === 'dynamic' ? 'primary' : 'neutral'" variant="subtle" size="sm">
              {{ blockType }}
            </UBadge>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Category</span>
            <span class="text-sm capitalize">{{ blockOptions.category }}</span>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">API Version</span>
            <span class="text-sm">{{ blockOptions.apiVersion }}</span>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Version</span>
            <span class="text-sm font-mono">{{ blockOptions.version }}</span>
          </div>
          <div v-if="blockOptions.textdomain" class="px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Text Domain</span>
            <span class="text-sm font-mono">{{ blockOptions.textdomain }}</span>
          </div>
          <div v-if="blockOptions.keywords?.length" class="px-4 py-3 flex items-center justify-between gap-3">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium shrink-0">Keywords</span>
            <div class="flex flex-wrap gap-1 justify-end">
              <UBadge
                v-for="kw in blockOptions.keywords"
                :key="kw"
                color="neutral"
                variant="outline"
                size="sm"
              >
                {{ kw }}
              </UBadge>
            </div>
          </div>
        </div>

        <div
          v-else
          class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-6 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          No block configuration found. Complete Step 2 first.
        </div>

        <UButton
          :loading="isLoading"
          :disabled="!blockOptions"
          color="primary"
          size="lg"
          class="w-full justify-center"
          aria-label="Generate block.json file"
          @click="handleGenerate"
        >
          Generate block.json
        </UButton>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            block.json preview
          </h3>
          <div v-if="blockJson" class="flex gap-2">
            <UButton
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="copied ? 'Copied' : 'Copy block.json to clipboard'"
              @click="handleCopy"
            />
            <UButton
              icon="i-lucide-download"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Download block.json"
              @click="handleDownload"
            />
          </div>
        </div>

        <div
          v-if="blockJson"
          class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-auto max-h-[70vh]"
        >
          <pre
            class="text-xs font-mono p-4 leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre"
            aria-label="Generated block.json content"
          >{{ formattedJson }}</pre>
        </div>

        <div
          v-else-if="isLoading"
          class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-10 flex items-center justify-center"
        >
          <UIcon name="i-lucide-loader-circle" class="animate-spin text-gray-400 size-6" aria-label="Generating…" />
        </div>

        <div
          v-else
          class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-10 flex items-center justify-center text-sm text-gray-400 dark:text-gray-600"
        >
          Click "Generate block.json" to preview the output.
        </div>
      </div>

    </div>
  </div>
</template>
