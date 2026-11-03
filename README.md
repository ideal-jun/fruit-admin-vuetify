# fruit-admin-veutify

Vue 3 + Vite admin scaffold with Vuetify 4, UnoCSS (`presetWind4`) and the Oxc toolchain.

## ❗️ Documentation

- Primary docs: https://vuetifyjs.com/
- Getting started guide: https://vuetifyjs.com/en/getting-started/installation/
- CSS utilities landing page: https://vuetifyjs.com/features/css-utilities/
- UnoCSS integration: https://vuetifyjs.com/en/features/css-utilities/unocss-tailwind-preset/
- Vuetify i18n: https://vuetifyjs.com/en/features/internationalization/
- vue-i18n: https://vue-i18n.intlify.dev/
- Oxc (oxlint / oxfmt): https://oxc.rs/docs/guide/usage/linter.html
- Community support: https://community.vuetifyjs.com/
- Issue tracker: https://issues.vuetifyjs.com/

## 🧱 Stack

- Framework: Vue 3 + Vite 8
- UI Library: Vuetify 4 (autoImport + custom Sass settings)
- Language: TypeScript
- Styling: UnoCSS + `@unocss/preset-wind4` (TailwindCSS v4 semantics), replaces Vuetify's utility CSS
- Linting / formatting: `oxlint` + `oxfmt` (Oxc), ESLint for Vue template rules only
- i18n: vue-i18n 11 wired into Vuetify through its locale adapter (default **中文**, English kept)
- State / routing: Pinia, Vue Router
- Package manager: pnpm

## 🚀 Quick Start

```bash
pnpm install
pnpm dev
```

Build and preview:

```bash
pnpm build
pnpm preview
```

## 🧪 Available Scripts

| Command                     | Description                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| `pnpm dev`                  | Vite dev server on port 3000                                           |
| `pnpm build`                | `type-check` + production build (running in parallel)                  |
| `pnpm build-only`           | Production build only                                                  |
| `pnpm preview`              | Preview the production build                                           |
| `pnpm type-check`           | `vue-tsc --build --force` (SFC templates included)                     |
| `pnpm type-coverage`        | `type-coverage` gate for the `.ts` sources (fails below 99 %)          |
| `pnpm type-coverage:detail` | Per-identifier type-coverage report                                    |
| `pnpm lint`                 | `oxlint` and `eslint` in parallel                                      |
| `pnpm lint:oxlint`          | Oxc linter only (fast, runs on `.ts` files and the `<script>` of SFCs) |
| `pnpm lint:eslint`          | ESLint only (Vue template rules)                                       |
| `pnpm lint:fix`             | `oxlint --fix`, then `eslint --fix`                                    |
| `pnpm fmt`                  | Format the repository with `oxfmt`                                     |
| `pnpm fmt:check`            | Verify formatting without writing                                      |
| `pnpm fix`                  | `lint:fix` + `fmt` (use this instead of hand-fixing style)             |
| `pnpm check`                | `type-check` + `type-coverage` + `lint` + `fmt:check` — the CI gate    |

## 🧩 TypeScript

Type safety is enforced in CI (`pnpm check`) and kept at **100 % type coverage** on the
`.ts` side, with every SFC template type-checked by `vue-tsc`.

### Compiler settings (`tsconfig.app.json`)

`@vue/tsconfig` already enables `strict`; on top of that this project turns on:

| Option                                  | Why                                                                |
| --------------------------------------- | ------------------------------------------------------------------ |
| `noUncheckedIndexedAccess`              | `arr[i]` / `record[key]` are `T \| undefined` — no unsafe indexing |
| `noImplicitOverride`                    | overrides must be explicit                                         |
| `noUnusedLocals` / `noUnusedParameters` | dead variables fail the build                                      |
| `noFallthroughCasesInSwitch`            | no accidental switch fallthrough                                   |

Templates participate as well: `vue-tsc` reports expression errors inside `<template>`
(e.g. calling a method that does not exist on the inferred type).

### Type files live in `src/typings`

```text
src/typings/
├─ env.d.ts         # vite/client reference + ImportMetaEnv extension point
├─ i18n.ts          # AppLocale, LocaleOption, AppMessages (shared app types)
├─ vue-i18n.d.ts    # DefineLocaleMessage augmentation (typed i18n.global.t + locale parity)
└─ vuetify.d.ts     # type-only override of useLocale().t (tsconfig paths, runtime untouched)
```

