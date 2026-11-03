import type { AppLocale } from '@/typings/i18n';

import { watch } from 'vue';
import { createI18n } from 'vue-i18n';

import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  isAppLocale,
  LOCALE_STORAGE_KEY,
  messages,
} from '@/locales';

function resolveInitialLocale(): AppLocale {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);

  return isAppLocale(stored) ? stored : DEFAULT_LOCALE;
}

// Widened to `string` on purpose: vue-i18n would otherwise narrow its composer to our
// union of locale codes, which is incompatible with Vuetify's locale adapter types.
const initialLocale: string = resolveInitialLocale();

const i18n = createI18n({
  // Vuetify does not support vue-i18n's legacy mode.
  legacy: false,
  locale: initialLocale,
  fallbackLocale: FALLBACK_LOCALE,
  messages,
});

// Keep <html lang> and the saved preference in sync with the active locale, no
// matter whether the change comes from the app or from Vuetify's useLocale().
// `document.title` is route aware and therefore handled in App.vue.
watch(
  i18n.global.locale,
  (locale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Storage can be unavailable (private mode / disabled cookies): the app still works.
    }
  },
  { immediate: true },
);

export default i18n;
