<script
	setup
	lang="ts"
>
const route = useRoute();
const router = useRouter();

const steps = [
	{ value: 'build', title: 'Build', description: 'Choose components', icon: 'i-lucide-blocks' },
	{ value: 'configure', title: 'Configure', description: 'Configure settings', icon: 'i-lucide-settings' },
	{ value: 'generate', title: 'Generate', description: 'Generate code', icon: 'i-lucide-code' },
	{ value: 'output', title: 'Download', description: 'Download files', icon: 'i-lucide-download' }
];

const currentStep = computed(() => {
	const path = route.path.replace(/^\//, '');
	return steps.some(s => s.value === path) ? path : 'build';
});

function onStepChange(value: string | number | undefined) {
	router.push(`/${value}`);
}
</script>

<template>
	<UStepper
		:items="steps"
		:model-value="currentStep"
		:linear="false"
		:ui="{
			root: 'pt-[90px] max-md:pt-[120px]',
			trigger: 'hover:group-data-[state=completed]:bg-monokai-yellow hover:group-data-[state=completed]:text-black! hover:group-data-[state=active]:text-black! group-data-[state=active]:bg-monokai-yellow cursor-pointer hover:text-monokai-yellow transition-all',
			separator: 'transition-all',
		}"
		@update:model-value="onStepChange"
	/>
</template>
