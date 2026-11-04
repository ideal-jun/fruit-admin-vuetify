/**
 * Route metadata understood by the app shell.
 *
 * Declared here (not in `src/router/routes.ts`) so every route definition gets
 * autocomplete and type checking for these fields.
 *
 * Layouts are **not** part of the metadata: they are parent routes
 * (`component: BaseLayout` / `BlankLayout`) whose children are the views —
 * see `src/router/routes.ts`.
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** AppBar / document title, translated through vue-i18n. */
    titleKey?: string;
    /** Icon used by the sidebar navigation. */
    icon?: string;
    /** Include this route in the sidebar navigation. */
    nav?: boolean;
    /** Mark the shell's landing route: its tab is the retained home tab. */
    home?: boolean;
    /**
     * KeepAlive component name of this view (e.g. `HomeView`). Routes with a name here
     * are cached while their tab is open; closing the tab or refreshing drops the cache.
     */
    keepAlive?: string;
    /**
     * Let the view own the remaining content height (the layout container becomes
     * `h-full`). Used by pages whose card/table must fill the viewport.
     */
    fullHeight?: boolean;
  }
}

// Keep this file a module: `declare module 'vue-router'` above is a module augmentation,
// and in a non-module file it would *replace* vue-router's types.
export {};
