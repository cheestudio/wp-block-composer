<script
	setup
	lang="ts"
>
definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'Output — WP Block Composer' })

const blockFileStore = useBlockFileStore()
const { generatedBlockJson, generatedIndexJs, generatedEditJs, generatedSaveJs } = storeToRefs(blockFileStore)

const formattedJson = computed(() =>
	generatedBlockJson.value?.markdown ?? ''
)

const formattedIndexJs = computed(() =>
	generatedIndexJs.value?.markdown ?? ''
)

type FileType = 'json' | 'javascript';

interface DownloadConfig {
	content: string | null;
	filename: string;
	mimeType: string;
	fileType?: FileType;
}

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
		const response = await $fetch<Blob>('/api/downloadZip', {
			method: 'POST',
			body: {
				blockJson: formattedJson.value,
				indexJs: formattedIndexJs.value,
				editJs: generatedEditJs.value,
				saveJs: generatedSaveJs.value,
			},
			responseType: 'blob',
		})

		const blob = new Blob([response], { type: 'application/zip' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'wp-block.zip'
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
			Step 4: Code Output
		</h2>
		<p class="text-gray-500 dark:text-gray-400 mb-6">
			View generated files with syntax highlighting, copy individual files, or download everything as a ZIP.
		</p>


		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<UButton
				color="primary"
				size="lg"
				class="justify-center"
				aria-label="Download block.json"
				:disabled="!formattedJson"
				@click="handleDownload({ content: formattedJson, filename: 'block.json', mimeType: 'application/json', fileType: 'json' })"
			>
				Download block.json
			</UButton>

			<UButton
				color="primary"
				size="lg"
				class="justify-center"
				aria-label="Download index.js"
				:disabled="!formattedIndexJs"
				@click="handleDownload({ content: formattedIndexJs, filename: 'index.js', mimeType: 'application/javascript', fileType: 'javascript' })"
			>
				Download index.js
			</UButton>

			<UButton
				color="primary"
				size="lg"
				class="justify-center"
				aria-label="Download edit.js"
				:disabled="!generatedEditJs"
				@click="handleDownload({ content: generatedEditJs, filename: 'edit.js', mimeType: 'application/javascript' })"
			>
				Download edit.js
			</UButton>

			<UButton
				color="primary"
				size="lg"
				class="justify-center"
				aria-label="Download save.js"
				:disabled="!generatedSaveJs"
				@click="handleDownload({ content: generatedSaveJs, filename: 'save.js', mimeType: 'application/javascript' })"
			>
				Download save.js
			</UButton>
		</div>

		<div class="mt-6">
			<UButton
				color="secondary"
				size="lg"
				class="w-full justify-center"
				aria-label="Download all files as ZIP"
				:disabled="!formattedJson && !formattedIndexJs && !generatedEditJs && !generatedSaveJs"
				:loading="isDownloadingZip"
				@click="handleDownloadZip"
			>
				Download All Files (ZIP)
			</UButton>
		</div>

	</div>
</template>
