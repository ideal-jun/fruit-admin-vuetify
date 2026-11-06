import type {
  AppearanceSettings,
  BreadcrumbSettings,
  HeaderSettings,
  PageAnimateMode,
  PageSettings,
  SiderSettings,
  TabMode,
  TabSettings,
  ThemeMode,
  WatermarkSettings,
  WatermarkTimeFormat,
} from '@/typings/theme';

/** localStorage key for the persisted appearance settings. */
export const APPEARANCE_STORAGE_KEY = 'fruit-admin.appearance';

/** Vuetify's own default: follow the OS colour scheme until the user picks one. */
export const DEFAULT_THEME_MODE: ThemeMode = 'system';

/** Default tab bar style: the reference template's chrome-like page tabs. */
export const DEFAULT_TAB_MODE: TabMode = 'chrome';

/** Default route switch animation: the reference template's fade-slide. */
export const DEFAULT_PAGE_ANIMATE_MODE: PageAnimateMode = 'fade-slide';

/** Vuetify's default light primary, applied to both themes so the app has one brand color. */
export const DEFAULT_PRIMARY_COLOR = '#646CFF';

/** Default border radius root, in pixels. */
export const DEFAULT_RADIUS = 8;

/** Height of the global tab bar (the reference tab height, matching the comfortable toolbar). */
export const DEFAULT_TAB_HEIGHT = 40;

/** Rendered app bar content height (the comfortable toolbar trims the raw prop by 8px). */
export const DEFAULT_HEADER_HEIGHT = 56;

/** Expanded sidebar width (matches the current drawer). */
export const DEFAULT_SIDER_WIDTH = 264;

/** Rail width when the sidebar is collapsed. */
export const DEFAULT_SIDER_COLLAPSED_WIDTH = 56;

/** Fallback watermark text (a user-editable setting, not a UI label). */
export const DEFAULT_WATERMARK_TEXT = 'Fruit Admin';

/** Preset primary colors offered by the appearance drawer. */
export const PRIMARY_COLOR_SWATCHES: readonly string[] = [
  '#646CFF',
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

/** Theme modes supported by the app (Vuetify itself accepts any theme name). */
export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

/** Tab bar styles supported by the app. */
export const TAB_MODES: readonly TabMode[] = ['chrome', 'button', 'slider'];

/** Route switch animations supported by the app (each maps to a Vuetify transition). */
export const PAGE_ANIMATE_MODES: readonly PageAnimateMode[] = [
  'fade',
  'fade-slide',
  'fade-bottom',
  'fade-scale',
];

/** Time formats offered for the content watermark. */
export const WATERMARK_TIME_FORMATS: readonly WatermarkTimeFormat[] = [
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY/MM/DD HH:mm',
  'YYYY/MM/DD HH:mm:ss',
  'HH:mm',
  'HH:mm:ss',
  'MM-DD HH:mm',
];

/** Default tab bar settings. */
export const DEFAULT_TAB_SETTINGS: TabSettings = {
  visible: true,
  cache: true,
  height: DEFAULT_TAB_HEIGHT,
  mode: DEFAULT_TAB_MODE,
  closeTabByMiddleClick: true,
};

/** Default routed-view switch settings. */
export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  animate: true,
  animateMode: DEFAULT_PAGE_ANIMATE_MODE,
};

/** Default app-bar settings. */
export const DEFAULT_HEADER_SETTINGS: HeaderSettings = {
  height: DEFAULT_HEADER_HEIGHT,
  breadcrumb: { visible: true, showIcon: true },
  searchVisible: true,
  localeVisible: true,
};

/** Default sidebar settings. */
export const DEFAULT_SIDER_SETTINGS: SiderSettings = {
  width: DEFAULT_SIDER_WIDTH,
  collapsedWidth: DEFAULT_SIDER_COLLAPSED_WIDTH,
};

/** Default watermark settings. */
export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  visible: false,
  text: DEFAULT_WATERMARK_TEXT,
  enableUserName: false,
  enableTime: false,
  timeFormat: 'YYYY-MM-DD HH:mm',
};

/** Default appearance settings. */
export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettings = {
  mode: DEFAULT_THEME_MODE,
  primary: DEFAULT_PRIMARY_COLOR,
  radius: DEFAULT_RADIUS,
  grayscale: false,
  colourWeakness: false,
  tab: DEFAULT_TAB_SETTINGS,
  page: DEFAULT_PAGE_SETTINGS,
  header: DEFAULT_HEADER_SETTINGS,
  sider: DEFAULT_SIDER_SETTINGS,
  watermark: DEFAULT_WATERMARK_SETTINGS,
};

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

const THEME_MODE_SET: ReadonlySet<string> = new Set<string>(THEME_MODES);

const TAB_MODE_SET: ReadonlySet<string> = new Set<string>(TAB_MODES);

const PAGE_ANIMATE_MODE_SET: ReadonlySet<string> = new Set<string>(PAGE_ANIMATE_MODES);

const WATERMARK_TIME_FORMAT_SET: ReadonlySet<string> = new Set<string>(WATERMARK_TIME_FORMATS);

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && THEME_MODE_SET.has(value);
}

