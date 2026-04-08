import { z } from 'zod'
import { BlockOptionsSchema } from '~~/app/types/schemas/blockJsonSchema'

const RequestSchema = z.object({
  blockOptions: BlockOptionsSchema,
  blockType: z.enum(['static', 'dynamic']),
})

type BlockJson = Record<string, unknown>

const omitEmpty = <T>(val: T[] | undefined): T[] | undefined =>
  val && val.length > 0 ? val : undefined

const omitBlank = (val: string | undefined | null): string | undefined =>
  val && val.trim().length > 0 ? val.trim() : undefined

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = RequestSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'Invalid block configuration', data: parsed.error.flatten() })
  }

  const { blockOptions, blockType } = parsed.data

  const icon = omitBlank(blockOptions.icon)
    ? `dashicons-${blockOptions.icon!.replace(/^dashicons-/, '')}`
    : undefined

  const blockJson: BlockJson = {
    $schema: 'https://schemas.wp.org/trunk/block.json',
    apiVersion: blockOptions.apiVersion,
    name: blockOptions.name,
    version: blockOptions.version || '0.1.0',
    title: blockOptions.title,
    ...(omitBlank(blockOptions.description) && { description: blockOptions.description }),
    category: blockOptions.category,
    ...(icon && { icon }),
    ...(omitEmpty(blockOptions.keywords) && { keywords: blockOptions.keywords }),
    ...(omitBlank(blockOptions.textdomain) && { textdomain: blockOptions.textdomain }),
    ...(omitEmpty(blockOptions.parent) && { parent: blockOptions.parent }),
    ...(omitEmpty(blockOptions.ancestor) && { ancestor: blockOptions.ancestor }),
    ...(omitEmpty(blockOptions.allowedBlocks) && { allowedBlocks: blockOptions.allowedBlocks }),
    attributes: {},
    ...(blockOptions.supports && { supports: blockOptions.supports }),
    editorScript: 'file:./index.js',
    style: 'file:./style-index.css',
    editorStyle: 'file:./index.css',
    ...(blockType === 'dynamic' && { render: 'file:./render.php' }),
  }

  return blockJson
})
