<template>
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
    <div class="space-y-6">
      <h3 class="text-lg font-sans text-monokai-fg">
        <slot name="left-title" />
      </h3>
      <slot name="left-content" />
      <slot name="button" />
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-end m-0">
        <h3 class="text-lg font-sans text-monokai-fg">
          <slot name="preview-title" />
        </h3>
      </div>
      <slot name="preview-content" />
    </div>
  </div>
</template>