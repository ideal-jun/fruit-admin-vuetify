import type { AppLocale } from '@/typings/i18n';

import { computed } from 'vue';
import { useLocale } from 'vuetify';

import { DEFAULT_LOCALE, isAppLocale, SUPPORTED_LOCALES } from '@/locales';

/**
 * App-level locale helper built on Vuetify's `useLocale()` — the same locale that drives
 * every Vuetify component through `createVueI18nAdapter`.
 *
 * Persisting the choice and syncing `<html lang>` is done once in src/plugins/i18n.ts,
 * which watches the vue-i18n locale exposed by the adapter.
 */
export function useAppLocale() {
  const { current } = useLocale();

  const currentLocale = computed<AppLocale>(() =>
    isAppLocale(current.value) ? current.value : DEFAULT_LOCALE,
  );

  function setLocale(next: AppLocale) {
    current.value = next;
  }

  return {
    currentLocale,
    localeOptions: SUPPORTED_LOCALES,
    setLocale,
  };
}
