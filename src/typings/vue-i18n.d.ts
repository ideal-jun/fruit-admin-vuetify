import type { AppMessages } from './i18n';

/**
 * Registers the app's message schema with vue-i18n.
 *
 * Effect: `i18n.global.t` (the API behind Vuetify's `useLocale().t` adapter) gets
 * **key autocomplete and typed `JsonPaths`** for our messages, and any locale file is
 * validated against `AppMessages`, so a missing key is a compile error.
 *
 * Note: vue-i18n intentionally accepts arbitrary strings in `t()` (`Key extends string`)
 * to support dynamic keys, so a typo is not a hard error — the type system catches
 * *missing/mismatched locale structure*, not unknown runtime keys.
 *
 * Vuetify resolves its own component strings through the same composer
 * (`createVueI18nAdapter`), so the `$vuetify` namespace is part of the schema as well.
 */
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends AppMessages {
    $vuetify: Record<string, unknown>;
  }
}
