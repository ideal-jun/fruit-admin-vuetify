<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from 'vuetify';

import AppIconButton from '@/components/common/AppIconButton.vue';

interface Props {
  /** Mobile viewport: the button opens the temporary drawer. */
  mobile?: boolean;
  /** Desktop: the sidebar is collapsed to a rail. */
  rail?: boolean;
}

interface Emits {
  /** The button was pressed — the layout owns the drawer / rail state. */
  toggle: [];
}

const { mobile = false, rail = false } = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useLocale();

const icon = computed(() => {
  if (mobile) {
    return 'mdi-menu';
  }

  return rail ? 'mdi-menu-open' : 'mdi-menu';
});

const tooltip = computed(() => {
  if (mobile) {
    return t('layout.openMenu');
  }

  return rail ? t('layout.expandSidebar') : t('layout.collapseSidebar');
});
</script>

<template>
  <AppIconButton :icon="icon" :tooltip="tooltip" @click="emit('toggle')" />
</template>
