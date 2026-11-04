<script setup lang="ts">
import { computed } from 'vue';
import { useLocale } from 'vuetify';

import AppIconButton from '@/components/common/AppIconButton.vue';
import AppLocaleMenu from '@/components/common/AppLocaleMenu.vue';
import AppThemeToggle from '@/components/common/AppThemeToggle.vue';
import AppBreadcrumb from '@/layouts/modules/header/AppBreadcrumb.vue';
import AppFullscreenToggle from '@/layouts/modules/header/AppFullscreenToggle.vue';
import AppMenuToggler from '@/layouts/modules/header/AppMenuToggler.vue';
import AppSearch from '@/layouts/modules/header/AppSearch.vue';
import AppUserMenu from '@/layouts/modules/header/AppUserMenu.vue';
import AppTabs from '@/layouts/modules/tabs/AppTabs.vue';
import { useThemeStore } from '@/stores/theme';

interface Props {
  /** Mobile viewport: the menu button opens the temporary drawer. */
  mobile?: boolean;
  /** Desktop: the sidebar is collapsed to a rail. */
  rail?: boolean;
  /** Content fullscreen: collapse the header to the tab bar only. */
  fullContent?: boolean;
}

interface Emits {
  /** The hamburger button was pressed — the layout owns the drawer state. */
  'toggle-menu': [];
  /** The rail button was pressed — the layout owns the collapsed state. */
  'toggle-rail': [];
  /** The palette button was pressed — the layout owns the drawer state. */
  'open-theme-drawer': [];
  /** The tab-bar fullscreen button was pressed — the layout owns the layout state. */
  'toggle-fullscreen': [];
}

// Vue 3.5 reactive props destructure: native defaults instead of withDefaults().
const { mobile = false, rail = false, fullContent = false } = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useLocale();
const themeStore = useThemeStore();

/**
 * The app bar uses comfortable density (trimmed by 8px, extension by 4px) so the
 * settings drawer can expose the real rendered heights instead of the raw props.
 */
const DENSITY_CONTENT_INSET = 8;
const DENSITY_EXTENSION_INSET = 4;

const appBarHeight = computed(() =>
  fullContent ? 0 : themeStore.header.height + DENSITY_CONTENT_INSET,
);

const tabBarHeight = computed(
  () => themeStore.tab.height + (fullContent ? 0 : DENSITY_EXTENSION_INSET),
);

function onToggleMenu() {
  if (mobile) {
    emit('toggle-menu');

    return;
  }

  emit('toggle-rail');
}
</script>

<template>
  <VAppBar
    :density="!fullContent ? 'comfortable' : null"
    :extension-height="tabBarHeight"
    :height="appBarHeight"
  >
    <template v-if="!fullContent">
      <AppMenuToggler :mobile="mobile" :rail="rail" @toggle="onToggleMenu" />

      <AppBreadcrumb
        :show-icon="themeStore.header.breadcrumb.showIcon"
        :visible="themeStore.header.breadcrumb.visible"
      />

      <VSpacer />

      <AppSearch v-if="themeStore.header.searchVisible" />
      <AppFullscreenToggle v-if="!mobile" />
      <AppLocaleMenu v-if="themeStore.header.localeVisible" />
      <AppThemeToggle />
      <AppIconButton
        icon="mdi-palette-outline"
        :tooltip="t('theme.title')"
        @click="emit('open-theme-drawer')"
      />
      <AppUserMenu />
    </template>

    <template v-if="themeStore.tab.visible" #extension>
      <AppTabs :full-content="fullContent" @toggle-fullscreen="emit('toggle-fullscreen')" />
    </template>
  </VAppBar>
</template>
