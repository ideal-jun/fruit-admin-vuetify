import type { AppLocale } from '@/typings/i18n';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { DEFAULT_LOCALE, isAppLocale, SUPPORTED_LOCALES } from '@/locales';

/**
 * App-level locale helper.
 *
 * Reads and writes the global vue-i18n locale. Persisting the choice and
 * syncing `<html lang>` / `document.title` is done once in src/plugins/i18n.ts,
 * so every caller — app code as well as Vuetify's own `useLocale()` — stays in
 * sync automatically.
 */
export function useAppLocale() {
  const { locale } = useI18n({ useScope: 'global' });

  const currentLocale = computed<AppLocale>(() =>
    isAppLocale(locale.value) ? locale.value : DEFAULT_LOCALE,
  );

  function setLocale(next: AppLocale) {
    locale.value = next;
  }

  return {
    currentLocale,
    localeOptions: SUPPORTED_LOCALES,
    setLocale,
  };
}
