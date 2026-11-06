import type { StaticRule } from 'unocss';

import { defineConfig, presetWind4, transformerDirectives } from 'unocss';

import * as breakpoints from './src/theme/breakpoints';

// Vuetify 4 stores theme colors as raw RGB channels, e.g. --v-theme-primary: 59, 130, 246.
// Wrapping them in rgb() exposes them as regular Tailwind-style utilities (bg-primary, ...).
const themeColors = {
  background: 'rgb(var(--v-theme-background))',
  surface: 'rgb(var(--v-theme-surface))',
  'surface-variant': 'rgb(var(--v-theme-surface-variant))',
  primary: 'rgb(var(--v-theme-primary))',
  success: 'rgb(var(--v-theme-success))',
  warning: 'rgb(var(--v-theme-warning))',
  error: 'rgb(var(--v-theme-error))',
  info: 'rgb(var(--v-theme-info))',
} as const;

// Vuetify's MD3 elevation scale (0-5) → presetWind4's TailwindCSS shadow tokens.
// Only the token *names* are declared here; the values are read from the preset's own
// resolved `theme.shadow`, so overriding `theme.shadow` keeps `shadow-*` utilities,
// `elevation-*` rules and Vuetify's Sass elevation maps in sync automatically.
const ELEVATION_SHADOW_TOKENS = ['xs', 'sm', 'md', 'xl', '2xl'] as const;

type ShadowValue = string | string[];

function toCssValue(value: ShadowValue | undefined): string {
  if (value === undefined) {
    return 'initial';
  }

  return Array.isArray(value) ? value.join(', ') : value;
}

// `elevation-0` (flat) … `elevation-5`, aliasing the shadow tokens above.
const elevationShadows = [
  'none',
  ...ELEVATION_SHADOW_TOKENS.map((token) => `var(--shadow-${token})`),
];

// Vuetify's emphasis text utilities are disabled together with its other utilities
// (`$utilities: false` in src/styles/settings.scss), so they are re-created here with the
// same formula Vuetify 4 ships: the theme's `on-background` color at the per-theme opacity.
// Unlike Tailwind's `opacity-*`, color-mix() fades only the text color, not the children.
const EMPHASIS_OPACITY_VARS = {
  'high-emphasis': '--v-high-emphasis-opacity',
  'medium-emphasis': '--v-medium-emphasis-opacity',
  disabled: '--v-disabled-opacity',
} as const;

function emphasisColor(opacityVar: string): string {
  return `color-mix(in srgb, rgb(var(--v-theme-on-background)) calc(var(${opacityVar}) * 100%), transparent)`;
}

// Publishes those tokens as `--shadow-*` custom properties. Values are resolved at
// generation time, so the CSS stays in sync with whatever presetWind4 (or this config)
// puts in `theme.shadow` — nothing is hard-coded here except the token names.
const shadowPreflight = {
  getCSS: ({ theme }: { theme: object }): string => {
    const scale = (theme as { shadow?: Record<string, ShadowValue> }).shadow ?? {};
    const declarations = ELEVATION_SHADOW_TOKENS.map(
      (token) => `  --shadow-${token}: ${toCssValue(scale[token])};`,
    );

    return `:root {\n${declarations.join('\n')}\n}`;
  },
};

// Recreated Vuetify radius utilities for the default 8px root (sm 4 / base 8 / lg 16 /
// xl 48). Global runtime radius for components is handled by VDefaultsProvider in App.vue;
// explicit rounded-* utilities keep these fixed Vuetify scale values.
const RADIUS_ROOT = '8px';
const RADIUS_SM = '4px';
const RADIUS_LG = '16px';
const RADIUS_XL = '48px';

const roundedShortcuts = {
  'rounded-0': 'rounded-none',
  'rounded-sm': `rounded-[${RADIUS_SM}]`,
  rounded: `rounded-[${RADIUS_ROOT}]`,
  'rounded-lg': `rounded-[${RADIUS_LG}]`,
  'rounded-xl': `rounded-[${RADIUS_XL}]`,
  'rounded-pill': 'rounded-full',
  'rounded-circle': 'rounded-[50%]',
  'rounded-shaped': `rounded-[${RADIUS_XL}_0]`,

  // directional variants
  'rounded-t-0': 'rounded-t-none',
  'rounded-t-sm': `rounded-tl-[${RADIUS_SM}] rounded-tr-[${RADIUS_SM}]`,
  'rounded-t': `rounded-tl-[${RADIUS_ROOT}] rounded-tr-[${RADIUS_ROOT}]`,
  'rounded-t-lg': `rounded-tl-[${RADIUS_LG}] rounded-tr-[${RADIUS_LG}]`,
  'rounded-t-xl': `rounded-tl-[${RADIUS_XL}] rounded-tr-[${RADIUS_XL}]`,
  'rounded-t-pill': 'rounded-tl-full rounded-tr-full',

  'rounded-b-0': 'rounded-b-none',
  'rounded-b-sm': `rounded-bl-[${RADIUS_SM}] rounded-br-[${RADIUS_SM}]`,
  'rounded-b': `rounded-bl-[${RADIUS_ROOT}] rounded-br-[${RADIUS_ROOT}]`,
  'rounded-b-lg': `rounded-bl-[${RADIUS_LG}] rounded-br-[${RADIUS_LG}]`,
  'rounded-b-xl': `rounded-bl-[${RADIUS_XL}] rounded-br-[${RADIUS_XL}]`,
  'rounded-b-pill': 'rounded-bl-full rounded-br-full',

  'rounded-s-0': 'rounded-ss-none rounded-es-none',
  'rounded-s-sm': `rounded-ss-[${RADIUS_SM}] rounded-es-[${RADIUS_SM}]`,
  'rounded-s': `rounded-ss-[${RADIUS_ROOT}] rounded-es-[${RADIUS_ROOT}]`,
  'rounded-s-lg': `rounded-ss-[${RADIUS_LG}] rounded-es-[${RADIUS_LG}]`,
  'rounded-s-xl': `rounded-ss-[${RADIUS_XL}] rounded-es-[${RADIUS_XL}]`,
  'rounded-s-pill': 'rounded-ss-full rounded-es-full',

  'rounded-e-0': 'rounded-se-none rounded-ee-none',
  'rounded-e-sm': `rounded-se-[${RADIUS_SM}] rounded-ee-[${RADIUS_SM}]`,
  'rounded-e': `rounded-se-[${RADIUS_ROOT}] rounded-ee-[${RADIUS_ROOT}]`,
  'rounded-e-lg': `rounded-se-[${RADIUS_LG}] rounded-ee-[${RADIUS_LG}]`,
  'rounded-e-xl': `rounded-se-[${RADIUS_XL}] rounded-ee-[${RADIUS_XL}]`,
  'rounded-e-pill': 'rounded-se-full rounded-ee-full',
};

