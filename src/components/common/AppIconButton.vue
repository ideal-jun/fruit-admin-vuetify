<script setup lang="ts">
interface Props {
  /** MDI icon name. */
  icon: string;
  /** Tooltip text; the tooltip is disabled when empty. */
  tooltip?: string;
  /** An action is in flight: spin the icon and expose the busy state. */
  loading?: boolean;
}

defineOptions({ inheritAttrs: false });

const { icon, tooltip = '', loading = false } = defineProps<Props>();
</script>

<template>
  <VTooltip :disabled="tooltip === ''" location="bottom" :text="tooltip">
    <template #activator="{ props }">
      <VBtn
        v-bind="{ ...$attrs, ...props }"
        :aria-busy="loading ? 'true' : undefined"
        :aria-label="tooltip === '' ? icon : tooltip"
        :class="['text-medium-emphasis', { 'app-icon-button--loading': loading }]"
        :icon="icon"
        rounded="lg"
        size="small"
        variant="text"
      />
    </template>
  </VTooltip>
</template>

<style scoped>
/* Loading state keeps the button's own icon and spins it (e.g. a refresh action). */
.app-icon-button--loading :deep(.v-icon) {
  animation: app-icon-button-spin 1s linear infinite;
}

@keyframes app-icon-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
