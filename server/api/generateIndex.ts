import { z } from 'zod'

const BlockTypeEnum = z.enum(['static', 'dynamic'])

const RequestSchema = z.object({
	componentObjects: z.array(z.object({ registryName: z.string() }).passthrough()).optional(),
	blockType: BlockTypeEnum,
})

const buildIndexJs = (blockType: z.infer<typeof BlockTypeEnum>) => {
	const blockSaveType = blockType === 'dynamic'
		? '\tsave: () => null,'
		: '\tsave: Save,';

	const parts = [
		`import { registerBlockType } from '@wordpress/blocks';`,
		`import metadata from './block.json';`,
		`import Edit from './edit';`,
		`import Save from './save';`,
		`// import './style.scss';`,
		`// import './editor.scss';`,
		'',
		`registerBlockType(metadata.name, {`,
		`\tedit: Edit,`,
		blockSaveType,
		`});`,
		'',
	]
	return parts.join('\n')
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const parsed = RequestSchema.safeParse(body);

	if (!parsed.success) {
		throw createError({ statusCode: 400, message: 'Invalid request', data: parsed.error.flatten() })
	}

	const response = buildIndexJs(parsed.data.blockType)
	return { markdown: '```javascript\n' + response + '\n```' }
})
