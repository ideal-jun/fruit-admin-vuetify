<script setup lang="ts">
import { useLocale } from 'vuetify';

import ThemeColorPicker from '@/components/layout/theme/ThemeColorPicker.vue';
import ThemeModePicker from '@/components/layout/theme/ThemeModePicker.vue';

/** Two-way binding owned by BaseLayout: `<AppThemeDrawer v-model="themeDrawerOpen" />`. */
const open = defineModel<boolean>({ required: true });

const { t } = useLocale();
</script>

<template>
  <VNavigationDrawer v-model="open" location="right" order="-1" temporary width="320">
    <div class="flex items-center justify-between px-4 py-3">
      <span class="text-title-medium">{{ t('theme.title') }}</span>
      <VBtn icon="mdi-close" size="small" variant="text" @click="open = false" />
    </div>

    <VDivider />

    <div class="flex flex-col gap-6 p-4">
      <ThemeModePicker />
      <ThemeColorPicker />
    </div>
  </VNavigationDrawer>
</template>
