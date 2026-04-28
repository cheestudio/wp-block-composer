<script
	setup
	lang="ts"
>
useSeoMeta({ title: 'Build — WP Block Composer' })

const componentStore = useComponentStore()

const isOpen = ref(null);

</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<div>
				<h2 class="text-2xl font-semibold mb-1">
					Build Component Tree
				</h2>
				<p class="text-gray-500 dark:text-gray-400">
					Select developer components from the @wordpress library and arrange them into the edit.js structure for your block.
				</p>
			</div>
		</div>

		<ComponentBuilder />

		<!-- Navigation -->
		<div class="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
			<UModal :ui="{ content: 'sm:w-[1000px] max-w-full!' }">
				<UButton
					label="How To Use This Tool"
					icon="i-lucide-help-circle"
					color="neutral"
					variant="soft"
				/>
				<template #content>
					<div class="p-10">
						<h3 class="mb-2">About &amp; FAQ</h3>
						<p>WP Block Composer was created to aid developers in getting started with and exploring Custom WordPress blocks.</p>
						<div class="flex gap-4 items-center">
							<div class="w-2/3">
								<BlockFaqAccordion />
							</div>
							<div class="flex-1 text-center">
								<UIcon
									name="i-carbon-question-answering"
									class="size-50 text-monokai-yellow relative -top-1"
									color="primary"
								/>
							</div>
						</div>
					</div>
				</template>
			</UModal>
			<UButton
				label="Next: Configure"
				icon="i-lucide-arrow-right"
				trailing
				color="primary"
				variant="outline"
				:disabled="componentStore.isEmpty"
				to="/configure"
			/>
		</div>

	</div>
</template>
