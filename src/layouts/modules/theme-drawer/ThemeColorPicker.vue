<script setup lang="ts">
import type { ThemeColorKey } from '@/typings/theme';

import { computed } from 'vue';
import { useLocale } from 'vuetify';

import SettingsDivider from '@/layouts/modules/theme-drawer/SettingsDivider.vue';
import SettingsItem from '@/layouts/modules/theme-drawer/SettingsItem.vue';
import { useThemeStore } from '@/stores/theme';
import { PRIMARY_COLOR_SWATCHES } from '@/theme/appearance';

type ColorLabelKey =
  | 'theme.appearance.color.primary'
  | 'theme.appearance.color.info'
  | 'theme.appearance.color.success'
  | 'theme.appearance.color.warning'
  | 'theme.appearance.color.error';

interface ColorItem {
  readonly key: ThemeColorKey;
  readonly label: string;
  readonly value: string;
  readonly disabled: boolean;
}

const COLOR_KEYS: readonly ThemeColorKey[] = ['primary', 'info', 'success', 'warning', 'error'];

const COLOR_LABELS: Record<ThemeColorKey, ColorLabelKey> = {
  primary: 'theme.appearance.color.primary',
  info: 'theme.appearance.color.info',
  success: 'theme.appearance.color.success',
  warning: 'theme.appearance.color.warning',
  error: 'theme.appearance.color.error',
};

const { t } = useLocale();
const themeStore = useThemeStore();

const colorItems = computed<ColorItem[]>(() =>
  COLOR_KEYS.map((key) => ({
    key,
    label: t(COLOR_LABELS[key]),
    value: themeStore.themeColors[key],
    disabled: key === 'info' && themeStore.isInfoFollowPrimary,
  })),
);

function onColorChange(key: ThemeColorKey, value: string | null) {
  if (typeof value === 'string' && value) {
    themeStore.updateThemeColor(key, value);
  }
}

function onRecommendColorChange(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.setRecommendColor(value);
  }
}

function onFollowPrimaryChange(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.setInfoFollowPrimary(value);
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <SettingsDivider :title="t('theme.appearance.color.title')" />

    <SettingsItem :label="t('theme.appearance.recommendColor')">
      <VSwitch
        color="primary"
        density="compact"
        hide-details
        :model-value="themeStore.recommendColor"
        @update:model-value="onRecommendColorChange"
      />
    </SettingsItem>

    <SettingsItem v-for="item in colorItems" :key="item.key" :label="item.label">
      <template v-if="item.key === 'info'" #suffix>
        <VCheckbox
          color="primary"
          density="compact"
          hide-details
          :label="t('theme.appearance.color.followPrimary')"
          :model-value="themeStore.isInfoFollowPrimary"
          @update:model-value="onFollowPrimaryChange"
        />
      </template>

      <VColorInput
        :base-color="item.value"
        :color="item.value"
        color-pip
        density="compact"
        :disabled="item.disabled"
        hide-actions
        hide-details
        max-width="160"
        :menu-props="{ zIndex: 4000 }"
        :model-value="item.value"
        :modes="['hex']"
        open-on-focus
        pip-location="prepend-inner"
        :swatches="[PRIMARY_COLOR_SWATCHES]"
        variant="outlined"
        @update:model-value="onColorChange(item.key, $event)"
      />
    </SettingsItem>
  </div>
</template>
