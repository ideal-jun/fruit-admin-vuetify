<script setup lang="ts">
import type { AppTab, TabAction } from '@/typings/tabs';

import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue';
import { useLocale, useTheme } from 'vuetify';

import AppIconButton from '@/components/common/AppIconButton.vue';
import { useTabMenu } from '@/composables/useTabMenu';
import { useTabs } from '@/composables/useTabs';
import AppTabContextMenu from '@/layouts/modules/tabs/AppTabContextMenu.vue';
import AppTabItem from '@/layouts/modules/tabs/AppTabItem.vue';
import { useThemeStore } from '@/stores/theme';

/** Pixels of breathing room kept when the active tab is scrolled into view. */
const SCROLL_MARGIN = 12;
/** Wheel-to-horizontal-scroll ratio: vertical wheel input moves the strip calmly. */
const WHEEL_SCROLL_RATIO = 0.3;

interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
  tabId: string;
}

interface Props {
  /** Content fullscreen is active: the tab bar offers the exit action. */
  fullContent?: boolean;
  /** The active view is remounting — the refresh button spins. */
  reloading?: boolean;
}

interface Emits {
  /** The fullscreen button was pressed — the layout owns the layout state. */
  'toggle-fullscreen': [];
  /** The refresh button was pressed — the layout remounts the routed view. */
  reload: [];
}

const { fullContent = false, reloading = false } = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useLocale();
const { tabs, activeTabId, isRetained, isPinned, activateTab, runTabAction } = useTabs();
const { getMenuOptions } = useTabMenu();

const theme = useTheme();
const themeStore = useThemeStore();

const tabMode = computed(() => themeStore.tabMode);
const darkMode = computed(() => theme.current.value.dark);
const activeColor = computed(() => themeStore.primary);

/** The strip layout follows the tab style: overlapping chrome tabs, centered buttons, full-height sliders. */
const scrollClass = computed(() => [
  'tabs-scroll flex h-full min-w-0 flex-1 overflow-x-auto',
  tabMode.value === 'button' ? 'items-center gap-3' : 'items-end',
  tabMode.value === 'chrome' ? 'tabs-scroll--chrome' : '',
]);

const tabScrollRef = useTemplateRef<HTMLElement>('tab-scroll');

// Plain menu state object, replaced wholesale on every change → shallowRef is enough.
const contextMenu = shallowRef<ContextMenuState>({ open: false, x: 0, y: 0, tabId: '' });

const contextMenuOptions = computed(() =>
  contextMenu.value.open ? getMenuOptions(contextMenu.value.tabId) : [],
);

/** Keep the active tab inside the visible strip after the list or active tab changes. */
async function scrollToActiveTab() {
  await nextTick();

  const container = tabScrollRef.value;
  const tabId = activeTabId.value;

  if (container === null || tabId === '') {
    return;
  }

  const tabElement = Array.from(container.querySelectorAll<HTMLElement>('[data-tab-id]')).find(
    (element) => element.dataset.tabId === tabId,
  );

  if (tabElement === undefined) {
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const tabRect = tabElement.getBoundingClientRect();

  if (tabRect.left < containerRect.left) {
    container.scrollLeft = Math.max(
      0,
      container.scrollLeft + tabRect.left - containerRect.left - SCROLL_MARGIN,
    );
  } else if (tabRect.right > containerRect.right) {
    container.scrollLeft += tabRect.right - containerRect.right + SCROLL_MARGIN;
  }
}

/**
 * Vertical wheel/trackpad movement scrolls the tab strip horizontally. Horizontal
 * gestures, zoom gestures and scrolling past either end keep their native behavior.
 */
function onWheel(event: WheelEvent) {
  const container = tabScrollRef.value;

  if (container === null || container.scrollWidth <= container.clientWidth) {
    return;
  }

  if (event.ctrlKey || event.metaKey) {
    return;
  }

  // Leave native horizontal gestures untouched.
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
    return;
  }

  // Line-based wheel deltas (some browsers/mice) are normalized to pixels.
  const delta = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 16 : event.deltaY;
  const atStart = container.scrollLeft <= 0 && delta < 0;
  const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth && delta > 0;

  if (atStart || atEnd) {
    return;
  }

  event.preventDefault();
  container.scrollLeft += delta * WHEEL_SCROLL_RATIO;
}

