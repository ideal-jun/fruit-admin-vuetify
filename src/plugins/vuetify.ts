import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';

import { forVuetify } from '../theme/breakpoints';
import i18n from './i18n';

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
    fallback: 'en',
  },
  theme: {
    defaultTheme: 'system',
    themes: {
      light: {
        variables: {
          'high-emphasis-opacity': 0.82,
          'medium-emphasis-opacity': 0.6,
        },
      },
      dark: {
        variables: {
          'high-emphasis-opacity': 0.82,
          'medium-emphasis-opacity': 0.6,
        },
      },
    },
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: forVuetify,
  },
});
