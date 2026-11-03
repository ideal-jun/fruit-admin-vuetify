<script setup lang="ts">
import type { TabAction, TabActionItem } from '@/typings/tabs';

import { useLocale } from 'vuetify';

interface Props {
  /** Actions shared with the right-click context menu. */
  options: readonly TabActionItem[];
}

interface Emits {
  /** The user picked one action. */
  select: [key: TabAction];
}

// Vue 3.5 reactive props destructure.
const { options } = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useLocale();
</script>

<template>
  <VMenu location="bottom end">
    <template #activator="{ props: activatorProps }">
      <VBtn
        v-bind="activatorProps"
        :aria-label="t('tabs.actions')"
        class="text-medium-emphasis"
        density="comfortable"
        icon="mdi-dots-horizontal"
        rounded="lg"
        size="small"
        variant="text"
      />
    </template>
    <VList density="compact" nav prepend-gap="12">
      <VListItem
        v-for="option in options"
        :key="option.key"
        class="mt-0"
        :disabled="option.disabled"
        :min-height="32"
        :prepend-icon="option.icon"
        :title="option.label"
        @click="emit('select', option.key)"
      >
        <template #prepend>
          <VIcon :icon="option.icon" size="16" />
        </template>
      </VListItem>
    </VList>
  </VMenu>
</template>
