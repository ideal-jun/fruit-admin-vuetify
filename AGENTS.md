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
  `src/locales/en.ts`, then use `const { t } = useI18n({ useScope: 'global' })` and
  `t('some.key')` in SFCs.
- Vuetify's own translations live under the `$vuetify` namespace of each locale
  (`vuetify/locale` bundles merged in `src/locales/index.ts`) — do not add them manually.
- Switch locale with `useAppLocale().setLocale(...)` (or Vuetify's `useLocale()`);
  `localStorage`, `<html lang>` and `document.title` are synced automatically in
  `src/plugins/i18n.ts`. Keep `legacy: false` — Vuetify does not support legacy mode.
- Register `app.use(i18n)` **before** `app.use(vuetify)` in `src/plugins/index.ts`.

## Styling

- Utility classes come from **UnoCSS (`presetWind4`)**, configured in `uno.config.ts`.
  Vuetify's own utility classes are disabled (`$utilities: false` in
  `src/styles/settings.scss`), so use Tailwind-style classes: `flex items-center gap-4`.
- Vuetify-only class names still work because they are re-created as UnoCSS shortcuts
  or `rules` (`elevation-*`, `rounded-*`, `text-display-large` …).
- Shadows: Vuetify's `elevation-*` is aligned with the TailwindCSS shadow scale.
  `uno.config.ts` maps elevation levels to presetWind4 `theme.shadow` tokens and publishes
  them as `--shadow-*` (derived from the **resolved** theme — never hard-coded); Vuetify's
  Sass `$shadow-key` / `$shadow-ambient` in `src/styles/settings.scss` reuse the same
  variables. Use `elevation-*` / `shadow-*` (or `var(--shadow-*)`) instead of hard-coded
  `box-shadow` values.
- Theme colors are exposed as `rgb(var(--v-theme-*))`, so `bg-primary`, `text-error`, … work.
  Dark mode uses Vuetify's theme selectors: `dark:bg-black` compiles to
  `.v-theme--dark .dark\\:bg-black`.
- New CSS cascade layers must respect `public/layers.css` (UnoCSS sits between Vuetify core
  and `vuetify-final`).
- Prefer UnoCSS utilities over `<style scoped>`; `@apply` is available via
  `@unocss/transformer-directives`.
