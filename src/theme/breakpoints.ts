import type { DisplayThresholds } from 'vuetify';

// repeated in settings.scss
const breakpoints: DisplayThresholds = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560,
};

export const forVuetify: DisplayThresholds = breakpoints;

/** Same breakpoints in the shape UnoCSS expects (`Record<string, string>`). */
export const forUnoCSS: Record<string, string> = Object.fromEntries(
  Object.entries(breakpoints).map(([key, value]) => [key, `${value}px`]),
);
