import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const BlockTypeEnum = z.enum(['static', 'dynamic'])

const ComponentEntrySchema = z
	.object({
		registryName: z.string(),
	})
	.passthrough()

const RequestSchema = z.object({
	blockType: BlockTypeEnum,
	blockConfig: z.unknown(),
	components: z.array(ComponentEntrySchema),
})

const config = useRuntimeConfig()

const client = new Anthropic({
	apiKey: config.anthropicApiKey,
})

const buildSaveJsUserMessage = (
	blockType: z.infer<typeof BlockTypeEnum>,
	blockConfig: unknown,
	components: z.infer<typeof ComponentEntrySchema>[],
) => {
	const blockConfigJson = JSON.stringify(blockConfig ?? null, null, 2)
	const componentListJson = JSON.stringify(components, null, 2)

	return `You are generating the save.js source file for a WordPress Block Editor block.

## Goal
Produce a complete, valid save module for @wordpress/blocks: the React component passed as the \`save\` property of registerBlockType (this project imports it as \`import Save from './save'\`, so use a default export for the Save component). Use JSX, WordPress packages indicated by each component's registryPackage, and apiVersion 3 patterns.

## What save.js must do (differs from edit.js)
- Save runs on the server during serialization and in the frontend when saving the post. It must output static markup only: no hooks that only exist in the editor, no InspectorControls, BlockControls, or interactive editor-only components.
- The Save component receives only \`{ attributes }\` from the block editor. Do not use \`setAttributes\`.
- Wrap the outer element with \`useBlockProps.save()\` from \`@wordpress/block-editor\` (spread onto the root JSX element).
- Destructure every attribute key defined in blockConfig.attributes (if any) from \`attributes\` and use them in the saved markup (e.g. RichText.Content, URLs in tags, class names). If there are no custom attributes, omit unused destructuring.
- For \`RichText\` in the editor tree, use \`RichText.Content\` in save with the same tagName/valueKey pattern as the editor implementation.
- For blocks that use \`InnerBlocks\` in the editor, include \`<InnerBlocks.Content />\` in the saved output in the correct place in the DOM tree so serialized inner blocks persist.
- Match the DOM structure implied by the component tree (parentId, order): same nesting order as edit for static blocks so front-end markup aligns with the editor preview.
- No placeholders: working JSX. Output must be valid for the block type below.

## Block configuration
The following JSON matches block.json–oriented fields (name, title, description, category, icon, keywords, textdomain, apiVersion, version, render, parent, ancestor, allowedBlocks, supports, attributes). Use attribute definitions for RichText.Content and saved markup.

## Block save mode
blockType is "${blockType}".
- If blockType is **static**: implement full Save JSX that serializes all content and inner blocks correctly.
- If blockType is **dynamic**: the block registration uses a null save callback; still provide save.js as a minimal module: default-export a function component named Save that returns \`null\` only (no markup, no useBlockProps). Do not add PHP or server logic.

## Component tree
The following JSON is a flat list of selected components used to build the block. Fields include id, registryName, label, parentId, order, options, attributeValue, attributeType, registryPackage. Interpret parentId and order as a tree. For save.js, map each node to its **serialized** counterpart: skip editor-only wrappers; keep structural elements, RichText.Content, InnerBlocks.Content, Media placeholders (e.g. img src from attributes), etc. Import each registryName from its registryPackage only where the save side needs that symbol.

## Requirements
- ES module imports; include @wordpress/block-editor / @wordpress/blocks / @wordpress/element as needed; add @wordpress/block-editor RichText when using RichText.Content.
- Default export: the Save function or component receiving \`{ attributes }\`.
- Output ONLY the JavaScript/JSX source. No markdown code fences, no explanation before or after the code. Return the code as a string, not wrapped in a markdown code fence. NO BACKTICKS.

## blockType
${blockType}

## blockConfig (JSON)
${blockConfigJson}

## components (JSON)
${componentListJson}`
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const parsed = RequestSchema.safeParse(body)

	if (!parsed.success) {
		throw createError({ statusCode: 400, message: 'Invalid request', data: parsed.error.flatten() })
	}

	const userContent = buildSaveJsUserMessage(
		parsed.data.blockType,
		parsed.data.blockConfig,
		parsed.data.components,
	)

	const params: Anthropic.MessageCreateParams = {
		model: 'claude-haiku-4-5-20251001',
		max_tokens: 8192,
		messages: [{ role: 'user', content: userContent }],
	}

	const message: Anthropic.Message = await client.messages.create(params)

	return { message: message.content }
})
