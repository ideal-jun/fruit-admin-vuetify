/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from 'vue';

// Plugins
import { createPinia } from 'pinia';

import router from '../router';
import i18n from './i18n';
import vuetify from './vuetify';

export function registerPlugins(app: App) {
  // i18n first: Vuetify's locale adapter resolves component strings through it.
  app.use(i18n);
  app.use(vuetify);
  app.use(createPinia());
  app.use(router);
}
