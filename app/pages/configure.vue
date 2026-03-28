<script setup lang="ts">
definePageMeta({ middleware: ['require-components'] })
useSeoMeta({ title: 'Configure — WP Block Composer' })

const componentStore = useComponentStore();
const { items } = storeToRefs(componentStore)

</script>


<template>
  <div>
    <h2 class="text-2xl font-semibold mb-2">
      Step 2: Configure Block
    </h2>
    <p class="text-gray-500 dark:text-gray-400 mb-6">
      Set the block type, metadata, attributes, supports, styles, and all block.json options.
    </p>

		<h2>Selected Components:</h2>

		<div v-for="item in items">

			<h3>{{item.label}} - {{item.registryName}}</h3>

		</div>
		

    <UButton
      label="Placeholder"
      color="neutral"
      variant="outline"
      disabled
    />
  </div>
</template>
