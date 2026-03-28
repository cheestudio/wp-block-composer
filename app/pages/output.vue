<script setup lang="ts">
definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'Output — WP Block Composer' })
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-2">
      Step 4: Code Output
    </h2>
    <p class="text-gray-500 dark:text-gray-400 mb-6">
      View generated files with syntax highlighting, copy individual files, or download everything as a ZIP.
    </p>

    <UButton
      label="Placeholder"
      color="neutral"
      variant="outline"
      disabled
    />
  </div>
</template>
