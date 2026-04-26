const useBlockContext = () => {
	
	const componentStore = useComponentStore()
	const blockFileStore = useBlockFileStore()
	const blockConfigStore = useBlockConfigStore()
	const toast = useToast()

	const { items, flatOrdered } = storeToRefs(componentStore)
	const { blockType, blockConfigState } = storeToRefs(blockConfigStore)

	return {
		items,
		flatOrdered,
		blockType,
		blockFileStore,
		blockConfigState,
		toast,
	}

}

export { useBlockContext }