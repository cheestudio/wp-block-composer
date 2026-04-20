<script
	setup
	lang="ts"
>

definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'Configure — WP Block Composer' })
</script>

<template>
	<div>
		<h2 class="text-2xl font-semibold mb-2">
			Step 2: Configure Block
		</h2>
		<p class="text-gray-500 dark:text-gray-400 mb-6">
			Set the block type, metadata, attributes, supports, styles, and all block.json options.
		</p>

		<div class="grid grid-cols-[2fr_1fr] gap-10">
			<div class="block-configuration">
				<div class="block-type">
					<BlockType />
				</div>
				<div class="block-options py-12 min-h-screen">
					<BlockOptions />
				</div>
			</div>
			<div class="selected-components">
				<div class="bg-white/5 p-4 rounded-lg sticky top-10">
					<SelectedComponents />
				</div>
			</div>
		</div>
	</div>
</template>
