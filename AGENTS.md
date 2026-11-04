# Project Rules

## General

- Follow the existing code style and patterns.
- Use pnpm for running project commands.
- Keep code in TypeScript unless migration is required.
- Always add semicolons at the end of statements.

## Stack

- Framework: Vue 3 + Vite
- UI Library: Vuetify 4
- Enabled Features: ESLint, Vuetify MCP, Pinia, Vue I18n, Vue Router, UnoCSS + Wind4

## Toolchain (Oxc)

`oxfmt` is the only formatter, `oxlint` is the primary linter, ESLint only keeps the
rules that Oxc cannot cover (mainly Vue **template** rules, e.g. component name casing).

| Command                       | What it does                              |
| ----------------------------- | ----------------------------------------- |
| `pnpm lint`                   | `oxlint` + `eslint`                       |
| `pnpm lint:oxlint`            | fast Rust linter                          |
| `pnpm lint:eslint`            | ESLint (template rules)                   |
| `pnpm fmt` / `pnpm fmt:check` | format / verify formatting                |
| `pnpm fix`                    | `oxlint --fix` → `eslint --fix` → `oxfmt` |
| `pnpm check`                  | type-check + type-coverage + lint + fmt   |

Never hand-format code or hand-sort imports: run `pnpm fix`.

## Conventions

- **Components are always invoked in PascalCase in templates**, including Vuetify
  components: `<VApp>`, `<VMain>`, `<VBtn>`, `<RouterView>`. Kebab-case
  (`<v-btn>`, `<router-view>`) is an ESLint error.
- **Semicolons required** (`semi: true` in `.oxfmtrc.json`).
- **Imports are sorted by groups** (types → builtins → externals → internals/`@/` → relative
  → side effects), enforced by `oxfmt`'s `sortImports`. Do not reorder by hand.
- **SFC blocks are ordered `script` → `template` → `style`**, enforced by
  `vue/block-order` (autofixable, `pnpm lint:eslint:fix`).
- Indentation 2 spaces, single quotes, line width 100 (see `.editorconfig` / `.oxfmtrc.json`).

## Component organization

Follow the `vue-best-practices` skill (loaded for Vue work) when creating or changing
components:

- **Keep route views thin composition surfaces.** A view wires data + children and owns
  its page-private UI in `src/views/<page>/modules/`. Layout chrome lives with the layout
  it belongs to (`src/layouts/modules/<module>/`), and only genuinely cross-page reusable
  components live in `src/components/` (`common/` for shared controls, `advanced/` for
  reusable primitives such as `page-tab/`). Components follow their narrowest owner — never
  park layout- or page-specific components in `components/`.
- Split a component when it owns **3+ UI sections** or has more than one responsibility;
  route views must not embed feature implementations.
- **Props down, events up.** Type contracts with `defineProps<Props>()` /
  `defineEmits<Emits>()`; use `defineModel<T>()` for genuine two-way bindings; prefer
  Vue 3.5 reactive props destructure (`const { x = fallback } = defineProps<Props>()`)
  over `withDefaults`. Custom event names are kebab-case (`emit('toggle-menu')`).
- **Primitive state uses `shallowRef()`**, objects follow the `ref`/`reactive` rules from
  the skill; derive values with `computed` and keep computed getters pure; use watchers
  only for side effects (`{ immediate: true }` over duplicated initial calls).
- SFC structure: `<script setup lang="ts">` → `<template>` → `<style scoped>`; stable
  `:key` on `v-for`; never mix `v-if` with `v-for`; no unsanitized `v-html`;
  use `useTemplateRef()` for template refs; `:deep()` sparingly (the home page keeps one
  documented demo of `@apply` + `:deep()`).
- Reused route-derived logic belongs in a composable — e.g. `usePageTitle()` is shared by
  `AppHeader` and `App.vue`.

## Layouts

Layouts are **parent routes** in `src/router/routes.ts` — do not switch layouts at runtime
with `<component :is>` and do not add `meta.layout`.

- **`BaseLayout`** (parent of the app views in `src/views/`) = `VNavigationDrawer` (left menu) + `VAppBar`
  (header) + `VMain` with `<RouterView />` (content). Never put an app bar / drawer inside
  a view — they belong to the layout. It owns the chrome UI state (drawer open, desktop
  rail, appearance drawer) and passes it down explicitly.
