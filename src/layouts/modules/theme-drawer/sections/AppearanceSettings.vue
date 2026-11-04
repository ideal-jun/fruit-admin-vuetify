<script setup lang="ts">
import { useLocale } from 'vuetify';

import SettingDivider from '@/layouts/modules/theme-drawer/SettingDivider.vue';
import SettingItem from '@/layouts/modules/theme-drawer/SettingItem.vue';
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
    <SettingDivider :title="t('theme.appearance.title')" />

    <ThemeModePicker />
    <ThemeColorPicker />

    <SettingItem :label="t('theme.appearance.radius')">
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
    </SettingItem>

    <SettingItem :label="t('theme.appearance.grayscale')">
      <VSwitch
        color="primary"
        density="compact"
        hide-details
        :model-value="themeStore.grayscale"
        @update:model-value="onGrayscaleChange"
      />
    </SettingItem>

    <SettingItem :label="t('theme.appearance.colourWeakness')">
      <VSwitch
        color="primary"
        density="compact"
        hide-details
        :model-value="themeStore.colourWeakness"
        @update:model-value="onColourWeaknessChange"
      />
    </SettingItem>
  </div>
</template>