export default defineConfig({
  presets: [
    presetWind4({
      // Vuetify ships its own reset, keep only Vuetify's.
      preflights: {
        reset: false,
      },
      // Map Tailwind's dark:/light: variants onto Vuetify's theme classes.
      dark: {
        dark: '.v-theme--dark',
        light: '.v-theme--light',
      },
    }),
  ],
  transformers: [transformerDirectives()],
  preflights: [shadowPreflight],
  theme: {
    breakpoint: breakpoints.forUnoCSS,
    font: {
      heading: 'Roboto, sans-serif',
      body: 'Roboto, sans-serif',
      mono: '"Roboto Mono", sans-serif',
    },
    colors: themeColors,
  },
  rules: [
    ...elevationShadows.map(
      (shadow, level) => [`elevation-${level}`, { 'box-shadow': shadow }] satisfies StaticRule,
    ),
    ...Object.entries(EMPHASIS_OPACITY_VARS).map(
      ([name, opacityVar]) =>
        [`text-${name}`, { color: emphasisColor(opacityVar) }] satisfies StaticRule,
    ),
  ],
  shortcuts: {
    // MD3 typography (Vuetify's default typography scale)
    'text-display-large':
      '  font-heading normal-case text-[3.5625rem] font-[400] leading-[1.1228] tracking-[-.0044em]',
    'text-display-medium':
      ' font-heading normal-case text-[2.8125rem] font-[400] leading-[1.1556] tracking-[normal]',
    'text-display-small':
      '  font-heading normal-case text-[2.25rem]   font-[400] leading-[1.2222] tracking-[normal]',
    'text-headline-large':
      ' font-heading normal-case text-[2rem]      font-[400] leading-[1.25]   tracking-[normal]',
    'text-headline-medium':
      'font-heading normal-case text-[1.75rem]   font-[400] leading-[1.2857] tracking-[normal]',
    'text-headline-small':
      ' font-heading normal-case text-[1.5rem]    font-[400] leading-[1.3333] tracking-[normal]',
    'text-title-large':
      '    font-heading normal-case text-[1.375rem]  font-[400] leading-[1.2727] tracking-[normal]',
    'text-title-medium':
      '   font-body    normal-case text-[1rem]      font-[500] leading-[1.5]    tracking-[.0094em]',
    'text-title-small':
      '    font-body    normal-case text-[.875rem]   font-[500] leading-[1.4286] tracking-[.0071em]',
    'text-body-large':
      '     font-body    normal-case text-[1rem]      font-[400] leading-[1.5]    tracking-[.0313em]',
    'text-body-medium':
      '    font-body    normal-case text-[.875rem]   font-[400] leading-[1.4286] tracking-[.0179em]',
    'text-body-small':
      '     font-body    normal-case text-[.75rem]    font-[400] leading-[1.3333] tracking-[.0333em]',
    'text-label-large':
      '    font-body    normal-case text-[.875rem]   font-[500] leading-[1.4286] tracking-[.0071em]',
    'text-label-medium':
      '   font-body    normal-case text-[.75rem]    font-[500] leading-[1.3333] tracking-[.0417em]',
    'text-label-small':
      '    font-body    normal-case text-[.6875rem]  font-[500] leading-[1.4545] tracking-[.0455em]',
    ...roundedShortcuts,
  },
  safelist: [
    'font-heading',
    'font-body',
    'font-mono',
    ...Array.from({ length: 6 }, (_, i) => `elevation-${i}`),
    ...['', '-0', '-sm', '-lg', '-xl', '-pill', '-circle', '-shaped'].map(
      (suffix) => `rounded${suffix}`,
    ),
    ...Object.keys(themeColors).flatMap((color) => [`bg-${color}`, `text-${color}`]),
  ],
  outputToCssLayers: {
    cssLayerName: (layer) => (layer === 'properties' ? null : `uno-${layer}`),
  },
});
