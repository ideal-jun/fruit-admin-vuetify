/** Locale codes shipped with the app. Keep in sync with `SUPPORTED_LOCALES`. */
export type AppLocale = 'zh-Hans' | 'en';

/** One entry of the language switcher. */
export interface LocaleOption {
  readonly value: AppLocale;
  readonly label: string;
}

/**
 * Shape of the application's vue-i18n messages.
 *
 * Every locale file (`src/locales/*.ts`) is typed with this interface, so a missing or
 * mistyped key is a compile error. Vuetify's own component strings are namespaced under
 * `$vuetify` and merged separately (see `src/locales/index.ts`), which is why they are not
 * part of this interface.
 */
export interface AppMessages {
  app: {
    name: string;
    tagline: string;
  };
  locale: {
    label: string;
    zhHans: string;
    en: string;
  };
  demo: {
    title: string;
    description: string;
    selectLabel: string;
    currentLocale: string;
  };
}
