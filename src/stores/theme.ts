import type { ThemeMode } from '@/typings/theme';

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTheme } from 'vuetify';

import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_THEME_MODE,
  readAppearanceSettings,
  THEME_MODES,
  writeAppearanceSettings,
} from '@/theme/appearance';

/**
 * Appearance settings: theme mode (light / dark / system) and primary color.
 *
 * The Vuetify theme instance stays the single renderer: mutating it here updates
 * every component (and the UnoCSS `bg-primary` utilities) at once. Settings are
 * persisted in localStorage and applied when the store is created in App.vue,
 * i.e. before the shell renders. Each action applies its change explicitly, so the
 * store has no implicit side effects.
 */
export const useThemeStore = defineStore('theme', () => {
  const theme = useTheme();
  const stored = readAppearanceSettings();

  const mode = ref<ThemeMode>(stored.mode);
  const primary = ref(stored.primary);

  function applyMode(value: ThemeMode) {
    void theme.change(value);
  }

  function applyPrimary(color: string) {
    for (const definition of Object.values(theme.themes.value)) {
      definition.colors.primary = color;
    }
  }

  function persist() {
    writeAppearanceSettings({ mode: mode.value, primary: primary.value });
  }

  function setMode(value: ThemeMode) {
    mode.value = value;
    applyMode(value);
    persist();
  }

  function setPrimary(value: string) {
    primary.value = value;
    applyPrimary(value);
    persist();
  }

  /** Cycle light → dark → system (used by the app-bar theme toggle). */
  function cycleMode() {
    const index = THEME_MODES.indexOf(mode.value);
    setMode(THEME_MODES[(index + 1) % THEME_MODES.length] ?? DEFAULT_THEME_MODE);
  }

  /** Back to the defaults (Vuetify's system theme + default primary). */
  function reset() {
    setMode(DEFAULT_THEME_MODE);
    setPrimary(DEFAULT_PRIMARY_COLOR);
  }

  // Apply the persisted settings when the store is created (App.vue, before render).
  applyMode(mode.value);
  applyPrimary(primary.value);

  return { mode, primary, setMode, setPrimary, cycleMode, reset };
});
