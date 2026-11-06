import type {
  AppearanceSettings,
  BreadcrumbSettings,
  HeaderSettings,
  PageSettings,
  TabMode,
  TabSettings,
  ThemeColorKey,
  ThemeColors,
  ThemeMode,
  ThemeSettingsPatch,
  WatermarkSettings,
} from '@/typings/theme';

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

import {
  DEFAULT_APPEARANCE_SETTINGS,
  DEFAULT_THEME_MODE,
  readAppearanceSettings,
  THEME_MODES,
  writeAppearanceSettings,
} from '@/theme/appearance';
import { getPaletteColorByNumber } from '@/utils/color';

/** Partial header settings, with the nested breadcrumb patchable on its own. */
type HeaderSettingsPatch = Partial<Omit<HeaderSettings, 'breadcrumb'>> & {
  readonly breadcrumb?: Partial<BreadcrumbSettings>;
};

/** Deep-merge a settings patch into a base settings object. */
function mergeSettings(base: AppearanceSettings, patch: ThemeSettingsPatch): AppearanceSettings {
  return {
    mode: patch.mode ?? base.mode,
    primary: patch.primary ?? base.primary,
    otherColors: { ...base.otherColors, ...patch.otherColors },
    recommendColor: patch.recommendColor ?? base.recommendColor,
    isInfoFollowPrimary: patch.isInfoFollowPrimary ?? base.isInfoFollowPrimary,
    radius: patch.radius ?? base.radius,
    grayscale: patch.grayscale ?? base.grayscale,
    colourWeakness: patch.colourWeakness ?? base.colourWeakness,
    tab: { ...base.tab, ...patch.tab },
    page: { ...base.page, ...patch.page },
    header: {
      ...base.header,
      ...patch.header,
      breadcrumb: { ...base.header.breadcrumb, ...patch.header?.breadcrumb },
    },
    sider: { ...base.sider, ...patch.sider },
    watermark: { ...base.watermark, ...patch.watermark },
  };
}

/**
 * Appearance settings: theme mode, primary color, radius, auxiliary color modes and
 * the shell settings (tab bar, header, sidebar, watermark).
 *
 * The Vuetify theme instance stays the single renderer: mutating it here updates
 * every component (and the UnoCSS `bg-primary` utilities) at once. Settings are
 * persisted in localStorage and applied when the store is created in App.vue, i.e.
 * before the shell renders. Each action applies its change explicitly, so the store
 * has no implicit side effects.
 */
