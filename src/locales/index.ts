import type { AppLocale, LocaleOption } from '@/typings/i18n';

import { en as vuetifyEn, zhHans as vuetifyZhHans } from 'vuetify/locale';

import en from './en';
import zhHans from './zh-Hans';

export type { AppLocale, LocaleOption } from '@/typings/i18n';

export const DEFAULT_LOCALE: AppLocale = 'zh-Hans';

export const FALLBACK_LOCALE: AppLocale = 'en';

/** Locales that ship with the app (Vuetify's own translations included). */
export const SUPPORTED_LOCALES: readonly LocaleOption[] = [
  { value: 'zh-Hans', label: '中文' },
  { value: 'en', label: 'English' },
];

/** localStorage key used to remember the user's locale. */
export const LOCALE_STORAGE_KEY = 'fruit-admin.locale';

export function isAppLocale(value: unknown): value is AppLocale {
  return SUPPORTED_LOCALES.some((option) => option.value === value);
}

/**
 * vue-i18n messages for every supported locale.
 *
 * Vuetify resolves its component strings through `$vuetify.*` (see
 * `createVueI18nAdapter` in src/plugins/vuetify.ts), so Vuetify's own locale
 * bundles are merged under the `$vuetify` namespace while app messages stay at
 * the root. That keeps a single source of truth: one locale switch drives both
 * the application and every Vuetify component.
 */
export const messages = {
  'zh-Hans': { $vuetify: vuetifyZhHans, ...zhHans },
  en: { $vuetify: vuetifyEn, ...en },
} satisfies Record<AppLocale, Record<string, unknown>>;
