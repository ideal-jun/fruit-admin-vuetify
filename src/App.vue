<script lang="ts" setup>
import { watchEffect } from 'vue';

import { usePageTitle } from '@/composables/usePageTitle';
import { useThemeStore } from '@/stores/theme';

// Creating the store applies the persisted appearance settings (theme mode + primary
// color) before the shell renders, so there is no flash of the default theme.
useThemeStore();

const { documentTitle } = usePageTitle();

// Route-aware document title (the i18n plugin only owns <html lang>).
watchEffect(() => {
  if (typeof document !== 'undefined') {
    document.title = documentTitle.value;
  }
});
</script>

<template>
  <VApp>
    <RouterView />
  </VApp>
</template>
