<script setup lang="ts">
import type { TabAction, TabActionItem } from '@/typings/tabs';

import { computed } from 'vue';
import { useLocale } from 'vuetify';

interface Props {
  /** Whether the menu is visible. */
  open: boolean;
  /** Horizontal position of the right click, in viewport coordinates. */
  x: number;
  /** Vertical position of the right click, in viewport coordinates. */
  y: number;
  /** Actions rendered in the context menu. */
  options: readonly TabActionItem[];
}

interface Emits {
  /** The menu must close (outside click, Escape or a picked action). */
  close: [];
  /** The user picked one action. */
  select: [key: TabAction];
}

// Vue 3.5 reactive props destructure.
const { open, x, y, options } = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useLocale();

/** VMenu treats a coordinate pair as a virtual activator, so it opens at the click point. */
const target = computed<[number, number]>(() => [x, y]);

/**
 * Bridge the parent-owned `open` prop to VMenu's model: VMenu closes itself on
 * outside click/Escape and the setter forwards that as a `close` event.
 */
const visible = computed<boolean>({
  get: () => open,
  set: (value) => {
    if (!value) {
      emit('close');
    }
  },
});

/** VMenu closes on content click by default; forward the picked action as well. */
function selectAction(key: TabAction) {
  emit('select', key);
}
</script>

<template>
  <VMenu
    v-model="visible"
    :content-props="{ role: 'menu', 'aria-label': t('tabs.actions') }"
    context-menu
    location="bottom start"
    :target="target"
  >
    <VList density="compact" nav prepend-gap="12">
      <VListItem
        v-for="option in options"
        :key="option.key"
        class="mt-0"
        :disabled="option.disabled"
        :min-height="32"
        role="menuitem"
        :title="option.label"
        @click="selectAction(option.key)"
      >
        <template #prepend>
          <VIcon :icon="option.icon" size="16"></VIcon>
        </template>
      </VListItem>
    </VList>
  </VMenu>
</template>
