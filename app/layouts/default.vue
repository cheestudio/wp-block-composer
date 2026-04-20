<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const steps = [
  { value: 'build', title: 'Build', description: 'Choose components', icon: 'i-lucide-blocks' },
  { value: 'configure', title: 'Configure', description: 'Configure settings', icon: 'i-lucide-settings' },
  { value: 'generate', title: 'Compile', description: 'Generate code', icon: 'i-lucide-code' },
  { value: 'output', title: 'Download', description: 'Download files', icon: 'i-lucide-download' }
]

const currentStep = computed(() => {
  const path = route.path.replace(/^\//, '')
  return steps.some(s => s.value === path) ? path : 'build'
})

function onStepChange(value: string | number | undefined) {
  router.push(`/${value}`)
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-gray-200 dark:border-gray-800 px-4 py-4">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-[30px] font-normal text-monokai-fg text-center  pb-10 mx-auto mt-5 mb-10 flex items-center justify-center gap-2">
					<UIcon name="i-lucide-blocks" class="size-10 text-monokai-fg relative -top-1" color="primary" />
          WP <span class="text-monokai-yellow">Block</span> Composer
        </h1>
        <UStepper
          :items="steps"
          :model-value="currentStep"
          :linear="false"
					:ui="{
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

    <UNotifications />
  </div>
</template>
