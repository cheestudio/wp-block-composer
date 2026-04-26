import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const BlockTypeEnum = z.enum(['static', 'dynamic']);
const ComponentEntrySchema = z.object({registryName: z.string()}).passthrough();
const BaseSchema = z.object({
	blockType: BlockTypeEnum,
	blockConfig: z.unknown(),
	components: z.array(ComponentEntrySchema),
})

const config = useRuntimeConfig()

const client = new Anthropic({
	apiKey: config.anthropicApiKey,
})

export function generateModel(prompt: (data: z.infer<typeof BaseSchema>) => string) {
	return defineEventHandler(async (event) => {
		const body = await readBody(event)
		const parsed = BaseSchema.safeParse(body)

		if (!parsed.success) {
			throw createError({ statusCode: 400, message: 'Invalid request', data: parsed.error.flatten() })
		}

		const params: Anthropic.MessageCreateParams = {
			model: 'claude-haiku-4-5-20251001',
			max_tokens: 8192,
			messages: [{
				role: 'user',
				content: prompt(parsed.data)
			}],
		}

		const message: Anthropic.Message = await client.messages.create(params)

		return { message: message.content }
	})
}


