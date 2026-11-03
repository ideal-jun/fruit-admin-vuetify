import type { AppearanceSettings, ThemeMode } from '@/typings/theme';

/** localStorage key for the persisted appearance settings. */
export const APPEARANCE_STORAGE_KEY = 'fruit-admin.appearance';

/** Vuetify's own default: follow the OS colour scheme until the user picks one. */
export const DEFAULT_THEME_MODE: ThemeMode = 'system';

/** Vuetify's default light primary, applied to both themes so the app has one brand color. */
export const DEFAULT_PRIMARY_COLOR = '#1867C0';

/** Preset primary colors offered by the appearance drawer. */
export const PRIMARY_COLOR_SWATCHES: readonly string[] = [
  '#1867C0',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#0ea5e9',
  '#06b6d4',
  '#f43f5e',
  '#ef4444',
  '#ec4899',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#22c55e',
  '#10b981',
];

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

/** Theme modes supported by the app (Vuetify itself accepts any theme name). */
export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

const THEME_MODE_SET: ReadonlySet<string> = new Set<string>(THEME_MODES);

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && THEME_MODE_SET.has(value);
}

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_PATTERN.test(value);
}

/** Whether a hex color is light enough to need a dark foreground on top of it. */
export function isLightHexColor(hex: string): boolean {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  const luma = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luma > 0.6;
}

/** Read the persisted appearance settings, falling back to the defaults. */
export function readAppearanceSettings(): AppearanceSettings {
  const fallback: AppearanceSettings = {
    mode: DEFAULT_THEME_MODE,
    primary: DEFAULT_PRIMARY_COLOR,
  };

  if (typeof localStorage === 'undefined') {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(APPEARANCE_STORAGE_KEY);

    if (raw === null) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== 'object' || parsed === null) {
      return fallback;
    }

    const { mode, primary } = parsed as { mode?: unknown; primary?: unknown };

    return {
      mode: isThemeMode(mode) ? mode : DEFAULT_THEME_MODE,
      primary: isHexColor(primary) ? primary : DEFAULT_PRIMARY_COLOR,
    };
  } catch {
    return fallback;
  }
}

/** Persist the appearance settings; storage may be unavailable (private mode, SSR). */
export function writeAppearanceSettings(settings: AppearanceSettings): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable: the app still works with in-memory settings.
  }
}
