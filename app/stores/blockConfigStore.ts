import { defineStore } from 'pinia'
import { ref } from 'vue'

import { BlockOptionsSchema } from '~/types/schemas/blockJsonSchema'

export const useBlockConfigStore = defineStore('blockConfig', () => {

	const blockType = ref('static') as Ref<'static' | 'dynamic'>;
	const { data: defaults } = BlockOptionsSchema.safeParse({})
	
	const blockConfigState = ref<Partial<BlockOptionsSchema>>({ 
		...defaults
	});

	const setBlockOptions = (data: BlockOptionsSchema) => {
		if(!data) {
			throw new Error('No data provided')
		}
		blockConfigState.value = data; 
	}

	return {
		blockType,
		blockConfigState,
		setBlockOptions,
	}

});