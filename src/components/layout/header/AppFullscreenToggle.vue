<script setup lang="ts">
import { useLocale } from 'vuetify';

import AppIconButton from '@/components/common/AppIconButton.vue';
import { useFullscreen } from '@/composables/useFullscreen';

const { t } = useLocale();
const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <AppIconButton
    :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
    :tooltip="isFullscreen ? t('layout.exitFullscreen') : t('layout.fullscreen')"
    @click="toggle"
  />
</template>