Rules of thumb:

- Ambient declarations (`*.d.ts`) and shared domain types go here — nowhere else.
- **No `any`**: `typescript/no-explicit-any` is an oxlint **error**. Use `unknown` plus a
  type guard (`isAppLocale` is the reference example) and narrow from there.
- Prefer `satisfies` over `as`; the only remaining cast is the UnoCSS preflight theme
  bridge in `uno.config.ts`, because the resolved theme has no public type.
- Both locale files are typed with `AppMessages`, so adding a key to one language but not
  the other is a compile error.
- `DefineLocaleMessage` is augmented for vue-i18n, giving `i18n.global.t` key autocomplete
  and `JsonPaths` typing. (vue-i18n still accepts arbitrary strings at runtime on purpose, to
  support dynamic keys.)
- `src/typings/vuetify.d.ts` + the `vuetify` alias in `tsconfig.app.json` re-type Vuetify's
  `useLocale().t` with the same message keys. It is **type-only** — Vite does not read
  `tsconfig` `paths`, so the runtime import still resolves the real package.

### Type coverage

```bash
pnpm type-coverage          # gate: ≥ 99 % (currently 100 %)
pnpm type-coverage:detail   # per-identifier report
```

`type-coverage` analyses the `.ts` sources (`tsconfig.app.json`; `.vue` is excluded because
the tool cannot parse SFCs) — the templates are covered by `vue-tsc` strict mode instead.

## 🎨 UnoCSS Integration

Vuetify's own utility classes are disabled and re-created on demand by UnoCSS.

### CSS cascade layers

`public/layers.css` declares the cascade order and is linked (not imported) from
`index.html`, so it always wins the ordering race:

```css
@layer uno-base;
@layer uno-preflights;
@layer uno-theme;

@layer vuetify-core;
@layer vuetify-components;
@layer vuetify-overrides;
@layer vuetify-utilities;

@layer uno-shortcuts;
@layer uno-default;

@layer vuetify-final;
```

`uno.config.ts` maps every UnoCSS layer to `uno-<layer>` (`outputToCssLayers`), keeping
UnoCSS utilities above Vuetify's components but below `vuetify-final` (transitions).

### presetWind4 configuration

- `preflights.reset: false` — Vuetify ships its own reset, UnoCSS must not compete with it.
- `dark: { dark: '.v-theme--dark', light: '.v-theme--light' }` — rewrites Tailwind's
  `dark:` / `light:` variants to Vuetify's theme classes, so `dark:bg-black` compiles to
  `.v-theme--dark .dark\\:bg-black` and follows `$vuetify.theme.change()`.
- Breakpoints are shared with Vuetify through `src/theme/breakpoints.ts`
  (`theme.breakpoint`) and kept in sync with `settings.scss`'s `$grid-breakpoints`.
- Typography: `font-heading` / `font-body` / `font-mono` utilities plus
  `theme.font`, and `settings.scss` points Vuetify at the same
  `var(--font-*)` custom properties.
