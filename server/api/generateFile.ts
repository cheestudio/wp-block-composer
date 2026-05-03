import Anthropic from '@anthropic-ai/sdk'
import { modelPrompt, RequestSchema } from '../utils/modelPrompt'

const config = useRuntimeConfig()

const client = new Anthropic({
	apiKey: config.anthropicApiKey,
})

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const parsed = RequestSchema.safeParse(body)

	if (!parsed.success) {
		throw createError({ statusCode: 400, message: 'Invalid request', data: parsed.error.flatten() })
	}

	const userContent = modelPrompt(
		parsed.data
	)

	const params: Anthropic.MessageCreateParams = {
		model: 'claude-haiku-4-5-20251001',
		max_tokens: 8192,
		messages: [{ role: 'user', content: userContent }],
	}

	const message: Anthropic.Message = await client.messages.create(params);

	return { message: message.content }
})
