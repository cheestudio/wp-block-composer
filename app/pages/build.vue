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
          Search the WordPress component registry, add components to your block, and arrange them with drag-and-drop nesting.
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
        :disabled="componentStore.isEmpty"
        to="/configure"
      />
    </div>
  </div>
</template>
