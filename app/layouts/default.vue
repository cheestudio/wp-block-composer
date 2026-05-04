<script
	setup
	lang="ts"
>
// Logo animation, emits to build.vue for welcome modal trigger
import { useAnimate } from 'motion-v'
const [scope, animate] = useAnimate();
const isReady = ref(false);
provide('isReady', isReady);
watch(scope, () => {
	const runAnimation = async () => {
		const animation = animate([
			['.logo', { opacity: 1 }, { duration: 1 }],
			['.logo', { transform: "translate(0)", top: '40px' }, { duration: 0.8, ease: [0.77, 0, 0.175, 1] }],
			['.loader', { opacity: 0 }],
			['.loader', { display: 'none' }],
		]);
		await animation;
		isReady.value = true;
		return () => animation.stop();
	}
	runAnimation();
});



</script>

<template>
	<div
		ref="scope"
		class="min-h-screen flex flex-col"
	>
		<div class="loader absolute w-full h-full inset-0 pointer-events-none bg-monokai-bg z-100" />
		<header class="border-b border-monokai-blue/20 px-4 py-4">
			<AppLogo />
			<div class="max-w-5xl mx-auto relative">
				<MetaNav />
				<AppNav />
			</div>
		</header>

		<main class="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
			<slot />
		</main>

		<AppFooter/>
		
	</div>





</template>
