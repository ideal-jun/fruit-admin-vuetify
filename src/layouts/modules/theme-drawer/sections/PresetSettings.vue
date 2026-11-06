<script setup lang="ts">
import type { ThemeColorKey, ThemeMode, ThemePresetDefinition } from '@/typings/theme';

import { computed, shallowRef } from 'vue';
import { useLocale } from 'vuetify';

import SettingsDivider from '@/layouts/modules/theme-drawer/SettingsDivider.vue';
import { useThemeStore } from '@/stores/theme';
import { THEME_PRESETS } from '@/theme/presets';

interface PresetColor {
  readonly key: ThemeColorKey;
  readonly color: string;
}

interface PresetCard {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly colors: readonly PresetColor[];
  readonly modeIcon: string;
  readonly grayscale: boolean;
  readonly preset: ThemePresetDefinition;
}

const MODE_ICONS: Record<ThemeMode, string> = {
  light: 'mdi-white-balance-sunny',
  dark: 'mdi-weather-night',
  system: 'mdi-theme-light-dark',
};

const { t } = useLocale();
const themeStore = useThemeStore();

const applied = shallowRef(false);

const presetCards = computed<PresetCard[]>(() =>
  THEME_PRESETS.map((preset) => {
    const primary = preset.settings.primary ?? themeStore.primary;
    const otherColors = { ...themeStore.otherColors, ...preset.settings.otherColors };
    const infoFollowsPrimary =
      preset.settings.isInfoFollowPrimary ?? themeStore.isInfoFollowPrimary;

    return {
      id: preset.id,
      name: t(preset.nameKey),
      description: t(preset.descriptionKey),
      version: preset.version,
      colors: [
        { key: 'primary', color: primary },
        { key: 'info', color: infoFollowsPrimary ? primary : otherColors.info },
        { key: 'success', color: otherColors.success },
        { key: 'warning', color: otherColors.warning },
        { key: 'error', color: otherColors.error },
      ],
      modeIcon: MODE_ICONS[preset.settings.mode ?? 'system'],
      grayscale: preset.settings.grayscale ?? false,
      preset,
    };
  }),
);

function applyPreset(preset: ThemePresetDefinition) {
  themeStore.applySettings(preset.settings);
  applied.value = true;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SettingsDivider :title="t('theme.preset.title')" />

    <div class="flex flex-col gap-3">
      <VCard
        v-for="preset in presetCards"
        :key="preset.id"
        class="preset-card p-3 transition hover:-translate-y-0.5 hover:shadow-md"
        rounded="lg"
        variant="outlined"
      >
        <div class="mb-2 flex items-center justify-between gap-2">
          <div class="flex min-w-0 flex-1 items-center gap-2">
            <span class="truncate text-title-small text-primary">{{ preset.name }}</span>
            <VChip class="flex-none opacity-80" color="info" size="x-small" variant="tonal">
              v{{ preset.version }}
            </VChip>
          </div>

          <VBtn
            class="flex-none"
            color="primary"
            rounded="pill"
            size="x-small"
            variant="outlined"
            @click="applyPreset(preset.preset)"
          >
            {{ t('theme.preset.apply') }}
          </VBtn>
        </div>

        <p class="mb-3 line-clamp-2 text-body-small text-medium-emphasis">
          {{ preset.description }}
        </p>

        <div class="flex items-center justify-between">
          <div class="flex gap-1">
            <span
              v-for="color in preset.colors"
              :key="color.key"
              class="h-3 w-3 rounded-full border border-black/10 transition-transform hover:scale-110"
              :class="{ 'ring-1 ring-primary/50': color.key === 'primary' }"
              :style="{ backgroundColor: color.color }"
              :title="color.key"
            />
          </div>

          <div class="flex items-center gap-1 text-medium-emphasis">
            <VIcon :icon="preset.modeIcon" size="16" />
            <VIcon v-if="preset.grayscale" icon="mdi-contrast-circle" size="16" />
          </div>
        </div>
      </VCard>
    </div>

    <VSnackbar
      v-model="applied"
      location="bottom"
      :text="t('theme.preset.applied')"
      timeout="1800"
    />
  </div>
</template>

<style scoped>
/* Soybean's preset cards use a much softer border than Vuetify's outlined default. */
.preset-card.v-card {
  border-color: rgba(var(--v-border-color), calc(var(--v-border-opacity) * 0.5));
}
</style>
