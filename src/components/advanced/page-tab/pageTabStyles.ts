import { addColorAlpha } from '@/theme/color';

/** CSS variables consumed by PageTab.vue. */
export interface PageTabCssVars {
  [key: `--${string}`]: string;
  '--page-tab-primary': string;
  '--page-tab-active-bg': string;
  '--page-tab-hover-bg': string;
  '--page-tab-divider': string;
  '--page-tab-primary-opacity-3': string;
}

/**
 * Create the CSS variables shared by every page-tab style.
 *
 * The state backgrounds reuse Vuetify's own overlay formulas and are composited over
 * `--v-theme-surface` (instead of staying translucent) so the overlapping chrome-tab
 * shapes paint cleanly:
 *
 * - active: primary at `--v-activated-opacity × --v-theme-overlay-multiplier` — the exact
 *   tint `VListItem` paints for the selected sidebar entry;
 * - hover: on-surface at `--v-hover-opacity × --v-theme-overlay-multiplier` — the same
 *   hover tint as the sidebar entries.
 */
export function createTabCssVars(activeColor: string): PageTabCssVars {
  return {
    '--page-tab-primary': activeColor,
    '--page-tab-active-bg':
      'color-mix(in srgb, rgb(var(--v-theme-primary)) calc(var(--v-activated-opacity) * var(--v-theme-overlay-multiplier) * 100%), rgb(var(--v-theme-surface)))',
    '--page-tab-hover-bg':
      'color-mix(in srgb, rgb(var(--v-theme-on-surface)) calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier) * 100%), rgb(var(--v-theme-surface)))',
    '--page-tab-divider': 'color-mix(in srgb, rgb(var(--v-theme-on-surface)) 12%, transparent)',
    '--page-tab-primary-opacity-3': addColorAlpha(activeColor, 0.3),
  };
}
