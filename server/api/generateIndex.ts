import { z } from 'zod'
import { findRegistryEntry } from '~~/shared/wpComponentRegistry'

const ComponentObjectSchema = z.object({
	registryName: z.string()
}).passthrough()

const BlockTypeEnum = z.enum(['static', 'dynamic'])

const RequestSchema = z.object({
	componentObjects: z.array(ComponentObjectSchema),
	blockType: BlockTypeEnum,
})

const buildComponentImportLines = (componentObjects: z.infer<typeof ComponentObjectSchema>[]) => {
	const byPackage = new Map<string, Set<string>>()

	for (const component of componentObjects) {
		const entry = findRegistryEntry(component.registryName)
		if (!entry) continue
		const names = byPackage.get(entry.registryPackage) ?? new Set();
		names.add(entry.name)
		byPackage.set(entry.registryPackage, names)
	}

	const lines: string[] = []
	const sortedPackages = [...byPackage.keys()].sort()
	for (const wpPackage of sortedPackages) {
		const names = [...byPackage.get(wpPackage)!].sort();
		lines.push(`import { ${names.join(', ')} } from '${wpPackage}';`)
	}
	return lines
}

const buildIndexJs = (componentObjects: z.infer<typeof ComponentObjectSchema>[], blockType: z.infer<typeof BlockTypeEnum>) => {
	const componentImports = buildComponentImportLines(componentObjects);
	let blockSaveType;
	if(blockType === 'dynamic') {
		blockSaveType = '\tsave: () => null,';
	} else {
		blockSaveType = '\tsave: Save,';
	}	
	const parts = [
		`import { registerBlockType } from '@wordpress/blocks';`,
		...componentImports,
		`import metadata from './block.json';`,
		`import Edit from './edit';`,
		`import Save from './save';`,
		`import './style.scss';`,
		`import './editor.scss';`,
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

	const response = buildIndexJs(parsed.data.componentObjects, parsed.data.blockType)
	return { markdown: '```javascript\n' + response + '\n```' }
})
