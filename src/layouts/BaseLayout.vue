<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { useDisplay } from 'vuetify';

import Watermark from '@/components/common/Watermark.vue';
import AppHeader from '@/layouts/modules/header/AppHeader.vue';
import AppSidebar from '@/layouts/modules/sider/AppSidebar.vue';
import AppThemeDrawer from '@/layouts/modules/theme-drawer/AppThemeDrawer.vue';
import { useThemeStore } from '@/stores/theme';

/**
 * BaseLayout — the application shell. Composition surface only:
 * AppHeader on top, AppSidebar on the left, the routed view in VMain.
 *
 * The chrome state (drawer open, desktop rail, theme drawer, content fullscreen) lives
 * here as the single source of truth and flows down explicitly: props + events for the
 * header, `v-model` for the drawers.
 */
const { mobile } = useDisplay();
const themeStore = useThemeStore();

// Primitive state → shallowRef (no deep proxying needed).
const drawerOpen = shallowRef(!mobile.value);
const drawerRail = shallowRef(false);
const themeDrawerOpen = shallowRef(false);
/** Content fullscreen: hide the sidebar/header chrome and keep the tab bar visible. */
const fullContent = shallowRef(false);

// Rail is a desktop-only affordance; on mobile the drawer is temporary.
const sidebarRail = computed(() => drawerRail.value && !mobile.value);

// Keep the drawer open on desktop and closed on mobile when crossing the breakpoint.
watch(mobile, (isMobile) => {
  drawerOpen.value = !isMobile;
});

// The tab bar hosts the fullscreen exit button, so fullscreen cannot outlive it.
watch(
  () => themeStore.tab.visible,
  (visible) => {
    if (!visible) {
      fullContent.value = false;
    }
  },
);

function toggleMenu() {
  drawerOpen.value = !drawerOpen.value;
}

function toggleRail() {
  drawerRail.value = !drawerRail.value;
}

function openThemeDrawer() {
  themeDrawerOpen.value = true;
}

function toggleFullContent() {
  fullContent.value = !fullContent.value;
}
</script>

<template>
  <AppSidebar
    v-if="!fullContent"
    v-model="drawerOpen"
    :collapsed-width="themeStore.sider.collapsedWidth"
    :rail="sidebarRail"
    :temporary="mobile"
    :width="themeStore.sider.width"
  />
  <AppHeader
    :full-content="fullContent"
    :mobile="mobile"
    :rail="sidebarRail"
    @open-theme-drawer="openThemeDrawer"
    @toggle-fullscreen="toggleFullContent"
    @toggle-menu="toggleMenu"
    @toggle-rail="toggleRail"
  />

  <VMain scrollable>
    <VContainer fluid>
      <RouterView />
    </VContainer>
  </VMain>
  <AppThemeDrawer v-model:open="themeDrawerOpen" />
  <Watermark
    v-if="themeStore.watermark.visible"
    :enable-time="themeStore.watermark.enableTime"
    :enable-username="themeStore.watermark.enableUserName"
    :text="themeStore.watermark.text"
    :time-format="themeStore.watermark.timeFormat"
  />
</template>
