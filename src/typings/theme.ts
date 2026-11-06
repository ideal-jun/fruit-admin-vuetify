/** Theme modes exposed by the appearance settings (mirrors Vuetify's `defaultTheme`). */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Tab bar visual styles (the reference PageTab modes). */
export type TabMode = 'chrome' | 'button' | 'slider';

/** Route switch animations, each mapped to a Vuetify transition component. */
export type PageAnimateMode = 'fade' | 'fade-slide' | 'fade-bottom' | 'fade-scale';

/** Semantic colors configurable from the appearance drawer. */
export type ThemeColorKey = 'primary' | 'info' | 'success' | 'warning' | 'error';

/** The four secondary theme colors (primary is stored separately for legacy compatibility). */
export interface ThemeOtherColors {
  readonly info: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
}

/** Effective Vuetify theme colors, with info possibly following primary. */
export interface ThemeColors extends ThemeOtherColors {
  readonly primary: string;
}

/** Time formats offered for the content watermark. */
export type WatermarkTimeFormat =
  | 'YYYY-MM-DD HH:mm'
  | 'YYYY-MM-DD HH:mm:ss'
  | 'YYYY/MM/DD HH:mm'
  | 'YYYY/MM/DD HH:mm:ss'
  | 'HH:mm'
  | 'HH:mm:ss'
  | 'MM-DD HH:mm';

/** Global tab bar settings. */
export interface TabSettings {
  /** Whether the tab bar is rendered under the app bar. */
  readonly visible: boolean;
  /** Whether opened tabs are restored after a page reload. */
  readonly cache: boolean;
  /** Tab bar height in pixels (the VAppBar extension height). */
  readonly height: number;
  /** Visual style of the tabs. */
  readonly mode: TabMode;
  /** Whether a middle click closes a tab. */
  readonly closeTabByMiddleClick: boolean;
}

/** Routed-view switch settings. */
export interface PageSettings {
  /** Whether route switches animate. */
  readonly animate: boolean;
  /** Animation used for route switches. */
  readonly animateMode: PageAnimateMode;
}

/** App-bar breadcrumb settings. */
export interface BreadcrumbSettings {
  readonly visible: boolean;
  readonly showIcon: boolean;
}

/** App-bar settings. */
export interface HeaderSettings {
  /** App bar content height in pixels. */
  readonly height: number;
  readonly breadcrumb: BreadcrumbSettings;
  /** Whether the global search trigger is visible. */
  readonly searchVisible: boolean;
  /** Whether the locale switcher is visible. */
  readonly localeVisible: boolean;
}

/** Sidebar settings. */
export interface SiderSettings {
  /** Expanded drawer width in pixels. */
  readonly width: number;
  /** Rail width in pixels when the sidebar is collapsed. */
  readonly collapsedWidth: number;
}

/** Content watermark settings. */
export interface WatermarkSettings {
  readonly visible: boolean;
  /** Text used when neither the user name nor the time is enabled. */
  readonly text: string;
  readonly enableUserName: boolean;
  readonly enableTime: boolean;
  readonly timeFormat: WatermarkTimeFormat;
}

/** Appearance settings persisted in localStorage. */
export interface AppearanceSettings {
  readonly mode: ThemeMode;
  readonly primary: string;
  readonly otherColors: ThemeOtherColors;
  /** Generate a recommended palette color from a user-picked color. */
  readonly recommendColor: boolean;
  /** Make the info color follow primary. */
  readonly isInfoFollowPrimary: boolean;
  /** Vuetify border radius root, in pixels. */
  readonly radius: number;
  readonly grayscale: boolean;
  readonly colourWeakness: boolean;
  readonly tab: TabSettings;
  readonly page: PageSettings;
  readonly header: HeaderSettings;
  readonly sider: SiderSettings;
  readonly watermark: WatermarkSettings;
}

/** Deep-partial settings patch used by theme presets. */
export interface ThemeSettingsPatch {
  readonly mode?: ThemeMode;
  readonly primary?: string;
  readonly otherColors?: Partial<ThemeOtherColors>;
  readonly recommendColor?: boolean;
  readonly isInfoFollowPrimary?: boolean;
  readonly radius?: number;
  readonly grayscale?: boolean;
  readonly colourWeakness?: boolean;
  readonly tab?: Partial<TabSettings>;
  readonly page?: Partial<PageSettings>;
  readonly header?: {
    readonly height?: number;
    readonly searchVisible?: boolean;
    readonly localeVisible?: boolean;
    readonly breadcrumb?: Partial<BreadcrumbSettings>;
  };
  readonly sider?: Partial<SiderSettings>;
  readonly watermark?: Partial<WatermarkSettings>;
}

/** One theme preset rendered by the appearance drawer. */
export interface ThemePresetDefinition {
  readonly id: string;
  /** i18n key of the preset name. */
  readonly nameKey: string;
  /** i18n key of the preset description. */
  readonly descriptionKey: string;
  /** Preset version shown as a chip. */
  readonly version: string;
  readonly settings: ThemeSettingsPatch;
}