- **App bar** = `AppHeader.vue`, composition only: each control is a small component under
  `src/layouts/modules/header/` (menu/rail toggler, breadcrumb, global search, fullscreen,
  user menu) or `src/components/common/` when reused (icon button, locale menu, theme
  toggle). The app bar never owns layout state — it emits events, `BaseLayout` decides.
- Breadcrumb (`useBreadcrumb`) and global search (`useNavigation`) derive from the router
  table. Search is Vuetify's **labs** `VCommandPalette` (explicit
  `import { VCommandPalette } from 'vuetify/labs/VCommandPalette'` — labs components are not
  auto-imported) with the `meta+k` hotkey, which maps to `⌘K` on macOS and `Ctrl+K` elsewhere.
  The palette is **search-first**: its item list stays empty until a query is typed
  (`items` is gated on the bound `v-model:search` value). Its custom `#input` wraps the
  palette's keydown handler with an IME guard (`event.isComposing`) so the Enter that
  commits a pinyin/IME composition never executes the highlighted item.
- Appearance settings live in `src/stores/theme.ts`: `mode` (`light` / `dark` / `system`) and
  `primary`, persisted under `fruit-admin.appearance`. Mutating the Vuetify theme updates
  `rgb(var(--v-theme-primary))` — and therefore `bg-primary` / `text-primary` — at once.
  Create the store in `App.vue` before the first render so the saved theme applies without
  a flash.
- Demo auth lives in `src/stores/auth.ts` (`fruit-admin.user`): the login view signs in, the
  app-bar user menu signs out. There are no route guards yet.
- **`BlankLayout`** (parent of full-screen views) = full-screen `VMain` with
  `<RouterView />`, no chrome. Use for sign-in, 404, onboarding, …
- `App.vue` is just `<VApp><RouterView /></VApp>`.
- Views render into the layout's `<RouterView />`; they are layout-agnostic.
- Sidebar entries come from route metadata — `meta: { nav: true, titleKey, icon }`; a new
  route with those fields appears in the menu automatically (`useNavigation`). Labels must
  be i18n keys, never hard-coded text.
- Route-level components live in **`src/views/<page>/index.vue`** (not `pages/`), with
  page-private UI under `src/views/<page>/modules/`. To add a view, create that folder and
  register its `index.vue` as a child of the layout that should render it. To add a
  layout, create `src/layouts/<Name>.vue` (with `<RouterView />`) and add a parent record
  for it in `src/router/routes.ts`; layout-only modules go in `src/layouts/modules/`.
- `document.title` is derived from the matched route's `meta.titleKey` in `App.vue`
  (child meta is merged with its parent layout record).

## State (Pinia)

Stores are **setup stores** in `src/stores/` and the single writer for their domain:

- `theme.ts` — appearance settings. Actions apply the change to the Vuetify theme
  explicitly (no hidden watchers) and persist it; they run in `App.vue` setup so the saved
  theme is applied before the shell renders.
- `auth.ts` — demo session; `signIn` / `signOut` persist the user.
- Persist with a `typeof localStorage === 'undefined'` guard and a `try/catch` — storage can
  be unavailable (SSR, private mode).

## Agent skills

Vue 3 best-practice skills are vendored in **`.agents/skills/`** (managed by the `skills`
CLI, pinned in `skills-lock.json`). They are third-party content — never edit them by hand;
update with `pnpm skills:update`.

- Load **`vue-best-practices`** before Vue / Vuetify work; also load
  `vue-router-best-practices`, `vue-pinia-best-practices` or `vue-debug-guides` when the
  task touches routing, stores, or debugging.
- Do **not** load `vue-options-api-best-practices` — this project is Composition API only.
- `.agents/**` is excluded from `oxfmt` (vendored files must not be reformatted) and is
  meant to be committed with the repo.

## TypeScript

- **Type files belong in `src/typings/`** — ambient declarations (`*.d.ts`) and shared
  domain types live there, not next to components.
- **No `any`** (`typescript/no-explicit-any` = error) and no `@ts-ignore`/`@ts-nocheck`;
  use `unknown` + a type guard (`isAppLocale` in `src/locales/index.ts` is the pattern).
