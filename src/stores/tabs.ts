import type { AppTab } from '@/typings/tabs';

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { useThemeStore } from '@/stores/theme';

/** localStorage key for the restored (non-home) tabs. */
export const TABS_STORAGE_KEY = 'fruit-admin.tabs';

/** Result of a tab close: the tab to activate (when the active one went away) and the removed tabs. */
export interface ClosedTabs {
  readonly nextTab: AppTab | undefined;
  readonly removedTabs: AppTab[];
}

/** Whether the tab is pinned. The fixedIndex is the dense pin order (0-based). */
function isFixedTab(tab: AppTab): tab is AppTab & { readonly fixedIndex: number } {
  return tab.fixedIndex !== undefined;
}

/** Copy a tab without the pin marker (used when a tab leaves the pinned group). */
function withoutPinnedIndex(tab: AppTab): AppTab {
  return {
    id: tab.id,
    fullPath: tab.fullPath,
    path: tab.path,
    name: tab.name,
    titleKey: tab.titleKey,
    icon: tab.icon,
  };
}

/** Copy a tab with the given pin order. */
function withPinnedIndex(tab: AppTab, fixedIndex: number): AppTab {
  return { ...tab, fixedIndex };
}

/**
 * Sort pinned tabs by their pin order without mutating the input. The project's
 * ES2022 lib has no `toSorted`, so this uses a small insertion sort (there are
 * only a handful of pinned tabs).
 */
function sortPinnedTabs(list: readonly AppTab[]): AppTab[] {
  const sorted: AppTab[] = [];

  for (const tab of list) {
    const index = sorted.findIndex((item) => (item.fixedIndex ?? 0) > (tab.fixedIndex ?? 0));

    if (index === -1) {
      sorted.push(tab);
    } else {
      sorted.splice(index, 0, tab);
    }
  }

  return sorted;
}

/**
 * Renumber the pinned tabs into a dense 0..n-1 order (after pin, unpin or a
 * restore of persisted tabs). The tabs array keeps its own order: pinned tabs
 * are sorted by fixedIndex when the ordered list is derived, not here.
 */
function renumberPinnedTabs(list: readonly AppTab[]): AppTab[] {
  const pinnedIds = new Map(
    sortPinnedTabs(list.filter(isFixedTab)).map((tab, index) => [tab.id, index] as const),
  );

  return list.map((tab) => {
    const fixedIndex = pinnedIds.get(tab.id);

    return fixedIndex === undefined || fixedIndex === tab.fixedIndex
      ? tab
      : withPinnedIndex(tab, fixedIndex);
  });
}

/** Whether two tabs carry the same content (the pin marker included). */
function isSameTabContent(a: AppTab, b: AppTab): boolean {
  return (
    a.id === b.id &&
    a.fullPath === b.fullPath &&
    a.path === b.path &&
    a.name === b.name &&
    a.titleKey === b.titleKey &&
    a.icon === b.icon &&
    a.fixedIndex === b.fixedIndex
  );
}

/**
 * Validate one tab read from localStorage. Restored tabs come from unknown JSON,
 * so every field is checked here before the store trusts it.
 */
function isStoredTab(value: unknown): value is AppTab {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { id, fullPath, path, name, titleKey, icon, fixedIndex } = value as {
    id?: unknown;
    fullPath?: unknown;
    path?: unknown;
    name?: unknown;
    titleKey?: unknown;
    icon?: unknown;
    fixedIndex?: unknown;
  };

  return (
    typeof id === 'string' &&
    id !== '' &&
    typeof fullPath === 'string' &&
    fullPath !== '' &&
    typeof path === 'string' &&
    path !== '' &&
    typeof titleKey === 'string' &&
    titleKey !== '' &&
    (name === undefined || typeof name === 'string') &&
    (icon === undefined || typeof icon === 'string') &&
    (fixedIndex === undefined ||
      (typeof fixedIndex === 'number' && Number.isInteger(fixedIndex) && fixedIndex >= 0))
  );
}

/** Read the persisted tabs; storage may be unavailable (SSR, private mode). */
function readStoredTabs(): AppTab[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(TABS_STORAGE_KEY);

    if (raw === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter(isStoredTab) : [];
  } catch {
    return [];
  }
}

/** Persist the non-home tabs; storage may be unavailable (SSR, private mode). */
function writeStoredTabs(tabs: readonly AppTab[]): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
  } catch {
    // Storage can be unavailable: the tab bar still works with in-memory tabs.
  }
}

/**
 * Global page tabs (the tab bar under the app bar).
 *
 * The store is the single writer for the tab domain: it owns the ordered tab
 * list, the active tab and the persistence. Persistence happens explicitly after
 * every mutation (no watchers), as in the theme/auth stores.
 *
 * Invariants:
 * - the home tab lives in homeTab and is never part of tabs;
 * - tabs holds the non-home tabs in insertion order, pinned tabs are ordered by
 *   their fixedIndex in orderedTabs;
 * - the home tab and pinned tabs are retained: close actions never remove them;
 * - labels are i18n keys (titleKey), translated by the tab bar at render time.
 */
