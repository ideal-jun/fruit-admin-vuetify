import type { NavigationItem } from '@/typings/navigation';

import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from 'vuetify';

/**
 * Sidebar navigation derived from the router table: every route with
 * `meta.nav === true` and a `meta.titleKey` shows up here, translated with
 * vue-i18n. Adding a route is enough to add a menu entry.
 */
export function useNavigation() {
  const router = useRouter();
  const { t } = useLocale();

  return computed<NavigationItem[]>(() =>
    router.getRoutes().flatMap((route) => {
      const { nav, titleKey, icon } = route.meta;

      if (nav !== true || titleKey === undefined) {
        return [];
      }

      return [{ to: route.path, title: t(titleKey), icon: icon ?? 'mdi-circle-small' }];
    }),
  );
}