export const useThemeStore = defineStore('theme', () => {
  const theme = useTheme();

  const settings = ref<AppearanceSettings>(readAppearanceSettings());

  const mode = computed(() => settings.value.mode);
  const primary = computed(() => settings.value.primary);
  const otherColors = computed(() => settings.value.otherColors);
  const recommendColor = computed(() => settings.value.recommendColor);
  const isInfoFollowPrimary = computed(() => settings.value.isInfoFollowPrimary);
  /** Effective Vuetify colors; info follows primary when that setting is enabled. */
  const themeColors = computed<ThemeColors>(() => ({
    primary: settings.value.primary,
    ...settings.value.otherColors,
    info: settings.value.isInfoFollowPrimary
      ? settings.value.primary
      : settings.value.otherColors.info,
  }));
  const radius = computed(() => settings.value.radius);
  const grayscale = computed(() => settings.value.grayscale);
  const colourWeakness = computed(() => settings.value.colourWeakness);
  const tab = computed(() => settings.value.tab);
  const tabMode = computed(() => settings.value.tab.mode);
  const page = computed(() => settings.value.page);
  const header = computed(() => settings.value.header);
  const sider = computed(() => settings.value.sider);
  const watermark = computed(() => settings.value.watermark);

  /** Pretty JSON of the current settings, used by the "copy config" action. */
  const settingsJson = computed(() => JSON.stringify(settings.value, null, 2));

  function applyMode() {
    void theme.change(settings.value.mode);
  }

  function applyColors() {
    for (const definition of Object.values(theme.themes.value)) {
      Object.assign(definition.colors, themeColors.value);
    }
  }

  function applyAuxiliaryModes() {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.style.filter = [
      settings.value.grayscale ? 'grayscale(100%)' : '',
      settings.value.colourWeakness ? 'invert(80%)' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  function applyAll() {
    applyMode();
    applyColors();
    applyAuxiliaryModes();
  }

  function persist() {
    writeAppearanceSettings(settings.value);
  }

  /** Replace the settings, apply them to Vuetify and persist. */
  function update(next: AppearanceSettings) {
    settings.value = next;
    applyAll();
    persist();
  }

  function setMode(value: ThemeMode) {
    update({ ...settings.value, mode: value });
  }

  /** Apply the optional recommended-palette saturation before storing a color. */
  function resolveThemeColor(value: string): string {
    return settings.value.recommendColor ? getPaletteColorByNumber(value, 500, true) : value;
  }

  function updateThemeColor(key: ThemeColorKey, value: string) {
    const color = resolveThemeColor(value);

    if (key === 'primary') {
      update({ ...settings.value, primary: color });
    } else {
      update({
        ...settings.value,
        otherColors: { ...settings.value.otherColors, [key]: color },
      });
    }
  }

  function setPrimary(value: string) {
    updateThemeColor('primary', value);
  }

  function setRecommendColor(value: boolean) {
    update({ ...settings.value, recommendColor: value });
  }

  function setInfoFollowPrimary(value: boolean) {
    update({ ...settings.value, isInfoFollowPrimary: value });
  }

  function setRadius(value: number) {
    update({ ...settings.value, radius: value });
  }

  function setGrayscale(value: boolean) {
    update({ ...settings.value, grayscale: value });
  }

  function setColourWeakness(value: boolean) {
    update({ ...settings.value, colourWeakness: value });
  }

  function setTabMode(value: TabMode) {
    update({ ...settings.value, tab: { ...settings.value.tab, mode: value } });
  }

  function updateTabSettings(patch: Partial<TabSettings>) {
    update({ ...settings.value, tab: { ...settings.value.tab, ...patch } });
  }

  function updatePageSettings(patch: Partial<PageSettings>) {
    update({ ...settings.value, page: { ...settings.value.page, ...patch } });
  }

  function updateHeaderSettings(patch: HeaderSettingsPatch) {
    update({
      ...settings.value,
      header: {
        ...settings.value.header,
        ...patch,
        breadcrumb: {
          visible: patch.breadcrumb?.visible ?? settings.value.header.breadcrumb.visible,
          showIcon: patch.breadcrumb?.showIcon ?? settings.value.header.breadcrumb.showIcon,
        },
      },
    });
  }

  function updateBreadcrumbSettings(patch: Partial<BreadcrumbSettings>) {
    updateHeaderSettings({ breadcrumb: patch });
  }

  function updateSiderSettings(patch: Partial<AppearanceSettings['sider']>) {
    update({ ...settings.value, sider: { ...settings.value.sider, ...patch } });
  }

  function updateWatermarkSettings(patch: Partial<WatermarkSettings>) {
    update({ ...settings.value, watermark: { ...settings.value.watermark, ...patch } });
  }

  /** Apply a partial settings patch (theme presets). */
  function applySettings(patch: ThemeSettingsPatch) {
    update(mergeSettings(settings.value, patch));
  }

  /** Cycle light → dark → system (used by the app-bar theme toggle). */
  function cycleMode() {
    const index = THEME_MODES.indexOf(settings.value.mode);
    setMode(THEME_MODES[(index + 1) % THEME_MODES.length] ?? DEFAULT_THEME_MODE);
  }

  /** Back to the defaults. */
  function reset() {
    update(mergeSettings(DEFAULT_APPEARANCE_SETTINGS, {}));
  }

  // Apply the persisted settings when the store is created (App.vue, before render).
  applyAll();

  return {
    settings,
    settingsJson,
    mode,
    primary,
    otherColors,
    recommendColor,
    isInfoFollowPrimary,
    themeColors,
    radius,
    grayscale,
    colourWeakness,
    tab,
    tabMode,
    page,
    header,
    sider,
    watermark,
    setMode,
    setPrimary,
    setRecommendColor,
    setInfoFollowPrimary,
    updateThemeColor,
    setRadius,
    setGrayscale,
    setColourWeakness,
    setTabMode,
    updateTabSettings,
    updatePageSettings,
    updateHeaderSettings,
    updateBreadcrumbSettings,
    updateSiderSettings,
    updateWatermarkSettings,
    applySettings,
    cycleMode,
    reset,
  };
});
