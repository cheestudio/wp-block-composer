<script
	setup
	lang="ts"
>
import type { TabsItem } from '@nuxt/ui';
definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'Generate — WP Block Composer' });

const items: TabsItem[] = [
	{
		label: 'block.json',
		icon: 'i-lucide-file',
		slot: 'json' as const
	},
	{
		label: 'index.js',
		icon: 'i-lucide-file',
		slot: 'index' as const
	},
	{
		label: 'edit.js',
		icon: 'i-lucide-file',
		slot: 'edit' as const
	},
	{
		label: 'save.js',
		icon: 'i-lucide-file',
		slot: 'save' as const
	},
];

</script>

<template>
	<div>
		<h2 class="text-2xl font-semibold mb-2">
			Step 3: Review &amp; Generate
		</h2>
		<p class="text-gray-500 dark:text-gray-400 mb-8">
			Review your block configuration and generate the <code class="text-xs">block.json</code> file.
		</p>

		<UTabs
			:items="items"
			:ui="{
				'list': 'mb-8'
			}"
			class="w-full"
		>
			<template #json>
				<GenerateJSON />
			</template>
			<template #index>
				<GenerateIndexJS />
			</template>
			<template #edit>
				<GenerateEditJS />
			</template>
			<template #save>
				<GenerateSaveJS />
			</template>
		</UTabs>
	</div>
</template>
