/** Theme modes exposed by the appearance settings (mirrors Vuetify's `defaultTheme`). */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Appearance settings persisted in localStorage. */
export interface AppearanceSettings {
  readonly mode: ThemeMode;
  readonly primary: string;
}
