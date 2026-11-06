<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import {
  VFadeTransition,
  VScaleTransition,
  VScrollXTransition,
  VScrollYTransition,
} from 'vuetify/components';

import AppWatermark from '@/components/common/AppWatermark.vue';
import AppHeader from '@/layouts/modules/header/AppHeader.vue';
import AppSidebar from '@/layouts/modules/sider/AppSidebar.vue';
import AppThemeDrawer from '@/layouts/modules/theme-drawer/AppThemeDrawer.vue';
import { useRouteStore } from '@/stores/route';
import { useThemeStore } from '@/stores/theme';

/**
 * BaseLayout — the application shell. Composition surface only:
 * AppHeader on top, AppSidebar on the left, the routed view in VMain.
 *
 * The chrome state (drawer open, desktop rail, theme drawer, content fullscreen) lives
 * here as the single source of truth and flows down explicitly: props + events for the
 * header, `v-model` for the drawers.
 */
const currentRoute = useRoute();
const { mobile } = useDisplay();
const routeStore = useRouteStore();
const themeStore = useThemeStore();

/** How long a refresh hides the view while animations are on (reference: reloadPage(500)). */
const RELOAD_DURATION = 500;
/** Same gap with animations off (reference: reloadPage uses 40ms when page.animate is false). */
const RELOAD_DURATION_NO_ANIMATION = 40;

// Primitive state → shallowRef (no deep proxying needed).
const drawerOpen = shallowRef(!mobile.value);
const drawerRail = shallowRef(false);
const themeDrawerOpen = shallowRef(false);
/** Content fullscreen: hide the sidebar/header chrome and keep the tab bar visible. */
const fullContent = shallowRef(false);
/**
 * Whether the routed view is rendered. A refresh flips it off and back on, so the
 * transition plays leave → (hidden) → enter and the view remounts, like the reference's
 * app-store `reloadFlag`.
 */
const viewVisible = shallowRef(true);
/** The tab-bar refresh button spins while the view is hidden. */
const reloading = computed(() => !viewVisible.value);

/** KeepAlive include list; the "cache tabs" setting turns view caching off entirely. */
const cachedRoutes = computed(() => (themeStore.tab.cache ? routeStore.cacheRoutes : []));

let reloadTimer: ReturnType<typeof setTimeout> | undefined;

// Rail is a desktop-only affordance; on mobile the drawer is temporary.
const sidebarRail = computed(() => drawerRail.value && !mobile.value);

/** Map the configured route animation to Vuetify's own transition component. */
const routeTransition = computed(() => {
  switch (themeStore.page.animateMode) {
    case 'fade': {
      return VFadeTransition;
    }
    case 'fade-bottom': {
      return VScrollYTransition;
    }
    case 'fade-scale': {
      return VScaleTransition;
    }
    default: {
      return VScrollXTransition;
    }
  }
});

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

/**
 * Refresh the active page from the tab bar, mirroring the reference implementation:
 * hide the routed view (its leave transition plays), wait, then show it again (enter
 * transition + fresh remount). The button spins while the view is hidden.
 */
function reloadView() {
  if (!viewVisible.value) {
    return;
  }

  const duration = themeStore.page.animate ? RELOAD_DURATION : RELOAD_DURATION_NO_ANIMATION;

  viewVisible.value = false;

  reloadTimer = setTimeout(() => {
    viewVisible.value = true;
    // Drop the reactivated view from KeepAlive: it must remount with fresh state.
    void routeStore.resetRouteCache();
    reloadTimer = undefined;
  }, duration);
}

onBeforeUnmount(() => {
  if (reloadTimer !== undefined) {
    clearTimeout(reloadTimer);
  }
});
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
    :reloading="reloading"
    @open-theme-drawer="openThemeDrawer"
    @reload="reloadView"
    @toggle-fullscreen="toggleFullContent"
    @toggle-menu="toggleMenu"
    @toggle-rail="toggleRail"
  />

  <VMain scrollable>
    <VContainer :class="{ 'h-full': currentRoute.meta.fullHeight === true }" fluid>
      <!-- Route switches use the transition component picked in the appearance settings
           (each option maps to a Vuetify transition); `mode="out-in"` sequences the views. -->
      <RouterView v-slot="{ Component, route }">
        <component :is="routeTransition" v-if="themeStore.page.animate" mode="out-in">
          <KeepAlive :exclude="routeStore.excludeCacheRoutes" :include="cachedRoutes">
            <component :is="Component" v-if="viewVisible" :key="route.fullPath" />
          </KeepAlive>
        </component>
        <KeepAlive v-else :exclude="routeStore.excludeCacheRoutes" :include="cachedRoutes">
          <component :is="Component" v-if="viewVisible" :key="route.fullPath" />
        </KeepAlive>
      </RouterView>
    </VContainer>
  </VMain>
  <AppThemeDrawer v-model:open="themeDrawerOpen" />
  <AppWatermark
    v-if="themeStore.watermark.visible"
    :enable-time="themeStore.watermark.enableTime"
    :enable-username="themeStore.watermark.enableUserName"
    :text="themeStore.watermark.text"
    :time-format="themeStore.watermark.timeFormat"
  />
</template>
