import { addColorAlpha, transformColorWithOpacity } from '@/theme/color';

/** CSS variables consumed by PageTab.vue. */
export interface PageTabCssVars {
  [key: `--${string}`]: string;
  '--page-tab-primary': string;
  '--page-tab-primary-1': string;
  '--page-tab-primary-2': string;
  '--page-tab-primary-opacity-1': string;
  '--page-tab-primary-opacity-2': string;
  '--page-tab-primary-opacity-3': string;
}

/**
 * Create the CSS variables shared by every page-tab style.
 *
 * The chrome tabs paint their shaped background from these values: `primary-1` is the
 * primary tint mixed over white (light theme), `primary-2` the same over black (dark
 * theme), while the `*-opacity-*` values are used by the button/slider styles.
 */
export function createTabCssVars(activeColor: string): PageTabCssVars {
  return {
    '--page-tab-primary': activeColor,
    '--page-tab-primary-1': transformColorWithOpacity(activeColor, 0.1, '#ffffff'),
    '--page-tab-primary-2': transformColorWithOpacity(activeColor, 0.3, '#000000'),
    '--page-tab-primary-opacity-1': addColorAlpha(activeColor, 0.1),
    '--page-tab-primary-opacity-2': addColorAlpha(activeColor, 0.15),
    '--page-tab-primary-opacity-3': addColorAlpha(activeColor, 0.3),
  };
}
