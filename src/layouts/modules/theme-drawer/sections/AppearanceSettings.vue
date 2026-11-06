<script setup lang="ts">
import { useLocale } from 'vuetify';

import SettingsItem from '@/layouts/modules/theme-drawer/SettingsItem.vue';
import ThemeColorPicker from '@/layouts/modules/theme-drawer/ThemeColorPicker.vue';
import ThemeModePicker from '@/layouts/modules/theme-drawer/ThemeModePicker.vue';
import { useThemeStore } from '@/stores/theme';

const { t } = useLocale();
const themeStore = useThemeStore();

function onRadiusChange(value: number | null) {
  if (value !== null && Number.isFinite(value)) {
    themeStore.setRadius(Math.round(value));
  }
}

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
    <ThemeColorPicker />

    <SettingsItem :label="t('theme.appearance.radius')">
      <VNumberInput
        control-variant="stacked"
        density="compact"
        hide-details
        :max="24"
        max-width="160"
        :min="0"
        :model-value="themeStore.radius"
        :step="1"
        variant="outlined"
        @update:model-value="onRadiusChange"
      />
    </SettingsItem>

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
  </div>
</template>
