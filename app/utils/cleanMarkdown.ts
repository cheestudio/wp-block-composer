export function cleanMarkdown(input: string | null | undefined): string | null {
	if (!input) return null;

	return input
		.replace(/^```(?:javascript|php|ts|typescript|jsx|tsx|json)?\s*/i, '')
		.replace(/\s*```$/i, '');
}
