import type { ThemePresetDefinition } from '@/typings/theme';

/**
 * Theme presets rendered in the appearance drawer's preset tab.
 *
 * A preset is a partial settings patch: applying it keeps unrelated shell settings
 * (header/sidebar/watermark) and only overrides the visual identity it defines.
 */
export const THEME_PRESETS: readonly ThemePresetDefinition[] = [
  {
    id: 'default',
    nameKey: 'theme.preset.defaultName',
    descriptionKey: 'theme.preset.defaultDesc',
    settings: {
      mode: 'light',
      primary: '#1867C0',
      radius: 4,
      grayscale: false,
      colourWeakness: false,
      tab: { mode: 'chrome' },
    },
  },
  {
    id: 'midnight',
    nameKey: 'theme.preset.midnightName',
    descriptionKey: 'theme.preset.midnightDesc',
    settings: {
      mode: 'dark',
      primary: '#3b82f6',
      radius: 8,
      tab: { mode: 'chrome' },
    },
  },
  {
    id: 'violet',
    nameKey: 'theme.preset.violetName',
    descriptionKey: 'theme.preset.violetDesc',
    settings: {
      mode: 'light',
      primary: '#8b5cf6',
      radius: 12,
      tab: { mode: 'button' },
    },
  },
  {
    id: 'emerald',
    nameKey: 'theme.preset.emeraldName',
    descriptionKey: 'theme.preset.emeraldDesc',
    settings: {
      mode: 'light',
      primary: '#10b981',
      radius: 4,
      tab: { mode: 'slider' },
    },
  },
];
