import type { RouteMeta } from 'vue-router';

import { defineStore } from 'pinia';
import { nextTick, ref } from 'vue';

import router from '@/router';

/** KeepAlive component name declared by a route through `meta.keepAlive`. */
function getCacheRouteName(meta: RouteMeta): string | undefined {
  const name = meta.keepAlive;

  return typeof name === 'string' && name !== '' ? name : undefined;
}

/** KeepAlive names of the given route full paths (used when tabs are closed). */
function getCacheRouteNames(fullPaths: readonly string[]): string[] {
  const names = fullPaths
    .map((fullPath) => getCacheRouteName(router.resolve(fullPath).meta))
    .filter((name): name is string => name !== undefined);

  return [...new Set(names)];
}

/** Every view component name the route table allows KeepAlive to cache. */
function collectCacheRoutes(): string[] {
  const names = new Set<string>();

  for (const record of router.getRoutes()) {
    const name = record.meta.keepAlive;

    if (typeof name === 'string' && name !== '') {
      names.add(name);
    }
  }

  return [...names];
}

/**
 * Route-level KeepAlive cache, ported from the reference route store.
 *
 * `cacheRoutes` is the KeepAlive `include` list; `excludeCacheRoutes` is used for one
 * render tick to drop a view from the cache (refresh / closed tab). The store only
 * tracks names — the actual cache lives inside `<KeepAlive>` in BaseLayout.
 */
export const useRouteStore = defineStore('route', () => {
  const cacheRoutes = ref<string[]>(collectCacheRoutes());
  const excludeCacheRoutes = ref<string[]>([]);

  /**
   * Drop cached views, mirroring the reference `resetRouteCache`: exclude them for one
   * tick so KeepAlive prunes the entries, then clear the exclusion.
   * Without arguments the current route's view is dropped.
   */
  async function resetRouteCache(names: readonly string[] | string = []): Promise<void> {
    const targets = typeof names === 'string' ? [names] : [...names];
    const routeNames =
      targets.length > 0
        ? [...new Set(targets)]
        : [getCacheRouteName(router.currentRoute.value.meta)].filter(
            (name): name is string => name !== undefined,
          );

    if (routeNames.length === 0) {
      return;
    }

    excludeCacheRoutes.value = [...new Set([...excludeCacheRoutes.value, ...routeNames])];

    await nextTick();

    excludeCacheRoutes.value = [];
  }

  return { cacheRoutes, excludeCacheRoutes, getCacheRouteNames, resetRouteCache };
});
