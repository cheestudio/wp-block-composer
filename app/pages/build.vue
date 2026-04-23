<script setup lang="ts">
useSeoMeta({ title: 'Build — WP Block Composer' })

const componentStore = useComponentStore()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold mb-1">
          Build Component Tree
        </h2>
        <p class="text-gray-500 dark:text-gray-400">
          Select developer components from the @wordpress library and arrange them into the edit.js structure for your block.
        </p>
      </div>
    </div>

    <ComponentBuilder />

    <!-- Navigation -->
    <div class="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
      <UButton
        label="Next: Configure"
        icon="i-lucide-arrow-right"
        trailing
        color="primary"
				variant="outline"
        :disabled="componentStore.isEmpty"
        to="/configure"
      />
    </div>
  </div>
</template>
