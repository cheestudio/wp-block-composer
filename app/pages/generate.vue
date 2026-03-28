<script setup lang="ts">
definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'Generate — WP Block Composer' })
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-2">
      Step 3: Review & Generate
    </h2>
    <p class="text-gray-500 dark:text-gray-400 mb-6">
      Review the assembled PRD, select which files to generate, and trigger code generation.
    </p>

    <UButton
      label="Placeholder"
      color="neutral"
      variant="outline"
      disabled
    />
  </div>
</template>
