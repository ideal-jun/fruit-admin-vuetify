<script setup lang="ts">
import type { ThemeMode } from '@/typings/theme';

import { computed } from 'vue';
import { useLocale } from 'vuetify';

import AppIconButton from '@/components/common/AppIconButton.vue';
import { useThemeStore } from '@/stores/theme';

/** One icon per mode: light / dark / follow the OS. */
const MODE_ICONS: Record<ThemeMode, string> = {
  light: 'mdi-white-balance-sunny',
  system: 'mdi-brightness-auto',
  dark: 'mdi-weather-night',
};

const { t } = useLocale();
const themeStore = useThemeStore();

const icon = computed(() => MODE_ICONS[themeStore.mode]);
</script>

<template>
  <AppIconButton :icon="icon" :tooltip="t('layout.toggleTheme')" @click="themeStore.cycleMode()" />
</template>