export const useTabsStore = defineStore('tabs', () => {
  const themeStore = useThemeStore();

  /** The home tab: always first, never stored in tabs, never closable. */
  const homeTab = ref<AppTab | null>(null);

  /** Non-home tabs in insertion order (the pinned group is derived by orderedTabs). */
  const tabs = ref<AppTab[]>([]);

  /** Id of the tab matching the current route. */
  const activeTabId = ref<string>('');

  /** Visual order: home first, then pinned tabs by fixedIndex, then the rest. */
  const orderedTabs = computed<AppTab[]>(() => {
    const pinned = sortPinnedTabs(tabs.value.filter(isFixedTab));
    const unpinned = tabs.value.filter((tab) => tab.fixedIndex === undefined);

    return homeTab.value === null
      ? [...pinned, ...unpinned]
      : [homeTab.value, ...pinned, ...unpinned];
  });

  function persist(): void {
    // "Cache tabs" is off: keep the session tabs in memory only.
    if (!themeStore.tab.cache) {
      return;
    }

    writeStoredTabs(tabs.value);
  }

  function findTab(tabId: string): AppTab | undefined {
    return tabs.value.find((tab) => tab.id === tabId);
  }

  /** Whether the tab is pinned (the home tab is not a member of tabs). */
  function isPinned(tabId: string): boolean {
    return findTab(tabId)?.fixedIndex !== undefined;
  }

  /** Whether the tab can never be closed: the home tab and the pinned tabs. */
  function isRetained(tabId: string): boolean {
    return tabId === homeTab.value?.id || isPinned(tabId);
  }

  function setActiveTabId(id: string): void {
    activeTabId.value = id;
  }

  /**
   * Pick the tab to show after the active tab was closed: the next tab in the
   * previous visual order, else the previous one, else the home tab. Returns
   * undefined when the active tab survived, i.e. when no navigation is needed.
   */
  function activateNextTab(
    previousOrder: readonly AppTab[],
    removedIds: ReadonlySet<string>,
  ): AppTab | undefined {
    if (!removedIds.has(activeTabId.value)) {
      return undefined;
    }

    const removedIndex = previousOrder.findIndex((tab) => tab.id === activeTabId.value);
    const previousPositions = new Map(previousOrder.map((tab, index) => [tab.id, index] as const));
    const remaining = orderedTabs.value;
    const nextTab = remaining.find((tab) => (previousPositions.get(tab.id) ?? -1) > removedIndex);

    if (nextTab !== undefined) {
      activeTabId.value = nextTab.id;

      return nextTab;
    }

    let previousTab: AppTab | undefined;

    for (const tab of remaining) {
      if ((previousPositions.get(tab.id) ?? -1) < removedIndex) {
        previousTab = tab;
      }
    }

    const target = previousTab ?? homeTab.value;

    if (target === null || target === undefined) {
      activeTabId.value = '';

      return undefined;
    }

    activeTabId.value = target.id;

    return target;
  }

  /** Drop the given tabs, then activate the fallback tab if the active one went away. */
  function removeTabsByIds(
    previousOrder: readonly AppTab[],
    removedIds: ReadonlySet<string>,
  ): ClosedTabs {
    if (removedIds.size === 0) {
      return { nextTab: undefined, removedTabs: [] };
    }

    const removedTabs = previousOrder.filter((tab) => removedIds.has(tab.id));

    tabs.value = tabs.value.filter((tab) => !removedIds.has(tab.id));
    const nextTab = activateNextTab(previousOrder, removedIds);
    persist();

    return { nextTab, removedTabs };
  }

  /**
   * Restore the persisted tabs and add the current route's tab. Called once by
   * the tab-bar composable; on a re-init only the current tab is added, so HMR
   * or a second caller cannot duplicate state.
   *
   * The persisted route name is the only identity that is trusted: path, label
   * key and icon are re-read from the live route table, so a renamed route cannot
   * resurrect a dead tab or render a stale label. Only the pin state is restored.
   */
  function initTabs(home: AppTab, current: AppTab, knownRoutes: ReadonlyMap<string, AppTab>): void {
    if (homeTab.value !== null) {
      addTab(current);

      return;
    }

    homeTab.value = withoutPinnedIndex(home);
    activeTabId.value = home.id;

    const restored: AppTab[] = [];
    const seenIds = new Set<string>([home.id]);

    // Restoring is opt-in through the "cache tabs" appearance setting; clear any
    // stale storage once the setting is off.
    const storedTabs = themeStore.tab.cache ? readStoredTabs() : [];

    if (!themeStore.tab.cache) {
      writeStoredTabs([]);
    }

    for (const stored of storedTabs) {
      const routeTab = stored.name === undefined ? undefined : knownRoutes.get(stored.name);

      if (routeTab === undefined || seenIds.has(routeTab.id)) {
        continue;
      }

      seenIds.add(routeTab.id);
      restored.push(
        stored.fixedIndex === undefined ? routeTab : withPinnedIndex(routeTab, stored.fixedIndex),
      );
    }

    tabs.value = renumberPinnedTabs(restored);
    // Rewrite the persisted list once so stale/malformed entries are dropped for good.
    persist();
    addTab(current);
  }

  /**
   * Add a tab (idempotent) and activate it unless active is false. A known tab
   * is refreshed in place (fullPath, label key, icon) while its pin state is kept,
   * and persistence only runs when the stored tab list actually changed.
   */
  function addTab(tab: AppTab, active = true): void {
    const home = homeTab.value;
    let changed = false;

    if (home !== null && tab.id === home.id) {
      // The home tab is never stored: only refresh its route content.
      const refreshed = withoutPinnedIndex(tab);

      if (!isSameTabContent(home, refreshed)) {
        homeTab.value = refreshed;
        changed = true;
      }
    } else {
      const existing = findTab(tab.id);

      if (existing === undefined) {
        tabs.value = renumberPinnedTabs([...tabs.value, tab]);
        changed = true;
      } else {
        // Pin state is owned by pinTab/unpinTab, so an update keeps it.
        const updated =
          existing.fixedIndex === undefined
            ? withoutPinnedIndex(tab)
            : withPinnedIndex(tab, existing.fixedIndex);

        if (!isSameTabContent(existing, updated)) {
          tabs.value = tabs.value.map((item) => (item.id === tab.id ? updated : item));
          changed = true;
        }
      }
    }

    if (active) {
      activeTabId.value = tab.id;
    }

    if (changed) {
      persist();
    }
  }

  /** Close a tab; returns the tab to activate when the closed one was active. */
  function removeTab(tabId: string): ClosedTabs {
    if (isRetained(tabId) || findTab(tabId) === undefined) {
      return { nextTab: undefined, removedTabs: [] };
    }

    return removeTabsByIds(orderedTabs.value, new Set<string>([tabId]));
  }

  /**
   * Close every unpinned tab except keepTabIds. The home tab and the pinned
   * tabs are always kept. Returns the tab to activate when the active one was
   * closed.
   */
  function clearTabs(keepTabIds: readonly string[] = []): ClosedTabs {
    const keep = new Set(keepTabIds);
    const removedIds = new Set(
      tabs.value
        .filter((tab) => tab.fixedIndex === undefined && !keep.has(tab.id))
        .map((tab) => tab.id),
    );

    return removeTabsByIds(orderedTabs.value, removedIds);
  }

  /**
   * Close the unpinned tabs left of the target, keeping the target and everything
   * right of it; the home and pinned tabs are retained.
   */
  function clearLeftTabs(tabId: string): ClosedTabs {
    const previousOrder = orderedTabs.value;
    const targetIndex = previousOrder.findIndex((tab) => tab.id === tabId);

    if (targetIndex === -1) {
      return { nextTab: undefined, removedTabs: [] };
    }

    const removedIds = new Set<string>();

    for (const tab of previousOrder.slice(0, targetIndex)) {
      if (!isRetained(tab.id)) {
        removedIds.add(tab.id);
      }
    }

    return removeTabsByIds(previousOrder, removedIds);
  }

  /**
   * Close the unpinned tabs right of the target; on the home tab every unpinned
   * tab is closed (the pinned tabs are retained).
   */
  function clearRightTabs(tabId: string): ClosedTabs {
    if (homeTab.value !== null && tabId === homeTab.value.id) {
      return clearTabs();
    }

    const previousOrder = orderedTabs.value;
    const targetIndex = previousOrder.findIndex((tab) => tab.id === tabId);

    if (targetIndex === -1) {
      return { nextTab: undefined, removedTabs: [] };
    }

    const removedIds = new Set<string>();

    for (const tab of previousOrder.slice(targetIndex + 1)) {
      if (!isRetained(tab.id)) {
        removedIds.add(tab.id);
      }
    }

    return removeTabsByIds(previousOrder, removedIds);
  }

  /** Pin a tab: it moves to the end of the pinned group, right after the home tab. */
  function pinTab(tabId: string): void {
    const tab = findTab(tabId);

    if (tab === undefined || isRetained(tabId)) {
      return;
    }

    const fixedIndex = tabs.value.filter(isFixedTab).length;

    tabs.value = renumberPinnedTabs(
      tabs.value.map((item) => (item.id === tabId ? withPinnedIndex(item, fixedIndex) : item)),
    );
    persist();
  }

  /** Unpin a tab: it leaves the pinned group and returns to its insertion position. */
  function unpinTab(tabId: string): void {
    if (!isPinned(tabId)) {
      return;
    }

    tabs.value = renumberPinnedTabs(
      tabs.value.map((item) => (item.id === tabId ? withoutPinnedIndex(item) : item)),
    );
    persist();
  }

  return {
    homeTab,
    orderedTabs,
    activeTabId,
    isRetained,
    isPinned,
    setActiveTabId,
    initTabs,
    addTab,
    removeTab,
    clearTabs,
    clearLeftTabs,
    clearRightTabs,
    pinTab,
    unpinTab,
  };
});