export function isTabMode(value: unknown): value is TabMode {
  return typeof value === 'string' && TAB_MODE_SET.has(value);
}

export function isPageAnimateMode(value: unknown): value is PageAnimateMode {
  return typeof value === 'string' && PAGE_ANIMATE_MODE_SET.has(value);
}

export function isWatermarkTimeFormat(value: unknown): value is WatermarkTimeFormat {
  return typeof value === 'string' && WATERMARK_TIME_FORMAT_SET.has(value);
}

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_PATTERN.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function readNumber(value: unknown, fallback: number, min: number, max: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(Math.max(Math.round(value), min), max)
    : fallback;
}

function readText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

function readTabSettings(value: unknown, legacyTabMode: unknown): TabSettings {
  const raw = isRecord(value) ? value : {};
  let mode: TabMode = DEFAULT_TAB_MODE;

  // The flat `tabMode` key is the pre-port format; the nested key wins when both exist.
  if (isTabMode(legacyTabMode)) {
    mode = legacyTabMode;
  }

  if (isTabMode(raw.mode)) {
    mode = raw.mode;
  }

  return {
    visible: readBoolean(raw.visible, DEFAULT_TAB_SETTINGS.visible),
    cache: readBoolean(raw.cache, DEFAULT_TAB_SETTINGS.cache),
    height: readNumber(raw.height, DEFAULT_TAB_SETTINGS.height, 36, 96),
    mode,
    closeTabByMiddleClick: readBoolean(
      raw.closeTabByMiddleClick,
      DEFAULT_TAB_SETTINGS.closeTabByMiddleClick,
    ),
  };
}

function readPageSettings(value: unknown): PageSettings {
  const raw = isRecord(value) ? value : {};

  return {
    animate: readBoolean(raw.animate, DEFAULT_PAGE_SETTINGS.animate),
    animateMode: isPageAnimateMode(raw.animateMode)
      ? raw.animateMode
      : DEFAULT_PAGE_SETTINGS.animateMode,
  };
}

function readBreadcrumbSettings(value: unknown): BreadcrumbSettings {
  const raw = isRecord(value) ? value : {};

  return {
    visible: readBoolean(raw.visible, DEFAULT_HEADER_SETTINGS.breadcrumb.visible),
    showIcon: readBoolean(raw.showIcon, DEFAULT_HEADER_SETTINGS.breadcrumb.showIcon),
  };
}

function readHeaderSettings(value: unknown): HeaderSettings {
  const raw = isRecord(value) ? value : {};

  return {
    height: readNumber(raw.height, DEFAULT_HEADER_SETTINGS.height, 40, 120),
    breadcrumb: readBreadcrumbSettings(raw.breadcrumb),
    searchVisible: readBoolean(raw.searchVisible, DEFAULT_HEADER_SETTINGS.searchVisible),
    localeVisible: readBoolean(raw.localeVisible, DEFAULT_HEADER_SETTINGS.localeVisible),
  };
}

function readSiderSettings(value: unknown): SiderSettings {
  const raw = isRecord(value) ? value : {};

  return {
    width: readNumber(raw.width, DEFAULT_SIDER_SETTINGS.width, 200, 400),
    collapsedWidth: readNumber(raw.collapsedWidth, DEFAULT_SIDER_SETTINGS.collapsedWidth, 40, 120),
  };
}

function readWatermarkSettings(value: unknown): WatermarkSettings {
  const raw = isRecord(value) ? value : {};

  return {
    visible: readBoolean(raw.visible, DEFAULT_WATERMARK_SETTINGS.visible),
    text: readText(raw.text, DEFAULT_WATERMARK_SETTINGS.text),
    enableUserName: readBoolean(raw.enableUserName, false),
    enableTime: readBoolean(raw.enableTime, false),
    timeFormat: isWatermarkTimeFormat(raw.timeFormat)
      ? raw.timeFormat
      : DEFAULT_WATERMARK_SETTINGS.timeFormat,
  };
}

/** Read the persisted appearance settings, falling back to the defaults per field. */
export function readAppearanceSettings(): AppearanceSettings {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_APPEARANCE_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(APPEARANCE_STORAGE_KEY);

    if (raw === null) {
      return DEFAULT_APPEARANCE_SETTINGS;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed)) {
      return DEFAULT_APPEARANCE_SETTINGS;
    }

    return {
      mode: isThemeMode(parsed.mode) ? parsed.mode : DEFAULT_THEME_MODE,
      primary: isHexColor(parsed.primary) ? parsed.primary : DEFAULT_PRIMARY_COLOR,
      radius: readNumber(parsed.radius, DEFAULT_RADIUS, 0, 24),
      grayscale: readBoolean(parsed.grayscale, false),
      colourWeakness: readBoolean(parsed.colourWeakness, false),
      // The flat `tabMode` key is the pre-port format; keep reading it for older sessions.
      tab: readTabSettings(parsed.tab, parsed.tabMode),
      page: readPageSettings(parsed.page),
      header: readHeaderSettings(parsed.header),
      sider: readSiderSettings(parsed.sider),
      watermark: readWatermarkSettings(parsed.watermark),
    };
  } catch {
    return DEFAULT_APPEARANCE_SETTINGS;
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
