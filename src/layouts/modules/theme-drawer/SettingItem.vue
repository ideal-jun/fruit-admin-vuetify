<script setup lang="ts">
interface Props {
  /** Row label. */
  label: string;
}

const { label } = defineProps<Props>();
</script>

<template>
  <div class="flex w-full items-center justify-between gap-3">
    <div class="flex min-w-0 items-center gap-1">
      <span class="text-body-medium">{{ label }}</span>
      <slot name="suffix" />
    </div>
    <slot />
  </div>
</template>
