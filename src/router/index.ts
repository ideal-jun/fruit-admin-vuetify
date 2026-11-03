/**
 * router/index.ts
 *
 * Creates the router from the route table in `./routes.ts`.
 */
import { createRouter, createWebHistory } from 'vue-router';

import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Restore the previous position on back/forward, scroll to top on new navigations.
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
});

export default router;
