<script setup lang="ts">
import { useLocale } from 'vuetify';

import SettingsItem from '@/layouts/modules/theme-drawer/SettingsItem.vue';
import ThemeColorPicker from '@/layouts/modules/theme-drawer/ThemeColorPicker.vue';
import ThemeModePicker from '@/layouts/modules/theme-drawer/ThemeModePicker.vue';
import ThemeRadius from '@/layouts/modules/theme-drawer/ThemeRadius.vue';
import { useThemeStore } from '@/stores/theme';

const { t } = useLocale();
const themeStore = useThemeStore();

function onGrayscaleChange(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.setGrayscale(value);
  }
}

function onColourWeaknessChange(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.setColourWeakness(value);
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <ThemeModePicker />

    <SettingsItem :label="t('theme.appearance.grayscale')">
      <VSwitch
        color="primary"
        density="compact"
        hide-details
        :model-value="themeStore.grayscale"
        @update:model-value="onGrayscaleChange"
      />
    </SettingsItem>

    <SettingsItem :label="t('theme.appearance.colourWeakness')">
      <VSwitch
        color="primary"
        density="compact"
        hide-details
        :model-value="themeStore.colourWeakness"
        @update:model-value="onColourWeaknessChange"
      />
    </SettingsItem>

    <ThemeColorPicker />
    <ThemeRadius />
  </div>
</template>
