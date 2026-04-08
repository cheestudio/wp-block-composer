<script
	setup
	lang="ts"
>

import type { ComponentItem } from '~/stores/componentStore';

type ComponentTreeItem = ComponentItem & { children: ComponentTreeItem[] }

const componentStore = useComponentStore();
const { items } = storeToRefs(componentStore);
const itemsObjects = items.value;

const itemIds = Object.fromEntries(itemsObjects.map(item => [item.id, { ...item, children: [] as ComponentTreeItem[] }]));

const tree: ComponentTreeItem[] = [];
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
	<h4 class="mb-0">Selected Components</h4>
	<UTree 
	color="secondary" 
	:items="tree" 
	:ui="{
		root: 'my-5 border border-monokai-blue/20 rounded-md',
		item: 'py-1',
	}"
	/>
</template>