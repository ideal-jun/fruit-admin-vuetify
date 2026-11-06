/** Tailwind-style palette stops generated from a base color. */
export type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

interface RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

interface HslColor {
  readonly h: number;
  readonly s: number;
  readonly l: number;
}

const HEX_SHORT = /^#([\da-f])([\da-f])([\da-f])$/iu;
const HEX_LONG = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/iu;
const RGB_FUNC = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/iu;

const PALETTE_NUMBERS: readonly ColorPaletteNumber[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

const PALETTE_LIGHTNESS_OFFSET: Record<ColorPaletteNumber, number> = {
  50: 42,
  100: 34,
  200: 25,
  300: 16,
  400: 8,
  500: 0,
  600: -9,
  700: -17,
  800: -25,
  900: -32,
  950: -38,
};

function clamp(value: number, min = 0, max = 255): number {
  return Math.min(Math.max(value, min), max);
}

/** Parse a hex or rgb color into rgb channels. */
function getRgb(color: string): RgbColor {
  const value = color.trim();
  const short = HEX_SHORT.exec(value);

  if (short) {
    const [, r = '0', g = '0', b = '0'] = short;

    return {
      r: Number.parseInt(r + r, 16),
      g: Number.parseInt(g + g, 16),
      b: Number.parseInt(b + b, 16),
    };
  }

  const long = HEX_LONG.exec(value);

  if (long) {
    const [, r = '0', g = '0', b = '0'] = long;

    return {
      r: Number.parseInt(r, 16),
      g: Number.parseInt(g, 16),
      b: Number.parseInt(b, 16),
    };
  }

  const rgb = RGB_FUNC.exec(value);

  if (rgb) {
    const [, r = '0', g = '0', b = '0'] = rgb;

    return {
      r: clamp(Number(r)),
      g: clamp(Number(g)),
      b: clamp(Number(b)),
    };
  }

  return { r: 0, g: 0, b: 0 };
}

/** Convert rgb channels to a lowercase hex color. */
function getHex({ r, g, b }: RgbColor): string {
  return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;

  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
  }

  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s, l };
}

function hslToHex({ h, s, l }: HslColor): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r: number;
  let g: number;
  let b: number;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return getHex({
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  });
}

/** Generate the 50–950 palette around a base color (500). */
function getColorPalette(color: string, recommended = false): Map<ColorPaletteNumber, string> {
  const rgb = getRgb(color);
  const hsl = rgbToHsl(rgb);
  const saturation = recommended ? Math.min(hsl.s * 1.08, 1) : hsl.s;
  const palette = new Map<ColorPaletteNumber, string>();

  for (const number of PALETTE_NUMBERS) {
    const offset = PALETTE_LIGHTNESS_OFFSET[number];
    const lightnessFactor = 1 - Math.max(offset, 0) / 220;
    const lightness = Math.min(Math.max(hsl.l + offset / 100, 0.04), 0.98);

    palette.set(
      number,
      hslToHex({
        h: hsl.h,
        s: saturation * lightnessFactor,
        l: lightness,
      }),
    );
  }

  palette.set(500, getHex(rgb));

  return palette;
}

/** Pick a palette stop from a color, optionally applying the recommended saturation. */
export function getPaletteColorByNumber(
  color: string,
  number: ColorPaletteNumber = 500,
  recommended = false,
): string {
  return getColorPalette(color, recommended).get(number) ?? color;
}
