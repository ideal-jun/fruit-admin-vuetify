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

const roundedShortcuts = {
  'rounded-0': 'rounded-none',
  'rounded-sm': 'rounded-[2px]',
  rounded: 'rounded-[4px]',
  'rounded-lg': 'rounded-[8px]',
  'rounded-xl': 'rounded-[24px]',
  'rounded-pill': 'rounded-full',
  'rounded-circle': 'rounded-[50%]',
  'rounded-shaped': 'rounded-[24px_0]',

  // directional variants
  'rounded-t-0': 'rounded-t-none',
  'rounded-t-sm': 'rounded-tl-[2px] rounded-tr-[2px]',
  'rounded-t': 'rounded-tl-[4px] rounded-tr-[4px]',
  'rounded-t-lg': 'rounded-tl-[8px] rounded-tr-[8px]',
  'rounded-t-xl': 'rounded-tl-[24px] rounded-tr-[24px]',
  'rounded-t-pill': 'rounded-tl-full rounded-tr-full',

  'rounded-b-0': 'rounded-b-none',
  'rounded-b-sm': 'rounded-bl-[2px] rounded-br-[2px]',
  'rounded-b': 'rounded-bl-[4px] rounded-br-[4px]',
  'rounded-b-lg': 'rounded-bl-[8px] rounded-br-[8px]',
  'rounded-b-xl': 'rounded-bl-[24px] rounded-br-[24px]',
  'rounded-b-pill': 'rounded-bl-full rounded-br-full',

  'rounded-s-0': 'rounded-ss-none rounded-es-none',
  'rounded-s-sm': 'rounded-ss-[2px] rounded-es-[2px]',
  'rounded-s': 'rounded-ss-[4px] rounded-es-[4px]',
  'rounded-s-lg': 'rounded-ss-[8px] rounded-es-[8px]',
  'rounded-s-xl': 'rounded-ss-[24px] rounded-es-[24px]',
  'rounded-s-pill': 'rounded-ss-full rounded-es-full',

  'rounded-e-0': 'rounded-se-none rounded-ee-none',
  'rounded-e-sm': 'rounded-se-[2px] rounded-ee-[2px]',
  'rounded-e': 'rounded-se-[4px] rounded-ee-[4px]',
  'rounded-e-lg': 'rounded-se-[8px] rounded-ee-[8px]',
  'rounded-e-xl': 'rounded-se-[24px] rounded-ee-[24px]',
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
  rules: elevationShadows.map(
    (shadow, level) => [`elevation-${level}`, { 'box-shadow': shadow }] satisfies StaticRule,
  ),
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
