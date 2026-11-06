<script setup lang="ts">
import { useLocale } from 'vuetify';

import SettingsDivider from '@/layouts/modules/theme-drawer/SettingsDivider.vue';
import SettingsItem from '@/layouts/modules/theme-drawer/SettingsItem.vue';
import { useThemeStore } from '@/stores/theme';

const { t } = useLocale();
const themeStore = useThemeStore();

function onRadiusChange(value: number | null) {
  if (value !== null && Number.isFinite(value)) {
    themeStore.setRadius(Math.round(value));
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <SettingsDivider :title="t('theme.appearance.radiusTitle')" />

    <SettingsItem :label="t('theme.appearance.radius')">
      <VNumberInput
        control-variant="stacked"
        density="compact"
        hide-details
        :max="16"
        max-width="160"
        :min="0"
        :model-value="themeStore.radius"
        :step="1"
        variant="outlined"
        @update:model-value="onRadiusChange"
      />
    </SettingsItem>
  </div>
</template>
