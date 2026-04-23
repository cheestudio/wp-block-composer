<script
	setup
	lang="ts"
>

import type { ComponentItem } from '~/stores/componentStore';
type ComponentTreeItem = ComponentItem & { children: ComponentTreeItem[] }

const componentStore = useComponentStore();
const blockConfigStore = useBlockConfigStore();
const { items } = storeToRefs(componentStore);
const blockStoreRefs = storeToRefs(blockConfigStore)
const configSaved = ref(0);
const isSaving = ref();

const handleConfigSave = debounce(async () => { // not worth a loop for hard coded stages
	if (isSaving.value) return;
	isSaving.value = true;
	configSaved.value = 1;
	await delay(1000);
	configSaved.value = 2;
	await delay(500);
	configSaved.value = 0;
	isSaving.value = false;
}, 1000);


watch(
	[blockStoreRefs.blockConfigState, blockStoreRefs.blockType],
	() => {
		handleConfigSave();
	},
	{ deep: true }
)



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
	<div class="selected-components">
		<div class="sticky top-10">
			<div class="bg-white/5 p-4 rounded-lg">
				<h4 class="mb-0 text-[15px] font-sans">Selected Components:</h4>
				<UTree
					color="secondary"
					:items="tree"
					:ui="{
						root: 'my-5 border border-monokai-blue/20 rounded-md',
						item: 'py-1',
					}"
				/>

				<h4 class="mb-2 text-[15px] font-sans">Status:</h4>
				<UProgress
					v-model="configSaved"
					:status="false"
					:color="configSaved > 1 ? 'success' : configSaved > 0 ? 'warning' : 'success'"
					:max="['Awaiting changes...', 'Reticulating...', 'Saved']"
				/>
			</div>
			<div class="flex justify-end mt-10">
				<UButton
					label="Next: Compile"
					icon="i-lucide-arrow-right"
					trailing
					color="success"
					variant="outline"
					to="/generate"
				/>
			</div>
		</div>
	</div>
</template>