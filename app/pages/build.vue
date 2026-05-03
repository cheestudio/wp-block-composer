<script
	setup
	lang="ts"
>
useSeoMeta({ title: 'WP Block Composer' })

const componentStore = useComponentStore()

const isReady = inject<Ref<boolean>>('isReady');
const isModalOpen = ref(false);

watch(isReady as Ref<boolean>, () => {
	if (localStorage.getItem('seenModal') === 'true' && !isModalOpen.value) {
		return;
	}
	isModalOpen.value = true;
	localStorage.setItem('seenModal', 'true');
});



</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-6">
			<div>
				<h2 class="text-2xl font-semibold mb-1">
					Step 1: Build Your UI
				</h2>
			</div>
			<div>
				<UModal
					v-if="!componentStore.isEmpty"
					:ui="{ content: 'sm:w-[1000px] max-w-full!' }"
				>
					<UButton
						label="Tip on Indenting"
						icon="i-lucide-info"
						color="neutral"
						variant="outline"
					/>
					<template #content>
						<div class="p-10">
							<div class="my-5 max-w-xl mx-auto">
								<h4>Note on Indenting Components:</h4>
								<p class="text-lg leading-[1.5em] italic">
									Certain components can be "nested" inside other components, such as InspectorControls.
									To "indent" a component, use the context menu on a component entry, and select Indent when your component is located under a Container component.
								</p>
								<p class="text-lg leading-[1.5em] italic">
									Future versions of this tool will allow you to indent components by dragging and dropping them.
								</p>
							</div>
						</div>
					</template>
				</UModal>
			</div>
		</div>

		<ComponentBuilder />

		<div class="flex justify-between mt-8 pt-6 border-t border-monokai-blue/20">
			<UModal
				v-model:open="isModalOpen"
				:ui="{ content: 'sm:w-[1000px] max-w-full!' }"
			>
				<UButton
					label="How to use this tool"
					trailing-icon="i-lucide-help-circle"
					color="neutral"
					variant="soft"
				/>
				<template #content>
					<div class="p-10">
						<h2 class="mb-5">How to Use This Tool</h2>

						<div class="flex gap-2 items-start">
							<div class="flex-[0_1_70%]">
								<p class="text-lg text-monokai-yellow">WP Block Composer is a a dynamic block generation tool meant for exploring WordPress Block configurations and code generation.</p>
								<p class="text-md">Use this tool to explore different components and configurations, generate customized boilerplate, and use it to learn more about how WordPress Blocks are constructed and configured.</p>
							</div>

							<UIcon
								name="i-carbon-question-answering"
								class="size-40 text-monokai-blue/90 relative -top-1 flex-1 block"
								color="primary"
							/>

						</div>
						<BlockFaqAccordion />
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
