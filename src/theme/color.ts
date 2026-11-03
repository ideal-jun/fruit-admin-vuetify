/**
 * Small color helpers used by the page-tab styles.
 *
 * Ported from the reference template's color utilities: the tab CSS variables need
 * the active color as an alpha rgba value and mixed over white/black for the
 * chrome-tab backgrounds.
 */

/** RGB channels of a parsed color. */
interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const HEX_SHORT = /^#([\da-f])([\da-f])([\da-f])$/iu;
const HEX_LONG = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/iu;
const RGB_FUNC = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/iu;

function clamp(value: number, min = 0, max = 255): number {
  return Math.min(Math.max(value, min), max);
}

/** Parse a hex or rgb() color into its channels; invalid input falls back to black. */
export function getRgb(color: string): RgbColor {
  const value = color.trim();

  const short = value.match(HEX_SHORT);

  if (short) {
    const [, r = '0', g = '0', b = '0'] = short;

    return {
      r: Number.parseInt(r + r, 16),
      g: Number.parseInt(g + g, 16),
      b: Number.parseInt(b + b, 16),
    };
  }

  const long = value.match(HEX_LONG);

  if (long) {
    const [, r = '0', g = '0', b = '0'] = long;

    return {
      r: Number.parseInt(r, 16),
      g: Number.parseInt(g, 16),
      b: Number.parseInt(b, 16),
    };
  }

  const rgb = value.match(RGB_FUNC);

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
export function getHex({ r, g, b }: RgbColor): string {
  return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
}

/** Add an alpha channel to a color, e.g. `#1867c0` -> `rgba(24, 103, 192, 0.1)`. */
export function addColorAlpha(color: string, alpha: number): string {
  const { r, g, b } = getRgb(color);

  return `rgba(${r}, ${g}, ${b}, ${Math.min(Math.max(alpha, 0), 1)})`;
}

/** Mix a translucent color over a background and return the equivalent opaque hex color. */
export function transformColorWithOpacity(
  color: string,
  alpha: number,
  backgroundColor = '#ffffff',
): string {
  const foreground = getRgb(color);
  const background = getRgb(backgroundColor);
  const ratio = Math.min(Math.max(alpha, 0), 1);

  return getHex({
    r: background.r + (foreground.r - background.r) * ratio,
    g: background.g + (foreground.g - background.g) * ratio,
    b: background.b + (foreground.b - background.b) * ratio,
  });
}
