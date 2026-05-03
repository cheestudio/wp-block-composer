<script
	setup
	lang="ts"
>
definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'WP Block Composer — Configure' })
</script>

<template>
	<div>
		<h2 class="text-2xl font-semibold mb-2">
			Step 2: Configure Options
		</h2>
		<p class="text-monokai-gutter mb-6">
			Set the block type, metadata, supports, and all other <a href="https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/" target="_blank" rel="noopener">block.json options</a>.
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
			<SelectedComponents />
		</div>
	</div>
</template>
