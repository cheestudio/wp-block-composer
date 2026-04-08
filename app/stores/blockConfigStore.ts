import type { BlockOptionsSchema } from '~/types/schemas/blockJsonSchema';

export const useBlockConfigStore = defineStore('blockConfig', () => {

	const blockType = ref<'static' | 'dynamic'>('static');
	const blockOptions = ref<BlockOptionsSchema | null>(null);

	const setBlockOptions = (data: BlockOptionsSchema) => {
		blockOptions.value = data
	}

	return {
		blockOptions,
		setBlockOptions,
		blockType,
	}

});