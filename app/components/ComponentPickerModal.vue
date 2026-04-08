<script
	setup
	lang="ts"
>
import type { RegistryEntry, ComponentCategory } from '~~/shared/wpComponentRegistry'
import { wpComponentRegistry, findRegistryEntry, getCategories } from '~~/shared/wpComponentRegistry'
import type { ComponentItem } from '~/stores/componentStore'

const props = defineProps<{
	open: boolean
	editItem?: ComponentItem | null
}>()

const emit = defineEmits<{
	'update:open': [value: boolean]
	'save': [data: { registryName: string, options: Record<string, unknown>, attributeValue: string, attributeType: string }]
}>()

// ── State ────────────────────────────────────────────────────

const searchQuery = ref('')
const activeCategory = ref<ComponentCategory | null>(null)
const selectedEntry = ref<RegistryEntry | null>(null)
const optionValues = ref<Record<string, unknown>>({})
const attributeValue = ref('')
const attributeType = ref('')

const attributeTypeOptions = [
{ label: 'string', value: 'string' },
{ label: 'boolean', value: 'boolean' },
{ label: 'object', value: 'object' },
{ label: 'array', value: 'array' },
{ label: 'integer', value: 'integer' },
{ label: 'number', value: 'number' },
{ label: 'null', value: 'null' },
]

const categories = getCategories()

const categoryIcons: Record<ComponentCategory, string> = {
	'interface': 'i-lucide-blocks',
	'input': 'i-lucide-sliders-horizontal',
	'color': 'i-lucide-palette',
	'ui': 'i-lucide-bell'
}

const categoryLabels: Record<ComponentCategory, string> = {
	'interface': 'Interface',
	'input': 'Input',
	'color': 'Color',
	'ui': 'UI'
}

const contextLabels: Record<string, string> = {
	editor: 'Editor',
	inspector: 'Sidebar',
	toolbar: 'Toolbar',
	save: 'Save',
	any: 'Any'
}

// ── Computed ─────────────────────────────────────────────────

const isEditMode = computed(() => !!props.editItem)

const modalTitle = computed(() => {
	if (isEditMode.value) return `Edit ${selectedEntry.value?.label ?? 'Component'}`
	if (selectedEntry.value) return `Configure ${selectedEntry.value.label}`
	return 'Add Component'
})

const filteredEntries = computed(() => {
	let entries = wpComponentRegistry

	if (activeCategory.value) {
		entries = entries.filter(e => e.category === activeCategory.value)
	}

	if (searchQuery.value.trim()) {
		const q = searchQuery.value.toLowerCase()
		entries = entries.filter(e =>
			e.label.toLowerCase().includes(q)
			|| e.name.toLowerCase().includes(q)
			|| e.description.toLowerCase().includes(q)
		)
	}

	return entries
})

// ── Watchers ─────────────────────────────────────────────────

watch(() => props.editItem, (item) => {
	if (item) {
		const entry = findRegistryEntry(item.registryName)
		if (entry) {
			selectedEntry.value = entry
			optionValues.value = { ...item.options }
			attributeValue.value = item.attributeValue
			attributeType.value = item.attributeType ?? ''
		}
	}
}, { immediate: true })

watch(() => props.open, (open) => {
	if (!open) {
		setTimeout(resetState, 300)
	}
})

// ── Actions ──────────────────────────────────────────────────

function resetState() {
	if (!props.editItem) {
		selectedEntry.value = null
	}
	optionValues.value = {}
	attributeValue.value = ''
	attributeType.value = ''
	searchQuery.value = ''
	activeCategory.value = null
}

function selectEntry(entry: RegistryEntry) {
	selectedEntry.value = entry
	optionValues.value = {}
	for (const opt of entry.options) {
		optionValues.value[opt.key] = opt.default ?? (opt.type === 'boolean' ? false : '')
	}
	attributeValue.value = ''
	attributeType.value = ''
}

function goBack() {
	if (isEditMode.value) {
		emit('update:open', false)
		return
	}
	selectedEntry.value = null
	optionValues.value = {}
	attributeValue.value = ''
	attributeType.value = ''
}

function toggleCategory(cat: ComponentCategory) {
	activeCategory.value = activeCategory.value === cat ? null : cat
}

function save() {
	if (!selectedEntry.value) return
	emit('save', {
		registryName: selectedEntry.value.name,
		options: { ...optionValues.value },
		attributeValue: attributeValue.value,
		attributeType: attributeType.value
	})
	emit('update:open', false)
}


</script>

