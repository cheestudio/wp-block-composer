<script
	setup
	lang="ts"
>
interface FaqItem {
	label: string;
	content: string;
}

const faqItems: FaqItem[] = [
	{
		label: 'Who is this tool for?',
		content: 'The main use is for developers who haven\'t done much work in React or might be coming from something like ACF Blocks, but also experienced developers who want a tool for generating boilerplate OR exploring the wide variety of components available.',
	},
	{
		label: 'Why should I learn to write custom blocks?',
		content: 'I\'ve been working with custom blocks for years now, and the Block Editor allows for the creation of custom UI experiences that handles just about any type of content or integration. I\'ve been able to build some of the most sophisticated sites of my career, and due to the Block Editors deep customizability, I\'ve been able to do it with virtually no plugins. I find I\'m not even reaching for ACF much these days!',
	},
	{
		label: 'What do with the code I get from this tool?',
		content: 'To effectively use the code you get from this tool, you\'ll want to have the ability to compile blocks. This can arguably be one the most confusing parts if you\'re new to wp-scripts, but once you go through the process, you\'ll be able to re-use the workflow for each project. Here are some resources:<ul><li><a href="https://css-tricks.com/getting-started-with-wordpress-block-development/" target="_blank">Getting Started With WordPress Block Development - CSS Tricks</a></li><li><a href="https://rudrastyh.com/gutenberg/wordpress-scripts.html" target="_blank">How to Use @wordpress/scripts when Creating a Gutenberg Block</a></li><li><a href="https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/" target="_blank">Official Documentation from WordPress</a></li></ul>'
	},
]
</script>

<template>
	<div class="max-w-2xl mx-auto">
		<UAccordion
			:items="faqItems"
			:multiple="true"
			variant="soft"
			class="w-full"
			:ui="{
				root: 'border-1 border-monokai-yellow/20 p-5 pt-0 rounded-md',
				label: 'text-md text-monokai-yellow/90 hover:text-white',
				trigger: 'cursor-pointer',
				body: 'leading-[1.8em] [&_a]:text-monokai-blue [&_a]:hover:text-white [&_ul]:list-disc [&_ul]:pl-[15px] [&_ul]:mt-5'
			}"
		>
			<template #body="{ item }">
				<!-- eslint-disable-next-line vue/no-v-html, non-dynamic content -->
				<div v-html="item.content" />
			</template>
		</UAccordion>
	</div>
</template>
