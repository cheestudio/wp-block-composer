import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBlockFileStore = defineStore('blockFile', () => {

	const generatedBlockJson = ref<{ markdown: string } | null>(null);
	const generatedIndexJs = ref<{ markdown: string } | null>(null);
	const generatedEditJs = ref<string | null>(null);
	const generatedSaveJs = ref<string | null>(null);

	return {
		generatedBlockJson,
		generatedIndexJs,
		generatedEditJs,
		generatedSaveJs,
	}

});