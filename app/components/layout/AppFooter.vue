<script
	setup
	lang="ts"
>

import type { NavigationMenuItem } from '@nuxt/ui'
const items: NavigationMenuItem[] = [
	{
		label: 'larsfaye.com',
		to: 'https://larsfaye.com',
		target: '_blank'
	}
]

</script>

<template>
	<UFooter>
		<template #left>
			<p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
		</template>

		<UNavigationMenu
			:items="items"
			variant="link"
		/>

		<template #right>
			<UButton
				icon="i-simple-icons-github"
				class="text-monokai-fg/50"
				variant="ghost"
				to="https://github.com/cheestudio/wp-block-composer"
				target="_blank"
				aria-label="GitHub"
			/>
		</template>
	</UFooter>
</template>
