<script lang="ts" setup>
import type { DefaultsInstance } from 'vuetify';

import { computed, watchEffect } from 'vue';

import { usePageTitle } from '@/composables/usePageTitle';
import { useThemeStore } from '@/stores/theme';

// Creating the store applies the persisted appearance settings (theme mode + primary
// color) before the shell renders, so there is no flash of the default theme.
const themeStore = useThemeStore();

const { documentTitle } = usePageTitle();

// Route-aware document title (the i18n plugin only owns <html lang>).
watchEffect(() => {
  if (typeof document !== 'undefined') {
    document.title = documentTitle.value;
  }
});

// Global default props for Vuetify components. A numeric `rounded` value becomes an
// inline border-radius, so the appearance drawer updates every rounded component at once.
// The layout roots (app bar + navigation drawer) stay flush; inputs get a safe cap for
// Vuetify's segmented outlined borders.
const defaultValue = computed<DefaultsInstance>(() => {
  const rounded = themeStore.radius;
  const fieldRounded = Math.min(rounded, 12);

  return {
    global: { rounded },
    // Vuetify layout components: keep the app bar and drawers flush.
    VAppBar: { rounded: 0 },
    VNavigationDrawer: { rounded: 0 },
    // Keep the components whose radius is part of their shape.
    VAvatar: { rounded: 'circle' },
    VBadge: { rounded: 'circle' },
    VChip: { rounded: 'pill' },
    VIconBtn: { rounded: 'circle' },
    VImg: { rounded: 0 },
    VProgressLinear: { rounded: 'pill' },
    VSlider: { rounded: 'pill' },
    // Inputs use the outlined-border-safe cap.
    VTextField: { rounded: fieldRounded },
    VSelect: { rounded: fieldRounded },
    VAutocomplete: { rounded: fieldRounded },
    VCombobox: { rounded: fieldRounded },
    VTextarea: { rounded: fieldRounded },
    VFileInput: { rounded: fieldRounded },
    VNumberInput: { rounded: fieldRounded },
    VField: { rounded: fieldRounded },
  };
});
</script>

<template>
  <VDefaultsProvider :defaults="defaultValue">
    <VApp>
      <RouterView />
    </VApp>
  </VDefaultsProvider>
</template>
