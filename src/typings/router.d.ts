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
  }
}

// Keep this file a module: `declare module 'vue-router'` above is a module augmentation,
// and in a non-module file it would *replace* vue-router's types.
export {};