<template>
	<UModal
		:open="open"
		:title="modalTitle"
		:ui="{ wrapper: 'sm:max-w-lg' }"
		@update:open="emit('update:open', $event)"
	>
		<template #body>
			<!-- Step 1: Search & Select Component -->
			<div
				v-if="!selectedEntry"
				class="space-y-4"
			>
				<UInput
					v-model="searchQuery"
					placeholder="Search components..."
					icon="i-lucide-search"
					autofocus
				/>

				<!-- Category filters -->
				<div class="flex gap-2 flex-wrap">
					<UButton
						v-for="cat in categories"
						:key="cat"
						:label="categoryLabels[cat]"
						:icon="categoryIcons[cat]"
						:variant="activeCategory === cat ? 'solid' : 'outline'"
						size="xs"
						@click="toggleCategory(cat)"
					/>
				</div>

				<!-- Results list -->
				<div class="max-h-72 overflow-y-auto space-y-1">
					<button
						v-for="entry in filteredEntries"
						:key="entry.name"
						class="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
						@click="selectEntry(entry)"
					>
						<span
							class="w-2.5 h-2.5 rounded-full shrink-0"
							:style="{ backgroundColor: entry.color }"
						/>
						<div class="min-w-0 flex-1">
							<div class="font-medium text-sm">
								{{ entry.label }}
							</div>
							<div class="text-xs text-gray-500 dark:text-gray-400 truncate">
								{{ entry.description }}
							</div>
						</div>
						<div class="flex flex-col items-end gap-1 shrink-0">
							<UBadge
								:label="contextLabels[entry.context]"
								variant="subtle"
								size="xs"
							/>
							<span class="text-[10px] text-gray-400 dark:text-gray-500">{{ entry.package.replace('@wordpress/', '@wp/') }}</span>
						</div>
					</button>

					<p
						v-if="filteredEntries.length === 0"
						class="text-center text-sm text-gray-400 py-6"
					>
						No components found.
					</p>
				</div>
			</div>

			<!-- Step 2: Configure Options -->
			<div
				v-else
				class="space-y-4"
			>
				<!-- Component info -->
				<div class="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
					<span
						class="w-3 h-3 rounded-full shrink-0"
						:style="{ backgroundColor: selectedEntry.color }"
					/>
					<span class="font-medium text-sm">{{ selectedEntry.name }}</span>
					<span class="text-xs text-gray-400">{{ selectedEntry.package }}</span>
					<div class="ml-auto flex items-center gap-1.5">
						<UBadge
							:label="contextLabels[selectedEntry.context]"
							variant="subtle"
							size="xs"
						/>
						<UBadge
							v-if="selectedEntry.canHaveChildren"
							label="container"
							variant="subtle"
							color="warning"
							size="xs"
						/>
					</div>
				</div>

				<!-- Description -->
				<p class="text-sm text-gray-500 dark:text-gray-400">
					{{ selectedEntry.description }}
				</p>

				<!-- Dynamic options form -->
				<template v-if="selectedEntry.options.length > 0">
					<div
						v-for="opt in selectedEntry.options"
						:key="opt.key"
					>
						<!-- Boolean → USwitch -->
						<USwitch
							v-if="opt.type === 'boolean'"
							:model-value="!!optionValues[opt.key]"
							:label="opt.label"
							@update:model-value="optionValues[opt.key] = $event"
						/>

						<!-- Select → USelect -->
						<UFormField
							v-else-if="opt.type === 'select'"
							:label="opt.label"
							:hint="opt.hint"
						>
							<USelect
								:model-value="String(optionValues[opt.key] ?? '')"
								:items="(opt.choices ?? []).map(c => ({ label: c, value: c }))"
								class="w-full"
								@update:model-value="optionValues[opt.key] = $event"
							/>
						</UFormField>

						<!-- Number → UInput type=number -->
						<UFormField
							v-else-if="opt.type === 'number'"
							:label="opt.label"
							:hint="opt.hint"
						>
							<UInput
								:model-value="String(optionValues[opt.key] ?? '')"
								type="number"
								class="w-full"
								@update:model-value="optionValues[opt.key] = $event"
							/>
						</UFormField>

						<!-- Text (default) → UInput -->
						<UFormField
							v-else
							:label="opt.label"
							:hint="opt.hint"
						>
							<UInput
								:model-value="String(optionValues[opt.key] ?? '')"
								class="w-full"
								@update:model-value="optionValues[opt.key] = $event"
							/>
						</UFormField>
					</div>
				</template>
				<p
					v-else
					class="text-sm text-gray-400"
				>
					No configuration options for this component.
				</p>

				<!-- Value Attribute -->
				<template v-if="selectedEntry.options.length > 0">
					<UFormField
						:ui="{
							labelWrapper: 'block mb-2',
						}"
						label="Attribute Name"
						help="The block.json attribute name whose value this component reads from or writes to (e.g. 'content', 'url'). Maps the component's onChange/value props to your block's registered attributes, enabling data persistence in the Block Editor."
					>
						<UInput
							v-model="attributeValue"
							placeholder="e.g. myTextValue OR myBackgroundColor"
							class="w-full"
						/>
					</UFormField>

					<UFormField
						label="Attribute Type"
						help="The type declared for this attribute in block.json. Used to generate the correct attribute schema."
					>
						<USelect
							v-model="attributeType"
							:items="attributeTypeOptions"
							class="w-full"
							placeholder="Select Type"
						/>
					</UFormField>
				</template>
			</div>
		</template>

		<template #footer>
			<div class="flex justify-between w-full">
				<UButton
					v-if="selectedEntry && !isEditMode"
					label="Back"
					icon="i-lucide-arrow-left"
					variant="ghost"
					@click="goBack"
				/>
				<div v-else />

				<div class="flex gap-2">
					<UButton
						label="Cancel"
						variant="outline"
						@click="emit('update:open', false)"
					/>
					<UButton
						v-if="selectedEntry"
						:label="isEditMode ? 'Save Changes' : 'Add to Block'"
						icon="i-lucide-check"
						color="primary"
						@click="save"
					/>
				</div>
			</div>
		</template>
	</UModal>
</template>