- Shadows: presetWind4's `theme.shadow` (TailwindCSS scale) is published as
  `--shadow-*` custom properties and reused by Vuetify's elevation — nothing is
  hard-coded, see [Elevation and shadows](#elevation-and-shadows).

### Vuetify theme colors as UnoCSS utilities

`--v-theme-*` holds raw RGB channels, so `theme.colors` wraps them in `rgb()`:
`background`, `surface`, `surface-variant`, `primary`, `success`, `warning`, `error`, `info`.
That enables `bg-primary`, `text-error`, `border-surface`, … . Note that the `on-*`
foreground safety net of Vuetify's `bg-*` classes is gone — pick readable text colors.
Because the utilities read the CSS variables, changing the primary color at runtime
(see [Appearance settings](#appearance-theme-settings)) updates them instantly.

### Vuetify-only class names

Re-implemented as UnoCSS shortcuts / rules so they keep working (and gain responsive
prefixes such as `md:rounded-xl`):

- `rounded-0 | -sm | (base) | -lg | -xl | -pill | -circle | -shaped` and the
  `-t- / -b- / -s- / -e-` directional variants, matching Vuetify's radius scale
  (2 / 4 / 8 / 24 px).
- `elevation-0 … elevation-5`, mapped onto the TailwindCSS shadow scale —
  see [Elevation and shadows](#elevation-and-shadows).
- `text-display-large … text-label-small` MD3 typography shortcuts.
- `text-high-emphasis | text-medium-emphasis | text-disabled`, re-created as rules with
  Vuetify 4's own formula — `color-mix(in srgb, rgb(var(--v-theme-on-background))
  calc(var(--v-medium-emphasis-opacity) * 100%), transparent)`. Use them instead of
  `opacity-*` for secondary text: only the color fades, not the children.
- Prop-driven classes (`elevation`, `rounded`) are safelisted since they never appear
  literally in source files; the theme color utilities are safelisted too.
- `justify-*` / `align-*` used by `<VRow>` / `<VCol>` props are restored in
  `src/styles/vuetify-compat.scss` (they disappear with `$utilities: false`).

`@apply` works inside `<style>` thanks to `@unocss/transformer-directives` — see
[`src/views/index.vue`](src/views/index.vue) and [`HomeFeatureCard.vue`](src/components/home/HomeFeatureCard.vue).

```vue
<template>
  <VContainer class="h-full flex items-center">
    <VCard class="rounded-3xl md:rounded-xl elevation-2 dark:bg-surface" />
  </VContainer>
</template>
```

### Elevation and shadows

Vuetify's MD3 elevation levels (0-5) are aligned with the TailwindCSS shadow scale, so
`elevation-*` classes, `shadow-*` utilities and Vuetify's own component shadows all
resolve to the same tokens:

| Vuetify class | UnoCSS token        |
| ------------- | ------------------- |
| `elevation-0` | `none`              |
| `elevation-1` | `var(--shadow-xs)`  |
| `elevation-2` | `var(--shadow-sm)`  |
| `elevation-3` | `var(--shadow-md)`  |
| `elevation-4` | `var(--shadow-xl)`  |
| `elevation-5` | `var(--shadow-2xl)` |

How it is wired:

1. The values come from **presetWind4's own `theme.shadow`** — no shadow value is
   hard-coded. `uno.config.ts` only declares which token each elevation level uses
   (`xs, sm, md, xl, 2xl`) plus a preflight that publishes those tokens as `--shadow-*`
   on `:root` (layer `uno-preflights`), reading the _resolved_ theme at generation time.
   Overriding `theme.shadow` therefore updates utilities, elevation rules and Vuetify's
   Sass together.
2. `elevation-*` rules are just `box-shadow: var(--shadow-*)`.
3. `src/styles/settings.scss` overrides Vuetify's `$shadow-key` / `$shadow-ambient`
   Sass maps with the same variables (the MD3 ambient layer is neutralised with
   `0 0 #0000`), so components built with `@include tools.elevation($z)` — `VCard`,
   `VAvatar`, card hover states, … — paint the Tailwind shadow instead of the Material one.

Custom styles can reuse the same tokens:

```scss
.my-panel {
  box-shadow: var(--shadow-md);
}
```

## 🌐 Internationalization

The app is translated with vue-i18n, and **Vuetify is wired into the very same locale**, so
one language switch translates the application _and_ every Vuetify component (empty states,
date pickers, data footers, pagination, rules, …).

- Default locale: **`zh-Hans` (中文)**
- Supported locales: **`zh-Hans`** and **`en`**
- Fallback: **`en`**

### How it is wired

```ts
// src/plugins/vuetify.ts
import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';

import i18n from './i18n';

export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
    fallback: 'en',
  },
  // ▸ theme, display, …
});
```

Vuetify resolves its component strings through `$vuetify.*`, so Vuetify's own locale
bundles are merged **under the `$vuetify` namespace** of each vue-i18n locale, next to the
app messages:

```ts
// src/locales/index.ts
import { en as vuetifyEn, zhHans as vuetifyZhHans } from 'vuetify/locale';

export const messages = {
  'zh-Hans': { $vuetify: vuetifyZhHans, ...zhHans },
  en: { $vuetify: vuetifyEn, ...en },
};
```

`src/plugins/index.ts` registers `i18n` **before** Vuetify, because the adapter needs the
vue-i18n instance and its `useI18n()` provider. That `useI18n` import is the only
vue-i18n call site in app code — every component and composable uses Vuetify's
`useLocale()`, which the adapter backs with the same composer.

### Files

```text
src/locales/
├─ index.ts      # supported locales, default/fallback, merged `messages`
├─ zh-Hans.ts    # app messages (Chinese)
└─ en.ts         # app messages (English)
src/composables/useAppLocale.ts          # read / switch the locale
src/components/common/AppLocaleMenu.vue  # language menu (app bar + sign-in page)
src/plugins/i18n.ts                      # createI18n + persistence + <html lang>/title sync
```

### Usage

```vue
<script setup lang="ts">
import { useLocale } from 'vuetify';

const { t } = useLocale();
</script>

<template>
  <h1>{{ t('app.name') }}</h1>
  <VSelect :items="[]" :label="t('demo.selectLabel')" />
</template>
```

`useLocale()` is Vuetify's translation API; through `createVueI18nAdapter` it resolves the
same vue-i18n messages (app messages **and** `$vuetify.*`), so app code never needs
vue-i18n's `useI18n` directly.

Key autocomplete is preserved by [`src/typings/vuetify.d.ts`](src/typings/vuetify.d.ts): a
type-only override of `useLocale().t` that derives the key union from `AppMessages` (mapped
through the `vuetify` alias in `tsconfig.app.json`).

Switching languages (app code):

```ts
import { useAppLocale } from '@/composables/useAppLocale';

const { currentLocale, localeOptions, setLocale } = useAppLocale();
setLocale('en');
```

`useAppLocale()` is a thin wrapper around `useLocale()`, and `current` is the same
reactive locale, so both APIs are interchangeable:

```ts
import { useLocale } from 'vuetify';

const { current } = useLocale();
current.value = 'en'; // <html lang> and localStorage follow automatically
```

### Behaviour details

- The chosen locale is stored in `localStorage` under `fruit-admin.locale`
  (falls back to `zh-Hans` when missing or unsupported — see `isAppLocale`).
- `<html lang>` and `document.title` are kept in sync by a watcher in
  `src/plugins/i18n.ts`, so they update even when the locale is changed from Vuetify.
- vue-i18n runs in **`legacy: false`** mode (composition API only) — Vuetify does not
  support legacy mode.

### Adding a locale

1. Add `src/locales/<locale>.ts` with the app messages (mirror an existing file).
2. Register it in `src/locales/index.ts`: import the Vuetify bundle
   (`import { ja } from 'vuetify/locale'`), add `'<locale>': { $vuetify: ja, ...jaApp }`
   to `messages`, and add it to `SUPPORTED_LOCALES` / `AppLocale`.
3. Nothing else — the switcher, persistence and Vuetify components pick it up automatically.

## 🏗️ Layouts

Layouts are **parent routes** — not a runtime `<component :is>` switch. The layout component
is the parent record, the route-level views in `src/views/` are its children, and each layout renders its own
`<RouterView />` in its content area. [`App.vue`](src/App.vue) therefore stays a plain
`<VApp><RouterView /></VApp>`.

```ts
// src/router/routes.ts
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BaseLayout,          // shell: drawer + header + <RouterView/>
    children: [
      { path: '', name: 'home', component: () => import('@/views/index.vue'), ... },
      { path: 'fruits', name: 'fruits', component: () => import('@/views/fruits.vue'), ... },
    ],
  },
  {
    path: '/',                     // full-screen views share the root path
    component: BlankLayout,         // shell: full-screen <RouterView/>
    children: [
      { path: 'login', name: 'login', component: () => import('@/views/login.vue'), ... },
    ],
  },
];
```

| Layout          | Parent route                                   | Structure                                                                                            |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **BaseLayout**  | `path: '/'` with the app views as children     | left `VNavigationDrawer` menu · top-right `VAppBar` header · bottom-right `VMain` + `<RouterView />` |
| **BlankLayout** | `path: '/'` with full-screen views as children | full-screen `VMain` + `<RouterView />`, no drawer/header — sign-in, error views, …                   |

`BaseLayout` details:

- Drawer: permanent on desktop, temporary/overlay on mobile (`useDisplay().mobile`); on
  desktop the app-bar menu button collapses it into a **rail** (icons only, expands on hover).
- Menu: derived from the router table via `router.getRoutes()` — any route with
  `meta: { nav: true, titleKey, icon }` shows up automatically
  ([`useNavigation.ts`](src/composables/useNavigation.ts)).
- Content: the route's child page, rendered by `<RouterView />`.
- The chrome state — drawer open, desktop rail, appearance drawer — lives in `BaseLayout`
  and flows down explicitly (props + events to the header, `v-model` to the drawers).

`BlankLayout` details: a single `VMain` with `flex min-h-screen items-center justify-center`;
the child view owns its full-screen composition ([`login.vue`](src/views/login.vue)).

### App bar

[`AppHeader.vue`](src/components/layout/AppHeader.vue) is a composition surface: every control
is a small component, so the state stays explicit (props down / events up). Toolbar buttons
share [`AppIconButton.vue`](src/components/common/AppIconButton.vue) (icon button + tooltip).

| Control             | Component                                                                         | Behaviour                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Menu / rail toggler | [`AppMenuToggler.vue`](src/components/layout/header/AppMenuToggler.vue)           | mobile: opens the temporary drawer · desktop: collapses / expands the sidebar rail                                                                                    |
| Breadcrumb          | [`AppBreadcrumb.vue`](src/components/layout/header/AppBreadcrumb.vue)             | route-derived (`useBreadcrumb`): breadcrumb on desktop, page title on tablets, hidden on phones                                                                       |
| Global search       | [`AppSearch.vue`](src/components/layout/header/AppSearch.vue)                     | Vuetify labs **`VCommandPalette`**: `Ctrl/⌘ + K` hotkey, **search-first** (empty until you type), items from `useNavigation()`, built-in filter + keyboard navigation |
| Fullscreen          | [`AppFullscreenToggle.vue`](src/components/layout/header/AppFullscreenToggle.vue) | Fullscreen API via `useFullscreen()` (desktop only)                                                                                                                   |
| Language            | [`AppLocaleMenu.vue`](src/components/common/AppLocaleMenu.vue)                    | `VMenu` over `useAppLocale().localeOptions`                                                                                                                           |
| Theme toggle        | [`AppThemeToggle.vue`](src/components/common/AppThemeToggle.vue)                  | cycles light → dark → system (`useThemeStore().cycleMode`)                                                                                                            |
| Appearance drawer   | [`AppThemeDrawer.vue`](src/components/layout/AppThemeDrawer.vue)                  | theme mode tabs + primary-color swatches                                                                                                                              |
| User menu           | [`AppUserMenu.vue`](src/components/layout/header/AppUserMenu.vue)                 | demo auth (`useAuthStore`): sign-in button → `/login`, avatar + sign-out when signed in                                                                               |

### Appearance (theme) settings

- [`src/stores/theme.ts`](src/stores/theme.ts) (Pinia setup store) owns `mode`
  (`light` / `dark` / `system`) and `primary`. Actions apply the change to the Vuetify theme
  **and** persist it, so the store is the single writer.
- Settings are persisted in `localStorage` under `fruit-admin.appearance`
  ([src/theme/appearance.ts](src/theme/appearance.ts)).
- The primary color is written to `theme.themes.value.{light,dark}.colors.primary`, so
  everything driven by `rgb(var(--v-theme-primary))` — Vuetify components and UnoCSS
  `bg-primary` / `text-primary` — updates at once.
- [`App.vue`](src/App.vue) creates the store before the first render, so the saved theme is
  applied without a flash.
- Add a color to `PRIMARY_COLOR_SWATCHES` to expose it in the drawer.

### Demo authentication

[`src/stores/auth.ts`](src/stores/auth.ts) is a minimal demo session (persisted under
`fruit-admin.user`): `signIn(username)` is called by [`views/login.vue`](src/views/login.vue)
and `signOut()` by the app-bar user menu. Replace both actions with real API calls when wiring
a backend.

### Routes

| Path               | Name        | Layout (parent) | Notes                                      |
| ------------------ | ----------- | --------------- | ------------------------------------------ |
| `/`                | `home`      | BaseLayout      | `nav: true` — 首页                         |
| `/fruits`          | `fruits`    | BaseLayout      | `nav: true` — demo table view              |
| `/login`           | `login`     | **BlankLayout** | full-screen sign-in demo (any credentials) |
| `/:pathMatch(.*)*` | `not-found` | —               | `redirect: '/'`                            |

### Adding a view / a layout

- **View**: add a file under `src/views/`, register it as a child of the layout route
  that should render it, and give it `meta: { titleKey, icon?, nav? }` if it belongs in
  the sidebar.
- **Layout**: create `src/layouts/<Name>.vue` (with `<RouterView />` where content goes)
  and add a parent record pointing at it in `src/router/routes.ts`.
- Routes carry no `meta.layout`: the parent/child relation _is_ the layout.

## 🦀 Oxc Toolchain

Three tools, one responsibility each — nothing formats code twice:

| Tool     | Role                                                                                       |
| -------- | ------------------------------------------------------------------------------------------ |
| `oxfmt`  | The **only** formatter: semicolons, single quotes, import sorting, `package.json` sorting. |
| `oxlint` | Primary linter: TypeScript and the `<script>` block of SFCs.                               |
| `eslint` | Only what Oxc cannot see: **Vue template rules** (plus a few semantic rules).              |

Oxlint lints `.vue` files by parsing their `<script>` block only, so template rules such as
"components must be PascalCase" cannot be enforced by Oxc. ESLint keeps exactly those rules,
and `eslint-plugin-oxlint` (appended last in `eslint.config.js`) turns off every rule that
Oxlint already covers, so nothing is reported twice.

### Code style enforced

- **Components are called in PascalCase**, Vuetify included:
  `<VApp>`, `<VMain>`, `<VBtn>`, `<RouterView>`. `vue/component-name-in-template-casing`
  is configured with `registeredComponentsOnly: false`, so globally registered components
  are checked too (they are auto-imported by `vite-plugin-vuetify`). This is autofixable:
  `pnpm lint:eslint:fix`.
- **Semicolons required** — `semi: true` in `.oxfmtrc.json`.
- **Imports sorted by group** — types → builtins → externals → `@/` internals → relative →
  side effects, with `newlinesBetween`, via `sortImports`. `internalPattern` includes
  `@/`, `~/` and `#`.
- **SFC block order** — `<script>` → `<template>` → `<style>`, enforced by
  `vue/block-order` (autofixable with `pnpm lint:eslint:fix`).
- Line width 100, 2-space indentation, single quotes, LF, final newline — `.oxfmtrc.json`
  and `.editorconfig`.

### Configuration files

- `.oxfmtrc.json` — oxfmt options + import sorting.
- `.oxlintrc.json` — Oxlint plugins, categories (`correctness` = error,
  `suspicious` / `perf` = warn) and Vue rules for script blocks.
- `eslint.config.js` — `eslint-config-vuetify` with `stylistic` and `perfectionist`
  disabled, plus the template rules block.
- `.editorconfig` — shared editor defaults.

### Editor setup

Recommended extensions are listed in `.vscode/extensions.json`: Volar, Vuetify,
UnoCSS, Oxc (`oxc.oxc-vscode`), ESLint, EditorConfig. `.vscode/settings.json` makes Oxc the
default formatter with format-on-save, runs ESLint fixes on save and enables flat config.
Formatting also runs through `pnpm fmt` in CI (`pnpm check`).

## 🧠 Agent skills (vue-skills)

This project vendors the [Vue 3 best-practice agent skills](https://github.com/PyModel/vue3-best-practices)
(PyModel, MIT, Vue 3.5+) so AI coding agents working here follow current Vue patterns.

- Installed to **`.agents/skills/`** — the universal agent-skills directory, discovered by
  DSH, Codex, GitHub Copilot, OpenCode, Cursor, Gemini CLI, … (not `.claude/`-specific).
- `skills-lock.json` pins the source repo, skill path and content hash of every skill;
  `npx skills experimental_install` restores them from the lock file.

| Skill                            | Used for                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `vue-best-practices`             | **Primary** — Composition API + `<script setup>` + TS, SSR, Volar / `vue-tsc` |
| `vue-router-best-practices`      | Router 4/5, guards, params, route lifecycle                                   |
| `vue-pinia-best-practices`       | Pinia stores, setup stores, reactivity                                        |
| `vue-debug-guides`               | runtime errors, warnings, async / SSR issues                                  |
| `vue-testing-best-practices`     | Vitest 4, Vue Test Utils, Playwright                                          |
| `vue-jsx-best-practices`         | JSX in Vue                                                                    |
| `vue-ai-apps`                    | LLM / agent UIs (`ai`, `@ai-sdk/vue`)                                         |
| `vue-options-api-best-practices` | Options API only — **not used here** (Composition API only)                   |

Managed with the [`skills`](https://skills.sh) CLI:

```bash
pnpm skills:list                     # list installed skills
pnpm skills:update                   # update to the latest versions

# reinstall / install into another checkout
DISABLE_TELEMETRY=1 npx --yes skills@latest add PyModel/vue3-best-practices \
  --skill '*' --agent universal --copy -y
```

Notes:

- These files are **vendored third-party content**: don't hand-edit them. `oxfmt` ignores
  `.agents/**` (see `.oxfmtrc.json`), so `pnpm fmt` neither rewrites nor checks them.
- `.agents/` and `skills-lock.json` are meant to be committed.
- `vue-options-api-best-practices` ships with the bundle but contradicts this project's
  Composition-API convention (see [AGENTS.md](AGENTS.md)) — don't load it here.

## 🧭 Start Here

- Main entry: `src/main.ts`
- Root component: `src/App.vue` (layout resolver)
- Layouts: `src/layouts/` (`BaseLayout`, `BlankLayout`), see [Layouts](#️-layouts)
- Plugins: `src/plugins/`
- Translations: `src/locales/` (`zh-Hans` default, `en`), Vuetify strings under `$vuetify`
- Types: `src/typings/` (ambient `*.d.ts` + shared app types, see [TypeScript](#-typescript))
- State: `src/stores/` (`theme.ts` = appearance settings, `auth.ts` = demo session)
- Styles: `src/styles/` (`settings.scss` = Vuetify Sass bootstrap, `vuetify-compat.scss` = restored utilities)
- Theme bridge: `src/theme/` (`breakpoints.ts` = shared breakpoints, `appearance.ts` = theme defaults / swatches)
- UnoCSS config: `uno.config.ts`
- Cascade layers: `public/layers.css`

## 📁 Project Structure

```text
├─ public/layers.css          # cascade layer order (linked from index.html)
├─ .agents/skills/            # vendored Vue agent skills (vue-skills bundle)
├─ skills-lock.json           # pinned agent-skill sources/versions
├─ src/
│  ├─ components/             # focus-feature components (auth/ common/ fruits/ home/ layout/)
│  │  └─ layout/              # AppHeader, AppSidebar, AppThemeDrawer + header/ and theme/ modules
│  ├─ composables/            # useAppLocale, useBreadcrumb, useFullscreen, useNavigation, usePageTitle
│  ├─ layouts/                # BaseLayout, BlankLayout
│  ├─ locales/                # app messages + merged Vuetify translations
│  ├─ views/                  # route-level views (index, fruits, login)
│  ├─ plugins/                # Vuetify, Pinia, i18n, router registration
│  ├─ router/
│  ├─ stores/                 # theme.ts (appearance), auth.ts (demo session)
│  ├─ styles/                 # settings.scss, main.scss, vuetify-compat.scss
│  ├─ theme/                  # breakpoints.ts, appearance.ts (theme defaults, swatches, storage)
│  └─ typings/                # *.d.ts + shared app types (auth, env, i18n, navigation, theme, …)
├─ uno.config.ts
├─ .oxfmtrc.json
├─ .oxlintrc.json
├─ eslint.config.js
└─ .editorconfig
```

## 🤖 Vuetify MCP Server

This project is configured with the Vuetify Model Context Protocol (MCP) server.
To install and configure the MCP server for your favorite IDE (Cursor, Trae, Windsurf, VS Code, Claude Desktop, etc.) run:

```bash
pnpm dlx @vuetify/mcp-cli
```

This will open an interactive setup wizard to help you connect your AI assistant to the Vuetify ecosystem.

## 💪 Support Vuetify Development

This project uses Vuetify - an MIT licensed Open Source project. We are glad to welcome contributors and any support for ongoing development:

- Contribute to Vuetify and ecosystem projects: https://github.com/vuetifyjs
- Request enterprise support: https://support.vuetifyjs.com/
- Sponsor Vuetify: https://github.com/sponsors/vuetifyjs
- Support on Open Collective: https://opencollective.com/vuetify
