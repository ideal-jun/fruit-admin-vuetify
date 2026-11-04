<script setup lang="ts">
import type { PageAnimateMode, TabMode } from '@/typings/theme';

import { computed } from 'vue';
import { useLocale } from 'vuetify';

import SettingDivider from '@/layouts/modules/theme-drawer/SettingDivider.vue';
import SettingItem from '@/layouts/modules/theme-drawer/SettingItem.vue';
import { useThemeStore } from '@/stores/theme';
import { isPageAnimateMode, isTabMode } from '@/theme/appearance';

interface TabModeOption {
  readonly title: string;
  readonly value: TabMode;
}

interface PageAnimateModeOption {
  readonly title: string;
  readonly value: PageAnimateMode;
}

const { t } = useLocale();
const themeStore = useThemeStore();

const tabModeOptions = computed<TabModeOption[]>(() => [
  { title: t('theme.tabModeChrome'), value: 'chrome' },
  { title: t('theme.tabModeButton'), value: 'button' },
  { title: t('theme.tabModeSlider'), value: 'slider' },
]);

const pageAnimateModeOptions = computed<PageAnimateModeOption[]>(() => [
  { title: t('theme.layout.pageAnimateFade'), value: 'fade' },
  { title: t('theme.layout.pageAnimateSlide'), value: 'fade-slide' },
  { title: t('theme.layout.pageAnimateBottom'), value: 'fade-bottom' },
  { title: t('theme.layout.pageAnimateScale'), value: 'fade-scale' },
]);

const showBreadcrumbIcon = computed(() => themeStore.header.breadcrumb.visible);

function setTabVisible(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.updateTabSettings({ visible: value });
  }
}

function setTabCache(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.updateTabSettings({ cache: value });
  }
}

function setTabHeight(value: number | null) {
  if (value !== null && Number.isFinite(value)) {
    themeStore.updateTabSettings({ height: Math.round(value) });
  }
}

function setTabMode(value: unknown) {
  if (isTabMode(value)) {
    themeStore.setTabMode(value);
  }
}

function setCloseTabByMiddleClick(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.updateTabSettings({ closeTabByMiddleClick: value });
  }
}

function setPageAnimate(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.updatePageSettings({ animate: value });
  }
}

function setPageAnimateMode(value: unknown) {
  if (isPageAnimateMode(value)) {
    themeStore.updatePageSettings({ animateMode: value });
  }
}

function setHeaderHeight(value: number | null) {
  if (value !== null && Number.isFinite(value)) {
    themeStore.updateHeaderSettings({ height: Math.round(value) });
  }
}

function setBreadcrumbVisible(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.updateBreadcrumbSettings({ visible: value });
  }
}

function setBreadcrumbShowIcon(value: unknown) {
  if (typeof value === 'boolean') {
    themeStore.updateBreadcrumbSettings({ showIcon: value });
  }
}

function setSiderWidth(value: number | null) {
  if (value !== null && Number.isFinite(value)) {
    themeStore.updateSiderSettings({ width: Math.round(value) });
  }
}

function setSiderCollapsedWidth(value: number | null) {
  if (value !== null && Number.isFinite(value)) {
    themeStore.updateSiderSettings({ collapsedWidth: Math.round(value) });
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SettingDivider :title="t('theme.layout.title')" />

    <div class="flex flex-col gap-3">
      <SettingItem :label="t('theme.layout.tabVisible')">
        <VSwitch
          color="primary"
          density="compact"
          hide-details
          :model-value="themeStore.tab.visible"
          @update:model-value="setTabVisible"
        />
      </SettingItem>

      <template v-if="themeStore.tab.visible">
        <SettingItem :label="t('theme.layout.tabCache')">
          <VSwitch
            color="primary"
            density="compact"
            hide-details
            :model-value="themeStore.tab.cache"
            @update:model-value="setTabCache"
          />
        </SettingItem>

        <SettingItem :label="t('theme.layout.tabHeight')">
          <VNumberInput
            control-variant="stacked"
            density="compact"
            hide-details
            :max="96"
            max-width="160"
            :min="36"
            :model-value="themeStore.tab.height"
            :step="1"
            variant="outlined"
            @update:model-value="setTabHeight"
          />
        </SettingItem>

        <SettingItem :label="t('theme.layout.tabStyle')">
          <VSelect
            density="compact"
            hide-details
            item-title="title"
            item-value="value"
            :items="tabModeOptions"
            max-width="160"
            :model-value="themeStore.tab.mode"
            variant="outlined"
            @update:model-value="setTabMode"
          />
        </SettingItem>

        <SettingItem :label="t('theme.layout.closeTabByMiddleClick')">
          <VSwitch
            color="primary"
            density="compact"
            hide-details
            :model-value="themeStore.tab.closeTabByMiddleClick"
            @update:model-value="setCloseTabByMiddleClick"
          />
        </SettingItem>
      </template>
    </div>

    <SettingDivider :title="t('theme.layout.pageTitle')" />

    <div class="flex flex-col gap-3">
      <SettingItem :label="t('theme.layout.pageAnimate')">
        <VSwitch
          color="primary"
          density="compact"
          hide-details
          :model-value="themeStore.page.animate"
          @update:model-value="setPageAnimate"
        />
      </SettingItem>

      <SettingItem v-if="themeStore.page.animate" :label="t('theme.layout.pageAnimateMode')">
        <VSelect
          density="compact"
          hide-details
          item-title="title"
          item-value="value"
          :items="pageAnimateModeOptions"
          max-width="160"
          :model-value="themeStore.page.animateMode"
          variant="outlined"
          @update:model-value="setPageAnimateMode"
        />
      </SettingItem>
    </div>

    <SettingDivider :title="t('theme.layout.headerTitle')" />

    <div class="flex flex-col gap-3">
      <SettingItem :label="t('theme.layout.headerHeight')">
        <VNumberInput
          control-variant="stacked"
          density="compact"
          hide-details
          :max="120"
          max-width="160"
          :min="40"
          :model-value="themeStore.header.height"
          :step="1"
          variant="outlined"
          @update:model-value="setHeaderHeight"
        />
      </SettingItem>

      <SettingItem :label="t('theme.layout.breadcrumbVisible')">
        <VSwitch
          color="primary"
          density="compact"
          hide-details
          :model-value="themeStore.header.breadcrumb.visible"
          @update:model-value="setBreadcrumbVisible"
        />
      </SettingItem>

      <SettingItem v-if="showBreadcrumbIcon" :label="t('theme.layout.breadcrumbShowIcon')">
        <VSwitch
          color="primary"
          density="compact"
          hide-details
          :model-value="themeStore.header.breadcrumb.showIcon"
          @update:model-value="setBreadcrumbShowIcon"
        />
      </SettingItem>
    </div>

    <SettingDivider :title="t('theme.layout.siderTitle')" />

    <div class="flex flex-col gap-3">
      <SettingItem :label="t('theme.layout.siderWidth')">
        <VNumberInput
          control-variant="stacked"
          density="compact"
          hide-details
          :max="400"
          max-width="160"
          :min="200"
          :model-value="themeStore.sider.width"
          :step="1"
          variant="outlined"
          @update:model-value="setSiderWidth"
        />
      </SettingItem>

      <SettingItem :label="t('theme.layout.siderCollapsedWidth')">
        <VNumberInput
          control-variant="stacked"
          density="compact"
          hide-details
          :max="120"
          max-width="160"
          :min="40"
          :model-value="themeStore.sider.collapsedWidth"
          :step="1"
          variant="outlined"
          @update:model-value="setSiderCollapsedWidth"
        />
      </SettingItem>
    </div>
  </div>
</template>
