/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Composables
// vue-i18n's `useI18n` is required *by the adapter*; app code uses Vuetify's `useLocale()`
// (which the adapter backs with this same vue-i18n instance).
import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';

import { forVuetify } from '../theme/breakpoints';
import i18n from './i18n';

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  // Vuetify components (empty states, date pickers, pagination, …) are translated
  // through vue-i18n: their `$vuetify.*` strings live next to the app messages in
  // src/locales. Switching the vue-i18n locale updates Vuetify at the same time.
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
    fallback: 'en',
  },
  theme: {
    defaultTheme: 'system',
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: forVuetify,
  },
});
