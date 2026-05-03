<script
	setup
	lang="ts"
>
definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'Output — WP Block Composer' })

type FileType = 'json' | 'javascript';
interface DownloadConfig {
	content: string | null;
	filename: string;
	mimeType: string;
	fileType?: FileType;
}

const blockFileStore = useBlockFileStore();
const blockConfigStore = useBlockConfigStore();
const { generatedBlockJson, generatedIndexJs, generatedEditJs, generatedSaveJs } = storeToRefs(blockFileStore);

const { blockType, blockConfigState } = storeToRefs(blockConfigStore)

const blockSlug = computed(() =>
	`wp-block-composer-${(blockConfigState.value?.title ?? 'block')
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')}`
);

const formattedJson = computed(() =>
	generatedBlockJson.value?.markdown ?? ''
);

const formattedIndexJs = computed(() =>
	generatedIndexJs.value?.markdown ?? ''
);


const isDownloadingZip = ref(false)

const handleDownload = (config: DownloadConfig) => {
	if (!config.content) return;

	let cleanedContent = config.content;
	if (config.fileType === 'json') {
		cleanedContent = config.content.replace(/^```json\s*|\s*```$/g, '');
	} else if (config.fileType === 'javascript') {
		cleanedContent = config.content.replace(/^```javascript\s*|\s*```$/g, '');
	}

	const blob = new Blob([cleanedContent], { type: config.mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = config.filename;
	a.click();
	URL.revokeObjectURL(url);
};

const handleDownloadZip = async () => {
	isDownloadingZip.value = true

	try {
		const response = await $fetch<Blob>('/api/generateZip', {
			method: 'POST',
			body: {
				blockJson: formattedJson.value,
				indexJs: formattedIndexJs.value,
				editJs: generatedEditJs.value,
				saveJs: generatedSaveJs.value,
				folderName: blockConfigState.value?.title,
			},
			responseType: 'blob',
		})

		const blob = new Blob([response], { type: 'application/zip' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${blockSlug.value}.zip`
		a.click()
		URL.revokeObjectURL(url)
	} catch (error) {
		console.error('Failed to download ZIP:', error)
	} finally {
		isDownloadingZip.value = false
	}
}

</script>

<template>
	<div>
		<h2 class="text-2xl font-semibold mb-2">
			Step 4: Download Code
		</h2>
		<p class="text-monokai-gutter  mb-6">
			Download files individually, or the entire block as a zip file.
		</p>

		<div class="max-w-2xl mx-auto">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<UTooltip
					text="Generate this file first"
					:disabled="!!formattedJson"
					side="bottom"
					:delay-duration="0"
					:arrow=true
				>
					<UButton
						color="primary"
						size="lg"
						class="justify-center"
						aria-label="Download block.json"
						:disabled="!formattedJson"
						:variant="formattedJson ? 'solid' : 'outline'"
						icon="i-lucide-download"
						@click="handleDownload({ content: formattedJson, filename: 'block.json', mimeType: 'application/json', fileType: 'json' })"
					>
						block.json
					</UButton>
				</UTooltip>

				<UTooltip
					text="Generate this file first"
					:disabled="!!formattedIndexJs"
					side="bottom"
					:delay-duration="0"
					:arrow=true
				>
					<UButton
						color="primary"
						size="lg"
						class="justify-center"
						aria-label="Download index.js"
						:disabled="!formattedIndexJs"
						:variant="formattedIndexJs ? 'solid' : 'outline'"
						icon="i-lucide-download"
						@click="handleDownload({ content: formattedIndexJs, filename: 'index.js', mimeType: 'application/javascript', fileType: 'javascript' })"
					>
						index.js
					</UButton>
				</UTooltip>
				<UTooltip
					text="Generate this file first"
					:disabled="!!generatedEditJs"
					side="bottom"
					:delay-duration="0"
					:arrow=true
				>
					<UButton
						color="primary"
						size="lg"
						class="justify-center"
						aria-label="Download edit.js"
						:disabled="!generatedEditJs"
						:variant="generatedEditJs ? 'solid' : 'outline'"
						icon="i-lucide-download"
						@click="handleDownload({ content: generatedEditJs, filename: 'edit.js', mimeType: 'application/javascript' })"
					>
						edit.js
					</UButton>
				</UTooltip>
				<UTooltip
					text="Generate this file first"
					:disabled="!!generatedSaveJs"
					side="bottom"
					:delay-duration="0"
					:arrow=true
				>
					<UButton
						color="primary"
						size="lg"
						class="justify-center"
						:aria-label="blockType === 'dynamic' ? 'Download render.php' : 'Download save.js'"
						:disabled="!generatedSaveJs"
						:variant="generatedSaveJs ? 'solid' : 'outline'"
						icon="i-lucide-download"
						@click="handleDownload({ content: generatedSaveJs, filename: blockType === 'dynamic' ? 'render.php' : 'save.js', mimeType: blockType === 'dynamic' ? 'application/x-httpd-php' : 'application/javascript', fileType: blockType === 'dynamic' ? undefined : 'javascript' })"
					>
						{{ blockType === 'dynamic' ? 'render.php' : 'save.js' }}
					</UButton>
				</UTooltip>
			</div>

			<div class="mt-6 text-center">
				<UButton
					color="secondary"
					size="lg"
					class="w-full max-w-[300px] justify-center mx-auto cursor-pointer"
					aria-label="Download all files as ZIP"
					:disabled="!formattedJson && !formattedIndexJs && !generatedEditJs && !generatedSaveJs"
					:loading="isDownloadingZip"
					:icon="!formattedJson && !formattedIndexJs && !generatedEditJs && !generatedSaveJs ? '' : 'i-lucide-download'"
					@click="handleDownloadZip"
				>
					{{ !formattedJson && !formattedIndexJs && !generatedEditJs && !generatedSaveJs ? 'Generate files first' : 'Download All Files (ZIP)' }}

				</UButton>
			</div>
		</div>

		<UPageCard
			class="my-15"
			:ui="{
				root: 'max-w-2xl mx-auto',
				title: 'text-lg',
				description: 'text-monokai-gutter text-md',
				leadingIcon: 'size-15 text-monokai-blue/30'
			}"
			title="How do I use the code generated by this tool in my project?"
			description="To effectively use the code generated by this tool, you'll need to have the ability to compile and register blocks, and how you want to do that (whether through a plugin or directly into your theme) is up to you. Here are some resources to help you along:"
			icon="i-lucide-help-circle"
		>
			<template #footer>
				<ul class="list-disc pl-6 leading-relaxed">
					<li>
						<a
							href="https://css-tricks.com/getting-started-with-wordpress-block-development/"
							target="_blank"
							class="text-monokai-blue hover:text-monokai-yellow transition-colors"
						>
							Getting Started With WordPress Block Development - CSS Tricks
						</a>
					</li>
					<li>
						<a
							href="https://rudrastyh.com/gutenberg/wordpress-scripts.html"
							target="_blank"
							class="text-monokai-blue hover:text-monokai-yellow transition-colors"
						>
							How to Use @wordpress/scripts when Creating a Gutenberg Block
						</a>
					</li>
					<li>
						<a
							href="https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/"
							target="_blank"
							class="text-monokai-blue hover:text-monokai-yellow transition-colors"
						>
							Official Documentation for @wordpress/create-block
						</a>
					</li>
				</ul>
			</template>
		</UPageCard>

	</div>
</template>
