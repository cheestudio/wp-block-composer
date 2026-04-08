<script
	setup
	lang="ts"
>

import type { FormSubmitEvent } from '@nuxt/ui';

const state = reactive<Partial<BlockSchema>>({
	name: '',
	title: '',
	description: '',
	category: 'text',
	icon: '',
	keywords: [],
	textdomain: '',
	apiVersion: 3,
	version: '0.1.0',
})

const categoryItems = [
	{ label: 'Text', value: 'text' },
	{ label: 'Media', value: 'media' },
	{ label: 'Design', value: 'design' },
	{ label: 'Widgets', value: 'widgets' },
	{ label: 'Theme', value: 'theme' },
	{ label: 'Embed', value: 'embed' },
]

const apiVersionItems = [
	{ label: 'Version 1', value: 1 },
	{ label: 'Version 2', value: 2 },
	{ label: 'Version 3 (recommended)', value: 3 },
]

const handleSubmit = (event: FormSubmitEvent<BlockSchema>) => {
	useBlockConfigStore().setMeta(event.data)
}

</script>

<template>
	<div>
		<h3 class="text-lg font-semibold mb-1">
			Block Configuration
		</h3>
		<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
			Define the core metadata for your <code class="text-xs">block.json</code>.
		</p>

		<UForm
			:schema="schema"
			:state="state"
			class="space-y-5"
			@submit="handleSubmit"
		>
			<UFormField
				label="Block Name"
				name="name"
				required
				hint="namespace/block-name — lowercase letters, numbers, and hyphens only"
			>
				<UInput
					v-model="state.name"
					placeholder="my-plugin/my-block"
					class="w-full"
					aria-label="Block name"
					aria-required="true"
					autocomplete="off"
				/>
			</UFormField>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<UFormField
					label="Title"
					name="title"
					required
				>
					<UInput
						v-model="state.title"
						placeholder="My Block"
						class="w-full"
						aria-label="Block title"
						aria-required="true"
					/>
				</UFormField>

				<UFormField
					label="API Version"
					name="apiVersion"
				>
					<USelect
						v-model="state.apiVersion"
						:items="apiVersionItems"
						class="w-full"
						aria-label="WordPress Block API version"
					/>
				</UFormField>
			</div>

			<UFormField
				label="Description"
				name="description"
				hint="Max 400 characters"
			>
				<UTextarea
					v-model="state.description"
					placeholder="A brief description of what this block does."
					:rows="3"
					autoresize
					class="w-full"
					aria-label="Block description"
				/>
			</UFormField>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<UFormField
					label="Category"
					name="category"
				>
					<USelect
						v-model="state.category"
						:items="categoryItems"
						class="w-full"
						aria-label="Block category"
					/>
				</UFormField>

				<UFormField
					label="Icon"
					name="icon"
					hint="Dashicons identifier or leave blank"
				>
					<UInput
						v-model="state.icon"
						placeholder="star-filled"
						class="w-full"
						aria-label="Block icon (Dashicons identifier)"
					>
						<template #leading>
							<span class="text-xs text-gray-400 select-none pl-1 pointer-events-none">dashicons-</span>
						</template>
					</UInput>
				</UFormField>
			</div>

			<UFormField
				label="Keywords"
				name="keywords"
				hint="Up to 3 search keywords to help users discover your block"
			>
				<UInputTags
					v-model="state.keywords"
					placeholder="Add keyword and press Enter…"
					class="w-full"
					aria-label="Block search keywords"
				/>
			</UFormField>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<UFormField
					label="Text Domain"
					name="textdomain"
					hint="Matches your plugin or theme slug"
				>
					<UInput
						v-model="state.textdomain"
						placeholder="my-plugin"
						class="w-full"
						aria-label="Text domain for internationalization"
					/>
				</UFormField>

				<UFormField
					label="Version"
					name="version"
				>
					<UInput
						v-model="state.version"
						placeholder="0.1.0"
						class="w-full"
						aria-label="Block version"
					/>
				</UFormField>
			</div>

			<div class="flex justify-end pt-2">
				<UButton
					type="submit"
					color="primary"
					size="md"
					aria-label="Save block configuration"
				>
					Save Configuration
				</UButton>
			</div>
		</UForm>
	</div>
</template>
