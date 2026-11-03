import type { BreadcrumbItem } from '@/typings/navigation';

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocale } from 'vuetify';

/**
 * Breadcrumb trail derived from the router table: the first navigation entry (the
 * home route at `/`) followed by the current route. Like `useNavigation`, adding
 * a route with `meta.titleKey` is enough to get a translated crumb.
 */
export function useBreadcrumb() {
  const route = useRoute();
  const router = useRouter();
  const { t } = useLocale();

  return computed<BreadcrumbItem[]>(() => {
    const root = router.getRoutes().find((record) => {
      return record.path === '/' && record.meta.nav === true;
    });
    const currentTitleKey = route.meta.titleKey;
    const items: BreadcrumbItem[] = [];

    if (root !== undefined && root.meta.titleKey !== undefined) {
      items.push({ title: t(root.meta.titleKey), icon: root.meta.icon, to: root.path });
    }

    if (currentTitleKey !== undefined && route.path !== root?.path) {
      items.push({ title: t(currentTitleKey), icon: route.meta.icon });
    }

    return items;
  });
}
