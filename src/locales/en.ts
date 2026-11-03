import type { AppMessages } from '@/typings/i18n';

const messages: AppMessages = {
  app: {
    name: 'Fruit Admin',
    tagline: 'Vue 3 + Vuetify 4 + UnoCSS admin scaffold',
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
    currentLocale: 'Current locale: {locale}',
  },
};

export default messages;
