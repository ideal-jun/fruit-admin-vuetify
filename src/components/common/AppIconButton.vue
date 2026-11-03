<script setup lang="ts">
interface Props {
  /** MDI icon name. */
  icon: string;
  /** Tooltip text; the tooltip is disabled when empty. */
  tooltip?: string;
}

defineOptions({ inheritAttrs: false });

const { icon, tooltip = '' } = defineProps<Props>();
</script>

<template>
  <VTooltip :disabled="tooltip === ''" location="bottom" :text="tooltip">
    <template #activator="{ props }">
      <VBtn
        v-bind="{ ...$attrs, ...props }"
        :aria-label="tooltip === '' ? icon : tooltip"
        class="text-medium-emphasis"
        :icon="icon"
        rounded="lg"
        size="small"
        variant="text"
      />
    </template>
  </VTooltip>
</template>
