<script setup lang="ts">
import { useLocale } from 'vuetify';

import { useThemeStore } from '@/stores/theme';
import { PRIMARY_COLOR_SWATCHES } from '@/theme/appearance';

const { t } = useLocale();
const themeStore = useThemeStore();

/** VColorPicker lays swatches out as columns, not a flat list. */
const SWATCH_COLUMNS: readonly string[][] = [
  PRIMARY_COLOR_SWATCHES.slice(0, 5),
  PRIMARY_COLOR_SWATCHES.slice(5),
];

function onPrimaryChange(value: string | null) {
  if (value) {
    themeStore.setPrimary(value);
  }
}
</script>

<template>
  <section>
    <div class="mb-2 flex items-center justify-between">
      <span class="text-label-large text-medium-emphasis">{{ t('theme.primary') }}</span>
      <span class="text-label-small text-medium-emphasis">{{ themeStore.primary }}</span>
    </div>

    <VColorInput
      density="compact"
      hide-details
      :model-value="themeStore.primary"
      show-swatches
      :swatches="SWATCH_COLUMNS"
      variant="outlined"
      @update:model-value="onPrimaryChange"
    />
  </section>
</template>
