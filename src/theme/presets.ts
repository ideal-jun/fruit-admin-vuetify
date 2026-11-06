import type { ThemePresetDefinition } from '@/typings/theme';

/**
 * Theme presets rendered in the appearance drawer's preset tab.
 *
 * A preset is a partial settings patch: applying it keeps unrelated shell settings
 * (header/sidebar/watermark) and only overrides the visual identity it defines.
 * Every preset defines all five theme colors so switching presets never keeps a
 * mismatch from the previous color scheme.
 */
export const THEME_PRESETS: readonly ThemePresetDefinition[] = [
  {
    id: 'default',
    nameKey: 'theme.preset.defaultName',
    descriptionKey: 'theme.preset.defaultDesc',
    version: '1.0.0',
    settings: {
      mode: 'light',
      primary: '#646CFF',
      otherColors: {
        info: '#2080F0',
        success: '#18A058',
        warning: '#F0A020',
        error: '#D03050',
      },
      isInfoFollowPrimary: false,
      radius: 8,
      grayscale: false,
      colourWeakness: false,
      tab: { mode: 'chrome' },
    },
  },
  {
    id: 'midnight',
    nameKey: 'theme.preset.midnightName',
    descriptionKey: 'theme.preset.midnightDesc',
    version: '1.0.0',
    settings: {
      mode: 'dark',
      primary: '#3B82F6',
      otherColors: {
        info: '#38BDF8',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      isInfoFollowPrimary: false,
      radius: 8,
      tab: { mode: 'chrome' },
    },
  },
  {
    id: 'violet',
    nameKey: 'theme.preset.violetName',
    descriptionKey: 'theme.preset.violetDesc',
    version: '1.1.0',
    settings: {
      mode: 'light',
      primary: '#8B5CF6',
      otherColors: {
        info: '#6366F1',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#F43F5E',
      },
      isInfoFollowPrimary: false,
      radius: 12,
      tab: { mode: 'button' },
    },
  },
  {
    id: 'emerald',
    nameKey: 'theme.preset.emeraldName',
    descriptionKey: 'theme.preset.emeraldDesc',
    version: '1.0.0',
    settings: {
      mode: 'light',
      primary: '#10B981',
      otherColors: {
        info: '#0EA5E9',
        success: '#22C55E',
        warning: '#EAB308',
        error: '#EF4444',
      },
      isInfoFollowPrimary: false,
      radius: 8,
      tab: { mode: 'slider' },
    },
  },
];
