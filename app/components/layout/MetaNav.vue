<script
	setup
	lang="ts"
>
const router = useRouter();
</script>

<template>
	<div class="absolute t-1 md:top-4 right-4 flex items-center gap-3 z-90">
		<UTooltip
			text="Start Over"
			:delay-duration="0"
		>
			<button
				aria-label="Start Over"
				tabindex="0"
				class="text-monokai-fg/50 hover:text-monokai-yellow transition-colors duration-200"
				@click="router.go(0)"
			>
				<UIcon
					name="i-lucide-refresh-cw"
					class="size-4.5"
				/>
			</button>
		</UTooltip>
		<UTooltip
			text="View on GitHub"
			:delay-duration="0"
		>
			<a
				href="https://github.com/cheestudio/wp-block-composer"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="View on GitHub"
				tabindex="0"
				class="text-monokai-fg/50 hover:text-monokai-yellow transition-colors duration-200"
			>
				<UIcon
					name="i-simple-icons-github"
					class="size-4.5"
				/>
			</a>
		</UTooltip>
	</div>
</template>
