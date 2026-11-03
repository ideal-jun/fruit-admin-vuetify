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
  nav: {
    menu: string;
    home: string;
    fruits: string;
  };
  layout: {
    toggleTheme: string;
    signIn: string;
    signOut: string;
    signedInAs: string;
    openMenu: string;
    expandSidebar: string;
    collapseSidebar: string;
    search: string;
    searchPlaceholder: string;
    searchEmpty: string;
    searchPrompt: string;
    searchHint: string;
    fullscreen: string;
    exitFullscreen: string;
  };
  theme: {
    title: string;
    mode: string;
    modeLight: string;
    modeDark: string;
    modeSystem: string;
    primary: string;
    reset: string;
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
  views: {
    login: {
      title: string;
      subtitle: string;
      username: string;
      password: string;
      submit: string;
      hint: string;
    };
    fruits: {
      title: string;
      name: string;
      price: string;
      items: {
        apple: string;
        banana: string;
        orange: string;
      };
    };
  };
}
