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
    users: string;
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
    contentFullscreen: string;
    contentFullscreenExit: string;
  };
  tabs: {
    label: string;
    actions: string;
    closeCurrent: string;
    closeOthers: string;
    closeLeft: string;
    closeRight: string;
    closeAll: string;
    pin: string;
    unpin: string;
    close: string;
    reload: string;
  };
  theme: {
    title: string;
    mode: string;
    modeLight: string;
    modeDark: string;
    modeSystem: string;
    primary: string;
    tabMode: string;
    tabModeChrome: string;
    tabModeButton: string;
    tabModeSlider: string;
    reset: string;
    tabs: {
      appearance: string;
      layout: string;
      general: string;
      preset: string;
    };
    appearance: {
      title: string;
      radius: string;
      grayscale: string;
      colourWeakness: string;
    };
    layout: {
      title: string;
      tabVisible: string;
      tabCache: string;
      tabHeight: string;
      tabStyle: string;
      closeTabByMiddleClick: string;
      pageTitle: string;
      pageAnimate: string;
      pageAnimateMode: string;
      pageAnimateFade: string;
      pageAnimateSlide: string;
      pageAnimateBottom: string;
      pageAnimateScale: string;
      headerTitle: string;
      headerHeight: string;
      breadcrumbVisible: string;
      breadcrumbShowIcon: string;
      siderTitle: string;
      siderWidth: string;
      siderCollapsedWidth: string;
    };
    general: {
      title: string;
      searchVisible: string;
      localeVisible: string;
      watermarkTitle: string;
      watermarkVisible: string;
      watermarkText: string;
      watermarkUserName: string;
      watermarkTime: string;
      watermarkTimeFormat: string;
    };
    preset: {
      title: string;
      apply: string;
      applied: string;
      defaultName: string;
      defaultDesc: string;
      midnightName: string;
      midnightDesc: string;
      violetName: string;
      violetDesc: string;
      emeraldName: string;
      emeraldDesc: string;
    };
    config: {
      copy: string;
      reset: string;
      copySuccess: string;
      resetSuccess: string;
    };
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
    users: {
      title: string;
      addUser: string;
      editUser: string;
      search: string;
      reset: string;
      refresh: string;
      columns: string;
      add: string;
      delete: string;
      batchDelete: string;
      operate: string;
      index: string;
      username: string;
      nickname: string;
      userGender: string;
      userPhone: string;
      userEmail: string;
      userStatus: string;
      userRole: string;
      createTime: string;
      male: string;
      female: string;
      enabled: string;
      disabled: string;
      roles: {
        super: string;
        admin: string;
        user: string;
      };
      form: {
        username: string;
        nickname: string;
        userPhone: string;
        userEmail: string;
        userRole: string;
      };
      validation: {
        username: string;
        email: string;
        phone: string;
      };
      confirmDeleteTitle: string;
      confirmDelete: string;
      confirmBatchDelete: string;
      addSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
      batchDeleteSuccess: string;
      empty: string;
      cancel: string;
      confirm: string;
      save: string;
    };
  };
}
