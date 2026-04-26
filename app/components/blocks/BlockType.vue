<script
	setup
	lang="ts"
>
const blockConfigStore = useBlockConfigStore();

const blockTypeItems = ([
	{
		label: 'Static Block',
		value: 'static',
		description: 'Static blocks store the content directly in the database. Best for simple, fixed content that does not need to be dynamically generated when the page loads.',
	},
	{
		label: 'Dynamic Block',
		value: 'dynamic',
		description: 'Dynamic blocks render their content on the server each time the page loads, allowing output to always be up to date and based on dynamic data or user input. Use for blocks that have content that changes often or syncs with external sources.'
	}
])

</script>
<template>
	<h3>Block Type</h3>
	<URadioGroup
		v-model="blockConfigStore.blockType"
		:items="blockTypeItems"
		color="primary"
		variant="table"
		default-value="static"
	/>
</template>