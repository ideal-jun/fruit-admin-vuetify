<script setup lang="ts">
import type { ThemeMode } from '@/typings/theme';

import { computed } from 'vue';
import { useLocale } from 'vuetify';

import SettingDivider from '@/layouts/modules/theme-drawer/SettingDivider.vue';
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
  { value: 'system', icon: 'mdi-brightness-auto', label: t('theme.modeSystem') },
  { value: 'dark', icon: 'mdi-weather-night', label: t('theme.modeDark') },
]);

function onModeChange(value: unknown) {
  if (isThemeMode(value)) {
    themeStore.setMode(value);
  }
}
</script>

<template>
  <section>
    <SettingDivider :title="t('theme.mode')"></SettingDivider>
    <VTabs
      class="shadow-none mx-16"
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
        min-width="30"
        :ripple="false"
        :value="option.value"
      >
        <VIcon :icon="option.icon" size="20" />
      </VTab>
    </VTabs>
  </section>
</template>
