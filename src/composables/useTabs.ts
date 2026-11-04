import type { ClosedTabs } from '@/stores/tabs';
import type { AppTab, TabAction } from '@/typings/tabs';
import type { RouteMeta, RouteRecordName } from 'vue-router';

import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useRouteStore } from '@/stores/route';
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
 * Purge closed views from the KeepAlive cache after the router has switched away, so the
 * deactivated views are already cached when KeepAlive prunes them (the reference tab store
 * resets the cache after `switchRouteByTab`).
 */
async function purgeClosedTabs(removedTabs: readonly AppTab[]): Promise<void> {
  const routeStore = useRouteStore();

  await routeStore.resetRouteCache(
    routeStore.getCacheRouteNames(removedTabs.map((tab) => tab.fullPath)),
  );
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
  async function navigateTo(next: AppTab | undefined) {
    if (next !== undefined) {
      await router.push(next.fullPath);
    }
  }

  async function closeAndPurge(result: ClosedTabs) {
    await navigateTo(result.nextTab);
    await purgeClosedTabs(result.removedTabs);
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

  async function closeTab(tabId: string) {
    await closeAndPurge(tabsStore.removeTab(tabId));
  }

  async function closeOtherTabs(tabId: string) {
    await closeAndPurge(tabsStore.clearTabs([tabId]));
  }

  async function closeLeftTabs(tabId: string) {
    await closeAndPurge(tabsStore.clearLeftTabs(tabId));
  }

  async function closeRightTabs(tabId: string) {
    await closeAndPurge(tabsStore.clearRightTabs(tabId));
  }

  async function closeAllTabs() {
    await closeAndPurge(tabsStore.clearTabs());
  }

  /** Run one tab action from the right-click context menu. */
  function runTabAction(action: TabAction, tabId: string) {
    switch (action) {
      case 'close-current': {
        void closeTab(tabId);
        break;
      }
      case 'close-others': {
        void closeOtherTabs(tabId);
        break;
      }
      case 'close-left': {
        void closeLeftTabs(tabId);
        break;
      }
      case 'close-right': {
        void closeRightTabs(tabId);
        break;
      }
      case 'close-all': {
        void closeAllTabs();
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
