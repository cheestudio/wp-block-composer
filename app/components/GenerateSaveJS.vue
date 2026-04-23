<script
	setup
	lang="ts"
>
import type Anthropic from '@anthropic-ai/sdk';

const componentStore = useComponentStore()
const blockFileStore = useBlockFileStore()
const blockConfigStore = useBlockConfigStore()
const toast = useToast()

const { items, flatOrdered } = storeToRefs(componentStore)
const { generatedSaveJs } = storeToRefs(blockFileStore)
const { blockType, blockConfigState } = storeToRefs(blockConfigStore)

const isLoading = ref(false)

const formattedSource = computed(() => '```javascript\n' + generatedSaveJs.value + '\n```')

const handleGenerateSaveJs = async () => {
	if (!items.value.length) {
		toast.add({ title: 'No components', description: 'Add components in Step 1 first.', color: 'error' })
		return
	}
	isLoading.value = true

	try {
		const { message } = await $fetch<{ message: Anthropic.Message['content'] }>('/api/generateSaveJs', {
			method: 'POST',
			body: { blockType: blockType.value, blockConfig: blockConfigState.value, components: items.value },
		})

		const contentBlock = message[0]
		generatedSaveJs.value = contentBlock && contentBlock.type === 'text' ? contentBlock.text : null
	} catch {
		toast.add({ title: 'Generation failed', description: 'Could not build save.js.', color: 'error' })
	} finally {
		isLoading.value = false
	}
}

</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
		<div class="space-y-6">
			<h3 class="text-lg font-sans text-monokai-fg">
				Selected Components
			</h3>
			<div
				v-if="items.length"
				class="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800"
				aria-label="Components used in this block"
			>
				<div
					v-for="{ item } in flatOrdered"
					:key="item.id"
					class="px-4 py-3 flex items-center justify-between gap-3"
				>
					<span class="text-sm font-medium">{{ item.label }}</span>
					<span class="text-xs font-mono text-gray-500 dark:text-gray-400 shrink-0">{{ item.registryName }}</span>
				</div>
			</div>

			<div
				v-else
				class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-6 text-center text-sm text-gray-500 dark:text-gray-400"
			>
				No components in the tree.
			</div>

			<UButton
				:loading="isLoading"
				:disabled="!items.length"
				color="secondary"
				:variant="generatedSaveJs ? 'solid' : 'outline'"
				size="lg"
				class="w-full justify-center"
				aria-label="Generate save.js file"
				@click="handleGenerateSaveJs"
			>
				{{ generatedSaveJs ? 'Re-generate save.js' : 'Generate save.js' }}
			</UButton>
		</div>

		<div class="space-y-3">
			<div class="flex items-center justify-end m-0">
				<h3 class="text-lg font-sans text-monokai-fg">
					save.js Preview
				</h3>
			</div>

			<div v-if="generatedSaveJs && !isLoading">
				<MDC class="[&_>div.group]:m-0!" :value="formattedSource" />
			</div>

			<div
				v-else-if="isLoading"
				class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-10 flex items-center justify-center"
			>
				<UIcon
					name="i-lucide-loader-circle"
					class="animate-spin text-gray-400 size-6"
					aria-label="Generating…"
				/>
			</div>

			<div
				v-else
				class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-10 flex items-center justify-center text-sm text-gray-400 dark:text-gray-600"
			>
				Click "Generate save.js" to preview the output.
			</div>
		</div>
	</div>
</template>
