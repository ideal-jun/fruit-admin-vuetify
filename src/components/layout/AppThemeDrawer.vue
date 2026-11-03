<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useDisplay, useLocale } from 'vuetify';

import ConfigOperation from '@/components/layout/theme/ConfigOperation.vue';
import AppearanceSettings from '@/components/layout/theme/sections/AppearanceSettings.vue';
import GeneralSettings from '@/components/layout/theme/sections/GeneralSettings.vue';
import LayoutSettings from '@/components/layout/theme/sections/LayoutSettings.vue';
import PresetSettings from '@/components/layout/theme/sections/PresetSettings.vue';

type ThemeDrawerTab = 'appearance' | 'layout' | 'general' | 'preset';

interface ThemeDrawerTabOption {
  readonly value: ThemeDrawerTab;
  readonly title: string;
}

const THEME_DRAWER_TABS: readonly ThemeDrawerTab[] = ['appearance', 'layout', 'general', 'preset'];

const THEME_DRAWER_TAB_SET: ReadonlySet<string> = new Set<string>(THEME_DRAWER_TABS);

/** Two-way binding owned by BaseLayout: `<AppThemeDrawer v-model:open="themeDrawerOpen" />`. */
const open = defineModel<boolean>('open', { required: true });

const { t } = useLocale();
const { mobile } = useDisplay();

const activeTab = shallowRef<ThemeDrawerTab>('appearance');

/** Full width on phones, a fixed 400px panel on desktop. */
const drawerWidth = computed(() => (mobile.value ? 'min(90vw, 400px)' : 400));

const tabOptions = computed<ThemeDrawerTabOption[]>(() => [
  { value: 'appearance', title: t('theme.tabs.appearance') },
  { value: 'layout', title: t('theme.tabs.layout') },
  { value: 'general', title: t('theme.tabs.general') },
  { value: 'preset', title: t('theme.tabs.preset') },
]);

function isThemeDrawerTab(value: unknown): value is ThemeDrawerTab {
  return typeof value === 'string' && THEME_DRAWER_TAB_SET.has(value);
}

function onTabChange(value: unknown) {
  if (isThemeDrawerTab(value)) {
    activeTab.value = value;
  }
}
</script>

<template>
  <VNavigationDrawer v-model="open" location="right" order="-1" temporary :width="drawerWidth">
    <template #prepend>
      <div class="flex items-center justify-between px-4 pb-2 pt-3">
        <h2 class="text-title-medium">{{ t('theme.title') }}</h2>

        <VBtn
          :aria-label="t('$vuetify.close')"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="open = false"
        />
      </div>

      <VTabs
        class="mx-4"
        density="compact"
        grow
        inset
        :model-value="activeTab"
        :show-arrows="false"
        @update:model-value="onTabChange"
      >
        <VTab v-for="tab in tabOptions" :key="tab.value" min-width="30" :value="tab.value">
          {{ tab.title }}
        </VTab>
      </VTabs>
    </template>

    <VTabsWindow class="p-4" :model-value="activeTab">
      <VTabsWindowItem value="appearance">
        <AppearanceSettings />
      </VTabsWindowItem>

      <VTabsWindowItem value="layout">
        <LayoutSettings />
      </VTabsWindowItem>

      <VTabsWindowItem value="general">
        <GeneralSettings />
      </VTabsWindowItem>

      <VTabsWindowItem value="preset">
        <PresetSettings />
      </VTabsWindowItem>
    </VTabsWindow>

    <template #append>
      <VDivider />
      <ConfigOperation />
    </template>
  </VNavigationDrawer>
</template>
