import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLocale } from 'vuetify';

/**
 * Route-aware page title, shared by the app shell (AppHeader) and the document
 * title (App.vue): one source of truth for "which title belongs to this route".
 */
export function usePageTitle() {
  const route = useRoute();
  const { t } = useLocale();

  const appName = computed(() => t('app.name'));

  const pageTitle = computed(() => {
    const titleKey = route.meta.titleKey;

    return titleKey === undefined ? '' : t(titleKey);
  });

  /** AppBar title: the page title, or the app name for routes without one. */
  const title = computed(() => pageTitle.value || appName.value);

  /** `document.title`: `Page · App`, or just the app name for untitled routes. */
  const documentTitle = computed(() =>
    pageTitle.value === '' ? appName.value : `${pageTitle.value} · ${appName.value}`,
  );

  return { title, documentTitle };
}