/**
 * Arrow/Home/End move focus between the tabs and activate the focused tab
 * (automatic activation), so every tab is reachable without a mouse.
 */
function onTablistKeydown(event: KeyboardEvent) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
    return;
  }

  const container = tabScrollRef.value;

  if (container === null) {
    return;
  }

  const tabButtons = Array.from(container.querySelectorAll<HTMLElement>('[role="tab"]'));
  const target = event.target instanceof HTMLElement ? event.target : null;
  const currentIndex = target === null ? -1 : tabButtons.indexOf(target);

  if (currentIndex === -1 || tabButtons.length === 0) {
    return;
  }

  event.preventDefault();

  const lastIndex = tabButtons.length - 1;
  let nextIndex: number;

  switch (event.key) {
    case 'Home': {
      nextIndex = 0;

      break;
    }
    case 'End': {
      nextIndex = lastIndex;

      break;
    }
    case 'ArrowLeft': {
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;

      break;
    }
    default: {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    }
  }

  const nextButton = tabButtons[nextIndex];
  const nextTabId = nextButton?.closest<HTMLElement>('[data-tab-id]')?.dataset.tabId;

  if (nextButton === undefined || nextTabId === undefined) {
    return;
  }

  nextButton.focus();

  const nextTab = tabs.value.find((tab) => tab.id === nextTabId);

  if (nextTab !== undefined) {
    activateTab(nextTab);
  }
}

function openContextMenu(event: MouseEvent, tab: AppTab) {
  contextMenu.value = { open: true, x: event.clientX, y: event.clientY, tabId: tab.id };
}

function closeContextMenu() {
  contextMenu.value = { ...contextMenu.value, open: false };
}

/** Close a tab from the middle mouse button; the setting and retained tabs can disable it. */
function onMiddleClick(event: MouseEvent, tab: AppTab) {
  event.preventDefault();

  if (!themeStore.tab.closeTabByMiddleClick || isRetained(tab.id)) {
    return;
  }

  runTabAction('close-current', tab.id);
}

function selectContextAction(action: TabAction) {
  runTabAction(action, contextMenu.value.tabId);
  closeContextMenu();
}

// Array source: both a new tab and an active-tab change re-run the scroll alignment.
watch(
  [tabs, activeTabId],
  () => {
    void scrollToActiveTab();
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex h-full w-full items-center gap-2 px-4">
    <div
      ref="tab-scroll"
      :aria-label="t('tabs.label')"
      :class="scrollClass"
      role="tablist"
      @keydown="onTablistKeydown"
      @wheel="onWheel"
    >
      <AppTabItem
        v-for="tab in tabs"
        :key="tab.id"
        :active="tab.id === activeTabId"
        :active-color="activeColor"
        :closable="!isRetained(tab.id)"
        :dark-mode="darkMode"
        :mode="tabMode"
        :pinned="isPinned(tab.id)"
        :tab="tab"
        @activate="activateTab(tab)"
        @close="runTabAction('close-current', tab.id)"
        @middle-click="onMiddleClick($event, tab)"
        @open-menu="openContextMenu($event, tab)"
      />
    </div>

    <AppIconButton
      density="comfortable"
      icon="mdi-refresh"
      :loading="reloading"
      :tooltip="t('tabs.reload')"
      @click="emit('reload')"
    />

    <AppIconButton
      density="comfortable"
      :icon="fullContent ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
      :tooltip="fullContent ? t('layout.contentFullscreenExit') : t('layout.contentFullscreen')"
      @click="emit('toggle-fullscreen')"
    />

    <AppTabContextMenu
      :open="contextMenu.open"
      :options="contextMenuOptions"
      :x="contextMenu.x"
      :y="contextMenu.y"
      @close="closeContextMenu"
      @select="selectContextAction"
    />
  </div>
</template>

<style scoped>
/* Horizontal scrolling is driven by the wheel handler; hide the native scrollbar. */
.tabs-scroll {
  scrollbar-width: none;
}

.tabs-scroll::-webkit-scrollbar {
  display: none;
}

/* The chrome tabs overlap by 18px, keep the last one fully visible while scrolling. */
.tabs-scroll--chrome {
  padding-right: 18px;
}
</style>
