<script setup lang="ts">
interface FaqItem {
	label: string;
	content: string;
}

const faqItems: FaqItem[] = [
	{
		label: 'How do I install a custom block in WordPress?',
		content: 'Upload your block files to your theme or plugin directory. Ensure block.json is in the root of your block folder. Register the block using register_block_type() in your theme functions.php or plugin file, pointing to the folder containing block.json. The block will then appear in the block inserter.',
	},
	{
		label: 'Where do block assets like CSS and JS get loaded?',
		content: 'Assets defined in block.json are automatically enqueued by WordPress when the block is used. The editorScript and editorStyle files load in the block editor, while script and style files load on the frontend. Use the file:./ prefix to reference assets relative to your block folder.',
	},
	{
		label: 'Can I use custom attributes in my block?',
		content: 'Yes, define attributes in block.json with type, default, and source properties. Use the selector property with a CSS selector to extract values from saved markup. In your edit.js, use the attributes prop and setAttributes function to read and update attribute values.',
	},
	{
		label: 'What is the difference between static and dynamic blocks?',
		content: 'Static blocks save their rendered markup directly to the post content using save.js. Dynamic blocks use a PHP render callback (render.php) to generate markup on the server at request time, ideal for content that changes frequently or requires database queries.',
	},
]
</script>

<template>
	<div class="max-w-2xl mx-auto mt-12">
		<h3 class="text-center">How do I use these files?</h3>
		<UAccordion
			:items="faqItems"
			:multiple="true"
			variant="soft"
			class="w-full"
			:ui="{
				root: 'border-1 border-monokai-yellow/20 p-5 pt-0 rounded-md',
				label: 'text-md text-monokai-yellow/90 hover:text-white',
				trigger: 'cursor-pointer'
			}"
		/>
	</div>
</template>
