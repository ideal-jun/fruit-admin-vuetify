<script setup lang="ts">
import { useLocale } from 'vuetify';

import AppIconButton from '@/components/common/AppIconButton.vue';
import AppLocaleMenu from '@/components/common/AppLocaleMenu.vue';
import AppThemeToggle from '@/components/common/AppThemeToggle.vue';
import AppBreadcrumb from '@/components/layout/header/AppBreadcrumb.vue';
import AppFullscreenToggle from '@/components/layout/header/AppFullscreenToggle.vue';
import AppMenuToggler from '@/components/layout/header/AppMenuToggler.vue';
import AppSearch from '@/components/layout/header/AppSearch.vue';
import AppUserMenu from '@/components/layout/header/AppUserMenu.vue';

interface Props {
  /** Mobile viewport: the menu button opens the temporary drawer. */
  mobile?: boolean;
  /** Desktop: the sidebar is collapsed to a rail. */
  rail?: boolean;
}

interface Emits {
  /** The hamburger button was pressed — the layout owns the drawer state. */
  'toggle-menu': [];
  /** The rail button was pressed — the layout owns the collapsed state. */
  'toggle-rail': [];
  /** The palette button was pressed — the layout owns the drawer state. */
  'open-theme-drawer': [];
}

// Vue 3.5 reactive props destructure: native defaults instead of withDefaults().
const { mobile = false, rail = false } = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useLocale();

function onToggleMenu() {
  if (mobile) {
    emit('toggle-menu');

    return;
  }

  emit('toggle-rail');
}
</script>

<template>
  <VAppBar>
    <AppMenuToggler :mobile="mobile" :rail="rail" @toggle="onToggleMenu" />

    <AppBreadcrumb />

    <VSpacer />

    <AppSearch />
    <AppFullscreenToggle v-if="!mobile" />
    <AppLocaleMenu />
    <AppThemeToggle />
    <AppIconButton
      icon="mdi-palette-outline"
      :tooltip="t('theme.title')"
      @click="emit('open-theme-drawer')"
    />
    <AppUserMenu />
  </VAppBar>
</template>
