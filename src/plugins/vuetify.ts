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
  defaults: {
    VCard: {
      elevation: 1,
    },
    VSheet: {
      elevation: 1,
    },
    VTextField: {
      color: 'primary',
      density: 'compact',
      variant: 'outlined',
    },
    VCheckbox: {
      color: 'primary',
      density: 'compact',
      variant: 'outlined',
    },

    VCheckboxBtn: {
      color: 'primary',
      density: 'compact',
      variant: 'outlined',
    },
    VRadio: {
      color: 'primary',
      density: 'compact',
      variant: 'outlined',
    },
    VSelect: {
      color: 'primary',
      density: 'compact',
      variant: 'outlined',
    },
    VSwitch: {
      color: 'primary',
      density: 'compact',
    },
  },
  theme: {
    defaultTheme: 'system',
    themes: {
      light: {
        colors: {
          background: '#f5f9fb',
        },
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
