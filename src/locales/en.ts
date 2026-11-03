import type { AppMessages } from '@/typings/i18n';

const messages: AppMessages = {
  app: {
    name: 'Fruit Admin',
    tagline: 'Vue 3 + Vuetify 4 + UnoCSS admin scaffold',
  },
  nav: {
    menu: 'Menu',
    home: 'Home',
    fruits: 'Fruits',
  },
  layout: {
    toggleTheme: 'Toggle theme',
    signIn: 'Sign in',
    signOut: 'Sign out',
    signedInAs: 'Signed in as',
    openMenu: 'Open menu',
    expandSidebar: 'Expand sidebar',
    collapseSidebar: 'Collapse sidebar',
    search: 'Search',
    searchPlaceholder: 'Search pages…',
    searchEmpty: 'No matching pages',
    searchPrompt: 'Your search results will appear here',
    searchHint: '↑↓ to select · Enter to open · Esc to close',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
  },
  theme: {
    title: 'Appearance',
    mode: 'Theme mode',
    modeLight: 'Light',
    modeDark: 'Dark',
    modeSystem: 'System',
    primary: 'Primary color',
    reset: 'Reset to default',
  },
  locale: {
    label: 'Language',
    zhHans: '中文',
    en: 'English',
  },
  demo: {
    title: 'i18n demo',
    description:
      'The locale is owned by vue-i18n; Vuetify built-in strings (empty states, dates, pagination) come from the same $vuetify namespace.',
    selectLabel: 'Pick a fruit (the list is empty to show Vuetify built-in empty state)',
    currentLocale: 'Current locale: {0}',
  },
  views: {
    login: {
      title: 'Sign in',
      subtitle: 'Welcome back, please sign in to your account',
      username: 'Username',
      password: 'Password',
      submit: 'Sign in',
      hint: 'Demo only: any credentials work',
    },
    fruits: {
      title: 'Fruits',
      name: 'Name',
      price: 'Price (CNY)',
      items: {
        apple: 'Apple',
        banana: 'Banana',
        orange: 'Orange',
      },
    },
  },
};

export default messages;
