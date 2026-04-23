import { z } from 'zod'
import JSZip from 'jszip'

const RequestSchema = z.object({
  blockJson: z.string().optional(),
  indexJs: z.string().optional(),
  editJs: z.string().optional(),
  saveJs: z.string().optional(),
})

const cleanContent = (content: string | undefined, fileType: 'json' | 'javascript'): string | undefined => {
  if (!content) return undefined
  if (fileType === 'json') {
    return content.replace(/^```json\s*|\s*```$/g, '')
  }
  return content.replace(/^```javascript\s*|\s*```$/g, '')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = RequestSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'Invalid request data', data: parsed.error.flatten() })
  }

  const { blockJson, indexJs, editJs, saveJs } = parsed.data

  if (!blockJson && !indexJs && !editJs && !saveJs) {
    throw createError({ statusCode: 400, message: 'No files provided for download' })
  }

  const zip = new JSZip()

  const cleanedBlockJson = cleanContent(blockJson, 'json')
  const cleanedIndexJs = cleanContent(indexJs, 'javascript')
  const cleanedEditJs = cleanContent(editJs, 'javascript')
  const cleanedSaveJs = cleanContent(saveJs, 'javascript')

  if (cleanedBlockJson) zip.file('block.json', cleanedBlockJson)
  if (cleanedIndexJs) zip.file('index.js', cleanedIndexJs)
  if (cleanedEditJs) zip.file('edit.js', cleanedEditJs)
  if (cleanedSaveJs) zip.file('save.js', cleanedSaveJs)

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

  event.node.res.setHeader('Content-Type', 'application/zip')
  event.node.res.setHeader('Content-Disposition', 'attachment; filename="wp-block.zip"')

  return zipBuffer
})
