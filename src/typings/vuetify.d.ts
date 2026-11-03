import type { AppMessages } from './i18n';
import type { LocaleInstance, RtlInstance } from 'vuetify/framework';

export * from 'vuetify/framework';

/**
 * Dot-separated paths to every string leaf of the app messages.
 *
 * The locale files are typed with `AppMessages`, so every key here is guaranteed to
 * exist in both languages.
 */
type MessageKey<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${MessageKey<T[K]>}`;
}[keyof T & string];

/** Every known app message key (`app.name`, `views.fruits.items.apple`, …). */
export type AppMessageKey = MessageKey<AppMessages>;

/**
 * Autocomplete-friendly string: IntelliSense suggests the known keys, while dynamic
 * keys (e.g. `meta.titleKey`) still type-check — the same behaviour vue-i18n's typed
 * `t()` had.
 */
type LooseMessageKey = AppMessageKey | (string & Record<never, never>);

/**
 * Typed override for Vuetify's `useLocale()`.
 *
 * The app's tsconfig maps the bare `vuetify` specifier to this file, so `useLocale().t`
 * regains key autocomplete without touching any component code. Runtime is unaffected:
 * Vite still resolves the real `vuetify` package.
 */
export declare function useLocale(): Omit<LocaleInstance & RtlInstance, 't'> & {
  t: (key: LooseMessageKey, ...params: unknown[]) => string;
};
