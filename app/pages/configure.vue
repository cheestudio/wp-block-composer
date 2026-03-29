<script
	setup
	lang="ts"
>
definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'Configure — WP Block Composer' })

export interface ComponentItem {
	id: string
	registryName: string
	label: string
	parentId: string | null
	children: ComponentItem[]
}

const componentStore = useComponentStore();
const { items } = storeToRefs(componentStore);
const itemsObjects = items.value;

const itemIds = Object.fromEntries(itemsObjects.map(item => [item.id, { ...item, children: [] as ComponentItem[] }]));

const tree: ComponentItem[] = [];
itemsObjects.forEach((item) => {
	if (item.parentId && itemIds[item.parentId]) {
		itemIds[item.parentId]?.children.push(itemIds[item.id]!);
	}
	else {
		const entry = itemIds[item.id];
		if (entry) {
			tree.push(entry);
		}
	}
});

</script>


<template>
	<div>
		<h2 class="text-2xl font-semibold mb-2">
			Step 2: Configure Block
		</h2>
		<p class="text-gray-500 dark:text-gray-400 mb-6">
			Set the block type, metadata, attributes, supports, styles, and all block.json options.
		</p>

		<div class="grid grid-cols-2 gap-10">
			<div>
				<h3>Block Options</h3>
			</div>
			<div class="bg-white/5 p-4 rounded-lg">
				<h2>Selected Components</h2>
				<USeparator />
				<UTree :items="tree" />
			</div>
		</div>

	</div>
</template>
