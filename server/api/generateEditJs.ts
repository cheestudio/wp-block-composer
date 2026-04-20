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

const buildEditJsUserMessage = (
	blockType: z.infer<typeof BlockTypeEnum>,
	blockConfig: unknown,
	components: z.infer<typeof ComponentEntrySchema>[],
) => {
	const blockConfigJson = JSON.stringify(blockConfig ?? null, null, 2)
	const componentListJson = JSON.stringify(components, null, 2)

	return `You are generating the edit.js source file for a WordPress Block Editor block.

## Goal
Produce a complete, valid edit module for @wordpress/blocks: the React component passed as the \`edit\` property of registerBlockType (this project imports it as \`import Edit from './edit'\`, so use a default export for the Edit component). Use JSX, WordPress packages indicated by each component's registryPackage, and apiVersion 3 patterns.

## Block configuration
The following JSON matches block.json–oriented fields from the composer (name, title, description, category, icon, keywords, textdomain, apiVersion, version, render, parent, ancestor, allowedBlocks, supports, attributes). Use it for InspectorControls, toolbar behavior, and attribute keys/types. If attributes are defined, bind controls with setAttributes and match types.

## Block save mode
blockType is "${blockType}". For dynamic blocks the editor UI is unchanged; do not add PHP. For static blocks, keep editor preview consistent with typical static patterns.

## Component tree
The following JSON is a flat list of selected editor UI components. Fields include id, registryName, label, parentId, order, options, attributeValue, attributeType, registryPackage. Interpret parentId and order as a tree: render roots in order, nest children under their parent. Import each registryName from its registryPackage. Map components to the correct context (main edit area vs InspectorControls vs BlockControls) per WordPress conventions.

## Requirements
- ES module imports; include @wordpress/block-editor / @wordpress/components / @wordpress/blocks / @wordpress/element as needed.
- Default export: the main Edit function or component receiving { attributes, setAttributes } from the block editor.
- Destructure all attributes defined in blockConfig into edit.js, e.g. const {myValue,myAlternateValue} = attributes;
- Use those values throughout the edit.js e.g. value={myTest}
- Use useBlockProps on the outer wrapper where appropriate.
- No placeholders: working JSX. If InnerBlocks appears, respect options (orientation, templateLock, etc.).
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
	console.log('body',parsed.data);

	if (!parsed.success) {
		throw createError({ statusCode: 400, message: 'Invalid request', data: parsed.error.flatten() })
	}

	const userContent = buildEditJsUserMessage(
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
