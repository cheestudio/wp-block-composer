<script
	setup
	lang="ts"
>
const blockConfigStore = useBlockConfigStore()
const componentStore = useComponentStore()
const blockFileStore = useBlockFileStore()
const toast = useToast()

const { blockConfigState: blockOptions, blockType } = storeToRefs(blockConfigStore)
const { generatedBlockJson: blockJson } = storeToRefs(blockFileStore)
const { items } = storeToRefs(componentStore)
const componentObjects = items.value

const blockAttributes = componentObjects.reduce((acc, { attributeValue, attributeType }) => {
	acc[attributeValue] = { type: attributeType, default: '' }
	return acc
}, {} as Record<string, { type: string, default: string }>)

const isLoading = ref(false)

const formattedJson = computed(() =>
	blockJson?.value?.markdown ?? ''
)

const handleGenerateJSON = async () => {
	if (!blockOptions.value) {
		toast.add({ title: 'No configuration', description: 'Complete Step 2 before generating.', color: 'error' })
		return
	}

	isLoading.value = true

	try {
		const mergedBlockOptions = {
			...blockOptions.value,
			attributes: blockAttributes
		}
		await delay(1500);
		blockJson.value = await $fetch<{ markdown: string }>('/api/generateBlockJson', {
			method: 'POST',
			body: { blockOptions: mergedBlockOptions, blockType: blockType.value },
		});
	} catch (error) {
		console.log(error);
		toast.add({ title: 'Generation failed', description: 'Could not build block.json. Check your configuration.', color: 'error' })
	} finally {
		isLoading.value = false
	}
}

</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
		<div class="space-y-6">
			<h3 class="text-lg font-sans text-monokai-fg">
				Block Configuration
			</h3>
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
					<UBadge
						:color="blockType === 'dynamic' ? 'primary' : 'neutral'"
						variant="subtle"
						size="md"
					>
						{{ blockType }}
					</UBadge>
				</div>
				<div class="px-4 py-3 flex items-center justify-between">
					<span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Category</span>
					<span class="text-sm capitalize">{{ blockOptions.category }}</span>
				</div>

				<div class="px-4 py-3 flex items-center justify-between">
					<span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Version</span>
					<span class="text-sm font-mono">{{ blockOptions.version }}</span>
				</div>
				<div
					v-if="blockOptions.textdomain"
					class="px-4 py-3 flex items-center justify-between"
				>
					<span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Text Domain</span>
					<span class="text-sm font-mono">{{ blockOptions.textdomain }}</span>
				</div>
				<div
					v-if="blockOptions.keywords?.length"
					class="px-4 py-3 flex items-center justify-between gap-3"
				>
					<span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium shrink-0">Keywords</span>
					<div class="flex flex-wrap gap-1 justify-end">
						<UBadge
							v-for="kw in blockOptions.keywords"
							:key="kw"
							color="neutral"
							variant="outline"
							size="md"
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
				color="secondary"
				:variant="blockJson ? 'solid' : 'outline'"
				size="lg"
				class="w-full justify-center"
				aria-label="Generate block.json file"
				@click="handleGenerateJSON"
			>
				{{ blockJson ? 'Re-generate block.json' : 'Generate block.json' }}
			</UButton>
		</div>

		<div class="space-y-3">
			<div class="flex items-center justify-end m-0">
				<h3 class="text-lg font-sans text-monokai-fg">
					block.json Preview
				</h3>
			</div>

			<div
				v-if="blockJson && !isLoading"
			>
				<MDC class="[&_>div.group]:m-0!" :value="formattedJson" />
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
				Click "Generate block.json" to preview the output.
			</div>
		</div>
	</div>
</template>
