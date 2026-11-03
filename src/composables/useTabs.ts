import type { AppTab, TabAction } from '@/typings/tabs';
import type { RouteMeta, RouteRecordName } from 'vue-router';

import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useTabsStore } from '@/stores/tabs';

/** The route fields a tab needs, filled from a live route or from a route record. */
interface TabSource {
  readonly path: string;
  readonly fullPath: string;
  readonly name: RouteRecordName | null | undefined;
  readonly meta: RouteMeta;
}

/** Build a tab from a route; routes without a title key are not tabbable. */
function createTab(source: TabSource): AppTab | undefined {
  const { titleKey, icon } = source.meta;

  if (titleKey === undefined) {
    return undefined;
  }

  return {
    id: source.path,
    fullPath: source.fullPath,
    path: source.path,
    // Tab names are route names; symbol names cannot be validated against the table.
    name: typeof source.name === 'string' ? source.name : undefined,
    titleKey,
    icon,
  };
}

/**
 * Router bridge for the global page tabs.
 *
 * Owns the navigation side effects of the tab bar: it seeds the tab store from the
 * router table, records every visited route, and maps a tab action to store mutations
 * plus (when the store returns a next tab) a router push. The store remains the single
 * writer of the tab list; AppTabs is the only consumer of this composable.
 */
export function useTabs() {
  const route = useRoute();
  const router = useRouter();
  const tabsStore = useTabsStore();

  const records = router.getRoutes();

  /**
   * Live route tabs by route name. The store restores persisted tabs from these,
   * so persisted path/label/icon values are never trusted.
   */
  const knownRoutes = new Map<string, AppTab>();

  for (const record of records) {
    if (typeof record.name !== 'string') {
      continue;
    }

    const recordTab = createTab({
      path: record.path,
      fullPath: record.path,
      name: record.name,
      meta: record.meta,
    });

    if (recordTab !== undefined) {
      knownRoutes.set(record.name, recordTab);
    }
  }

  // The home tab is the shell's landing route (`meta.home`); fall back to the first
  // navigation route for route tables that do not declare one.
  const homeRecord =
    records.find((record) => record.meta.home === true && record.meta.titleKey !== undefined) ??
    records.find((record) => record.meta.nav === true && record.meta.titleKey !== undefined);

  const currentTab = createTab({
    path: route.path,
    fullPath: route.fullPath,
    name: route.name,
    meta: route.meta,
  });

  // Initialize synchronously so the first paint already shows the seeded tabs.
  if (currentTab !== undefined) {
    const homeTab =
      homeRecord === undefined
        ? undefined
        : createTab({
            path: homeRecord.path,
            fullPath: homeRecord.path,
            name: homeRecord.name,
            meta: homeRecord.meta,
          });

    if (homeTab === undefined) {
      // No home route: fall back to recording the current page.
      tabsStore.addTab(currentTab);
    } else {
      tabsStore.initTabs(homeTab, currentTab, knownRoutes);
    }
  }

  // Record every subsequent navigation (fullPath: query/hash changes refresh the target);
  // untitled routes (e.g. full-screen views) add none.
  watch(
    () => route.fullPath,
    () => {
      const tab = createTab({
        path: route.path,
        fullPath: route.fullPath,
        name: route.name,
        meta: route.meta,
      });

      if (tab !== undefined) {
        tabsStore.addTab(tab);
      }
    },
  );

  /** Follow the navigation target returned by a close action, when the store has one. */
  function navigateTo(next: AppTab | undefined) {
    if (next !== undefined) {
      void router.push(next.fullPath);
    }
  }

  /** Activate a tab: mark it active immediately, then mirror the route. */
  function activateTab(tab: AppTab) {
    // Clicking the tab that already matches the route: nothing to navigate.
    if (tab.id === tabsStore.activeTabId && tab.fullPath === route.fullPath) {
      return;
    }

    tabsStore.setActiveTabId(tab.id);
    void router.push(tab.fullPath);
  }

  function closeTab(tabId: string) {
    navigateTo(tabsStore.removeTab(tabId));
  }

  function closeOtherTabs(tabId: string) {
    navigateTo(tabsStore.clearTabs([tabId]));
  }

  function closeLeftTabs(tabId: string) {
    navigateTo(tabsStore.clearLeftTabs(tabId));
  }

  function closeRightTabs(tabId: string) {
    navigateTo(tabsStore.clearRightTabs(tabId));
  }

  function closeAllTabs() {
    navigateTo(tabsStore.clearTabs());
  }

  /** Run one menu action; shared by the tab-bar dropdown and the context menu. */
  function runTabAction(action: TabAction, tabId: string) {
    switch (action) {
      case 'close-current': {
        closeTab(tabId);
        break;
      }
      case 'close-others': {
        closeOtherTabs(tabId);
        break;
      }
      case 'close-left': {
        closeLeftTabs(tabId);
        break;
      }
      case 'close-right': {
        closeRightTabs(tabId);
        break;
      }
      case 'close-all': {
        closeAllTabs();
        break;
      }
      case 'pin': {
        tabsStore.pinTab(tabId);
        break;
      }
      case 'unpin': {
        tabsStore.unpinTab(tabId);
        break;
      }
    }
  }

  const { orderedTabs, activeTabId } = storeToRefs(tabsStore);

  return {
    tabs: orderedTabs,
    activeTabId,
    isRetained: tabsStore.isRetained,
    isPinned: tabsStore.isPinned,
    activateTab,
    runTabAction,
  };
}
