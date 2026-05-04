<script
	setup
	lang="ts"
>
import type Anthropic from '@anthropic-ai/sdk'

const { items, flatOrdered, blockType, blockConfigState, blockFileStore, toast } = useBlockContext()
const { generatedEditJs, editJsHash } = storeToRefs(blockFileStore);

const isLoading = ref(false)

const cleaned = computed(() => cleanMarkdown(generatedEditJs.value))
const formatted = computed(() => '```javascript\n' + cleaned.value + '\n```')

const currentInputHash = computed(() =>
	JSON.stringify({ fileType: 'edit', blockType: blockType.value, blockConfig: blockConfigState.value, components: items.value })
)

const isStale = computed(() =>
	editJsHash.value !== currentInputHash.value
)

const handleGenerate = async () => {
	console.log(editJsHash.value);
	if (!items.value.length) {
		toast.add({ title: 'No components', description: 'Add components in Step 1 first.', color: 'error' })
		return
	}
	if (!isStale.value) {
		toast.add({ title: 'No changes detected', description: 'Configuration is identical to the last generation.', color: 'info' })
		return
	}
	isLoading.value = true
	try {
		const { message } = await $fetch<{ message: Anthropic.Message['content'] }>('/api/generateFile', {
			method: 'POST',
			body: { fileType: 'edit', blockType: blockType.value, blockConfig: blockConfigState.value, components: items.value }
		})
		const block = message[0]
		generatedEditJs.value = block?.type === 'text' ? block.text : null;
		editJsHash.value = currentInputHash.value;
	} catch {
		toast.add({ title: 'Generation failed', description: 'Could not build edit.js.', color: 'error' })
	} finally {
		isLoading.value = false
	}
}
</script>

<template>

	<GenerateFileLayout>
		<template #left-title>Selected Components</template>

		<template #left-content>
			<div
				v-if="items.length"
				class="rounded-lg border border-monokai-blue/20 divide-y divide-monokai-blue/20"
			>
				<div
					v-for="{ item } in flatOrdered"
					:key="item.id"
					class="px-4 py-3 flex items-center justify-between gap-3"
				>
					<span class="text-sm font-medium">{{ item.label }}</span>
					<span class="text-xs font-mono text-monokai-gutter  shrink-0">{{ item.registryName }}</span>
				</div>
			</div>
			<div
				v-else
				class="rounded-lg border border-dashed border-monokai-accented p-6 text-center text-sm text-monokai-gutter "
			>
				No components in the tree.
			</div>
		</template>

		<template #button>
			<UButton
				:loading="isLoading"
				:disabled="!items.length"
				color="secondary"
				:variant="generatedEditJs ? 'solid' : 'outline'"
				size="lg"
				class="w-full justify-center"
				@click="handleGenerate"
			>
				{{ generatedEditJs ? 'Re-generate edit.js' : 'Generate edit.js' }}
			</UButton>
		</template>

		<template #preview-title>edit.js Preview</template>

		<template #preview-content>
			<MDC
				v-if="generatedEditJs && !isLoading"
				class="[&_>div.group]:m-0!"
				:value="formatted"
			/>
			<div
				v-else-if="isLoading"
				class="rounded-lg border border-monokai-blue/20 bg-monokai-blue/10 p-10 flex items-center justify-center"
			>
				<UIcon
					name="i-lucide-loader-circle"
					class="animate-spin text-monokai-gutter size-6"
				/>
			</div>
			<div
				v-else
				class="rounded-lg border border-dashed border-monokai-accented p-10 flex items-center justify-center text-sm text-monokai-gutter"
			>
				Click "Generate edit.js" to preview the output.
			</div>
		</template>

	</GenerateFileLayout>
</template>