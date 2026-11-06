<script setup lang="ts">
import type { ThemeMode, ThemePresetDefinition } from '@/typings/theme';

import { computed, shallowRef } from 'vue';
import { useLocale } from 'vuetify';

import SettingsDivider from '@/layouts/modules/theme-drawer/SettingsDivider.vue';
import { useThemeStore } from '@/stores/theme';
import { THEME_PRESETS } from '@/theme/presets';

interface PresetCard {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly primary: string;
  readonly modeIcon: string;
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
  THEME_PRESETS.map((preset) => ({
    id: preset.id,
    name: t(preset.nameKey),
    description: t(preset.descriptionKey),
    primary: preset.settings.primary ?? themeStore.primary,
    modeIcon: MODE_ICONS[preset.settings.mode ?? 'system'],
    preset,
  })),
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
        class="p-3 transition"
        variant="outlined"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="truncate text-title-small text-primary">{{ preset.name }}</div>
            <p class="mt-1 text-body-small text-medium-emphasis">{{ preset.description }}</p>
          </div>

          <span class="flex flex-none items-center gap-1.5">
            <span
              class="h-5 w-5 rounded-full border border-black/10"
              :style="{ backgroundColor: preset.primary }"
            />
            <VIcon :icon="preset.modeIcon" size="18" />
          </span>
        </div>

        <div class="mt-3 flex items-center justify-between">
          <span class="text-label-small text-medium-emphasis">{{ preset.primary }}</span>
          <VBtn
            color="primary"
            rounded="pill"
            size="small"
            variant="outlined"
            @click="applyPreset(preset.preset)"
          >
            {{ t('theme.preset.apply') }}
          </VBtn>
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
