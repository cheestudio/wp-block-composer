<script
	setup
	lang="ts"
>
import { useAnimate } from 'motion-v'
const route = useRoute()
const router = useRouter()
const [scope, animate] = useAnimate();
const steps = [
	{ value: 'build', title: 'Build', description: 'Choose components', icon: 'i-lucide-blocks' },
	{ value: 'configure', title: 'Configure', description: 'Configure settings', icon: 'i-lucide-settings' },
	{ value: 'generate', title: 'Generate', description: 'Generate code', icon: 'i-lucide-code' },
	{ value: 'output', title: 'Download', description: 'Download files', icon: 'i-lucide-download' }
]

const currentStep = computed(() => {
	const path = route.path.replace(/^\//, '')
	return steps.some(s => s.value === path) ? path : 'build'
})

function onStepChange(value: string | number | undefined) {
	router.push(`/${value}`)
}

// onMounted(() => {
// 	animate('.logo-wrap', { height:'100px',opacity: 1, background:"transparent" })
// })

watch(scope, () => {
	const animation = animate([
		['.logo', { opacity: 1 }, { duration: 1 }],
		['.logo', { transform: "translate(0)", top: '40px' }, { duration: 0.8, ease: [0.77, 0, 0.175, 1] }],
		['.loader', { opacity: 0 }],
		['.loader', { display: 'none' }],
	])

	return () => animation.stop();

})

</script>

<template>
	<div
		ref="scope"
		class="min-h-screen flex flex-col"
	>
		<div class="loader absolute w-full h-full inset-0 pointer-events-none bg-monokai-bg z-100" />
		<header class="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
			<div class="max-w-5xl mx-auto">
				<div class="logo absolute w-full left-0 right-0 top-[30%] -translate-y-1/2 opacity-0 z-110">
					<h1 class="text-[30px] font-normal text-monokai-fg text-center mx-auto flex items-center justify-center gap-2 m-0">
						<UIcon
							name="i-lucide-blocks"
							class="size-10 text-monokai-fg relative -top-1"
							color="primary"
						/>
						WP <span class="text-monokai-yellow">Block</span> Composer
					</h1>
				</div>
				<UStepper
					:items="steps"
					:model-value="currentStep"
					:linear="false"
					:ui="{
						root: 'pt-[90px]',
						trigger: 'hover:group-data-[state=completed]:bg-monokai-yellow hover:group-data-[state=completed]:text-black! hover:group-data-[state=active]:text-black! group-data-[state=active]:bg-monokai-yellow cursor-pointer hover:text-monokai-yellow transition-all',
						separator: 'transition-all',
					}"
					@update:model-value="onStepChange"
				/>
			</div>
		</header>

		<main class="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
			<slot />
		</main>

	</div>
</template>