- Prefer `satisfies` over `as`; avoid casts, and comment the exception when a cast is
  unavoidable (e.g. the UnoCSS preflight theme bridge in `uno.config.ts`).
- `tsconfig.app.json` is stricter than the Vue baseline (`noUncheckedIndexedAccess`,
  `noImplicitOverride`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`). Fix the code, don't relax the flags.
- `pnpm type-coverage` must stay ≥ 99 % (currently 100 % on the `.ts` sources); SFC
  templates are type-checked by `pnpm type-check` (`vue-tsc`).
- New i18n keys go into `AppMessages` (`src/typings/i18n.ts`) **and** both locale files —
  the latter are typed against that interface, so missing keys fail the build.

## i18n

Vuetify is wired to **vue-i18n** through `createVueI18nAdapter`: one locale drives both the
app and every Vuetify component.

- Default locale `zh-Hans` (中文); supported: `zh-Hans`, `en`; fallback `en`.
- Never hard-code user-facing strings. Add keys to **both** `src/locales/zh-Hans.ts` and
  `src/locales/en.ts`, then use `const { t } = useLocale()` (from `'vuetify'`) and
  `t('some.key')` in SFCs/composables. The `useI18n` import in `src/plugins/vuetify.ts`
  exists only because `createVueI18nAdapter` requires it — don't use `useI18n` elsewhere.
- Vuetify's own translations live under the `$vuetify` namespace of each locale
  (`vuetify/locale` bundles merged in `src/locales/index.ts`) — do not add them manually.
- Switch locale with `useAppLocale().setLocale(...)` (or `useLocale().current` directly);
  `localStorage` and `<html lang>` are synced in `src/plugins/i18n.ts`, while the
  route-aware `document.title` is derived from `meta.titleKey` in `src/App.vue`.
  Keep `legacy: false` — Vuetify does not support legacy mode.
- `useLocale().t` is typed through `src/typings/vuetify.d.ts` (a type-only `useLocale`
  override wired with a `vuetify` alias in `tsconfig.app.json`). It derives key autocomplete
  from `AppMessages`; Vite ignores `tsconfig` `paths`, so the runtime import is unchanged.
  Keep that alias when changing the `paths` block.
- Register `app.use(i18n)` **before** `app.use(vuetify)` in `src/plugins/index.ts`.
- App-bar strings live under `layout.*` (search, fullscreen, menu, account) and
  `theme.*` (appearance drawer); add new keys to both locale files and `AppMessages`.

## Styling

- Utility classes come from **UnoCSS (`presetWind4`)**, configured in `uno.config.ts`.
  Vuetify's own utility classes are disabled (`$utilities: false` in
  `src/styles/settings.scss`), so use Tailwind-style classes: `flex items-center gap-4`.
- Vuetify-only class names still work because they are re-created as UnoCSS shortcuts
  or `rules` (`elevation-*`, `rounded-*`, `text-display-large`,
  `text-medium-emphasis` …). Emphasis text utilities keep Vuetify 4's `color-mix()`
  formula (`--v-theme-on-background` + `--v-medium-emphasis-opacity`) — prefer them over
  `opacity-*` for secondary text.
- Shadows: Vuetify's `elevation-*` is aligned with the TailwindCSS shadow scale.
  `uno.config.ts` maps elevation levels to presetWind4 `theme.shadow` tokens and publishes
  them as `--shadow-*` (derived from the **resolved** theme — never hard-coded); Vuetify's
  Sass `$shadow-key` / `$shadow-ambient` in `src/styles/settings.scss` reuse the same
  variables. Use `elevation-*` / `shadow-*` (or `var(--shadow-*)`) instead of hard-coded
  `box-shadow` values.
- Theme colors are exposed as `rgb(var(--v-theme-*))`, so `bg-primary`, `text-error`, … work.
  They follow runtime theme changes (the appearance drawer writes
  `theme.themes.value.*.colors.primary`). Dark mode uses Vuetify's theme selectors:
  `dark:bg-black` compiles to `.v-theme--dark .dark\\:bg-black`.
- New CSS cascade layers must respect `public/layers.css` (UnoCSS sits between Vuetify core
  and `vuetify-final`).
- Prefer UnoCSS utilities over `<style scoped>`; `@apply` is available via
  `@unocss/transformer-directives`.
