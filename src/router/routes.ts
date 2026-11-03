import type { RouteRecordRaw } from 'vue-router';

import BaseLayout from '@/layouts/BaseLayout.vue';
import BlankLayout from '@/layouts/BlankLayout.vue';

/**
 * Route table.
 *
 * Layouts are ordinary **parent routes**: the layout component is the record's
 * `component` and views (route-level components in `src/views`) are its children, so
 * every layout renders its own `<RouterView />` inside its content area. Views
 * therefore never know (or care) which shell they are rendered in.
 *
 *   /            → BaseLayout  (drawer + header + <RouterView/>)
 *     ''         → home
 *     'fruits'   → fruits
 *   /            → BlankLayout (full-screen <RouterView/>)
 *     'login'    → login
 *
 * Routes with `meta.nav === true` + `meta.titleKey` also appear in the sidebar.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BaseLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/index.vue'),
        meta: { titleKey: 'nav.home', icon: 'mdi-home-outline', nav: true, home: true },
      },
      {
        path: 'fruits',
        name: 'fruits',
        component: () => import('@/views/fruits.vue'),
        meta: { titleKey: 'nav.fruits', icon: 'mdi-fruit-cherries', nav: true },
      },
    ],
  },
  {
    // Full-screen views share the root path and live under BlankLayout.
    path: '/login',
    component: BlankLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/login.vue'),
        meta: { titleKey: 'views.login.title' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    // Path form: a `{ name }` redirect would forward the unmatched `pathMatch` param
    // and log VUE_ROUTER_R0100 ("discarded invalid param").
    redirect: '/',
  },
];
