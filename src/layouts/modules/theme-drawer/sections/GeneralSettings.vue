<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from 'vuetify';

import SettingsDivider from '@/layouts/modules/theme-drawer/SettingsDivider.vue';
import SettingsItem from '@/layouts/modules/theme-drawer/SettingsItem.vue';
import { useThemeStore } from '@/stores/theme';
import { isWatermarkTimeFormat, WATERMARK_TIME_FORMATS } from '@/theme/appearance';

const { t } = useLocale();
const themeStore = useThemeStore();

/** Literal patterns, not translated labels. */
const timeFormatOptions = WATERMARK_TIME_FORMATS.map((format) => ({
  title: format,
  value: format,
}));

/** The custom text is only used when neither the user name nor the time is enabled. */
const showWatermarkText = computed(
  () =>
    themeStore.watermark.visible &&
    !themeStore.watermark.enableUserName &&
    !themeStore.watermark.enableTime,
);

const showWatermarkTimeFormat = computed(
  () => themeStore.watermark.visible && themeStore.watermark.enableTime,
);

function setSearchVisible(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.updateHeaderSettings({ searchVisible: value });
  }
}

function setLocaleVisible(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.updateHeaderSettings({ localeVisible: value });
  }
}

function setWatermarkVisible(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.updateWatermarkSettings({ visible: value });
  }
}

function setWatermarkText(value: unknown) {
  if (typeof value === 'string') {
    themeStore.updateWatermarkSettings({ text: value });
  }
}

/** User name and time are mutually exclusive watermark sources. */
function setWatermarkUsername(value: unknown) {
  if (typeof value !== 'boolean') {
    return;
  }

  themeStore.updateWatermarkSettings(
    value ? { enableUserName: true, enableTime: false } : { enableUserName: false },
  );
}

function setWatermarkTime(value: unknown) {
  if (typeof value !== 'boolean') {
    return;
  }

  themeStore.updateWatermarkSettings(
    value ? { enableTime: true, enableUserName: false } : { enableTime: false },
  );
}

function setWatermarkTimeFormat(value: unknown) {
  if (isWatermarkTimeFormat(value)) {
    themeStore.updateWatermarkSettings({ timeFormat: value });
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SettingsDivider :title="t('theme.general.title')" />

    <div class="flex flex-col gap-3">
      <SettingsItem :label="t('theme.general.searchVisible')">
        <VSwitch
          color="primary"
          density="compact"
          hide-details
          :model-value="themeStore.header.searchVisible"
          @update:model-value="setSearchVisible"
        />
      </SettingsItem>

      <SettingsItem :label="t('theme.general.localeVisible')">
        <VSwitch
          color="primary"
          density="compact"
          hide-details
          :model-value="themeStore.header.localeVisible"
          @update:model-value="setLocaleVisible"
        />
      </SettingsItem>
    </div>

    <SettingsDivider :title="t('theme.general.watermarkTitle')" />

    <div class="flex flex-col gap-3">
      <SettingsItem :label="t('theme.general.watermarkVisible')">
        <VSwitch
          color="primary"
          density="compact"
          hide-details
          :model-value="themeStore.watermark.visible"
          @update:model-value="setWatermarkVisible"
        />
      </SettingsItem>

      <template v-if="themeStore.watermark.visible">
        <SettingsItem :label="t('theme.general.watermarkUserName')">
          <VSwitch
            color="primary"
            density="compact"
            hide-details
            :model-value="themeStore.watermark.enableUserName"
            @update:model-value="setWatermarkUsername"
          />
        </SettingsItem>

        <SettingsItem :label="t('theme.general.watermarkTime')">
          <VSwitch
            color="primary"
            density="compact"
            hide-details
            :model-value="themeStore.watermark.enableTime"
            @update:model-value="setWatermarkTime"
          />
        </SettingsItem>

        <SettingsItem
          v-if="showWatermarkTimeFormat"
          :label="t('theme.general.watermarkTimeFormat')"
        >
          <VSelect
            density="compact"
            hide-details
            item-title="title"
            item-value="value"
            :items="timeFormatOptions"
            max-width="160"
            :model-value="themeStore.watermark.timeFormat"
            variant="outlined"
            @update:model-value="setWatermarkTimeFormat"
          />
        </SettingsItem>

        <SettingsItem v-if="showWatermarkText" :label="t('theme.general.watermarkText')">
          <VTextField
            density="compact"
            hide-details
            max-width="160"
            :model-value="themeStore.watermark.text"
            variant="outlined"
            @update:model-value="setWatermarkText"
          />
        </SettingsItem>
      </template>
    </div>
  </div>
</template>
