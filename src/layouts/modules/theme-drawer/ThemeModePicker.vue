<script setup lang="ts">
import type { ThemeMode } from '@/typings/theme';

import { computed } from 'vue';
import { useLocale } from 'vuetify';

import { useThemeStore } from '@/stores/theme';
import { isThemeMode } from '@/theme/appearance';

interface ModeOption {
  readonly value: ThemeMode;
  readonly icon: string;
  readonly label: string;
}

const { t } = useLocale();
const themeStore = useThemeStore();

const options = computed<ModeOption[]>(() => [
  { value: 'light', icon: 'mdi-white-balance-sunny', label: t('theme.modeLight') },
  { value: 'dark', icon: 'mdi-weather-night', label: t('theme.modeDark') },
  { value: 'system', icon: 'mdi-theme-light-dark', label: t('theme.modeSystem') },
]);

function onModeChange(value: unknown) {
  if (isThemeMode(value)) {
    themeStore.setMode(value);
  }
}
</script>

<template>
  <section>
    <div class="mb-2 text-label-large text-medium-emphasis">{{ t('theme.mode') }}</div>

    <VTabs
      density="compact"
      grow
      inset
      :model-value="themeStore.mode"
      :show-arrows="false"
      @update:model-value="onModeChange"
    >
      <VTab
        v-for="option in options"
        :key="option.value"
        :aria-label="option.label"
        :value="option.value"
      >
        <VIcon :icon="option.icon" size="20" />
      </VTab>
    </VTabs>
  </section>
</template>
