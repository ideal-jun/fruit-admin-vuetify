import vuetify from 'eslint-config-vuetify';
import oxlint from 'eslint-plugin-oxlint';

/**
 * ESLint flat config.
 *
 * Oxc 工具链分工：
 * - oxfmt 是唯一格式化器（分号 / 引号 / import 排序 / package.json 排序）
 * - oxlint 是主 linter（.ts 以及 .vue 的 <script> 部分）
 * - ESLint 只保留 Oxc 覆盖不到的部分：Vue 模板规则（组件名大驼峰等）
 *
 * 因此 stylistic / perfectionist 两组配置关闭；eslint-plugin-oxlint 的
 * flat/* 规则放在数组最后，统一关闭 oxlint 已经覆盖的 ESLint 规则。
 */
export default [
  ...(await vuetify({
    ts: true,
    stylistic: false,
    perfectionist: false,
  })),
  {
    name: 'fruit-admin/oxc/vue-template',
    files: ['**/*.vue'],
    rules: {
      // 规范 A：组件一律 PascalCase 调用，包含 Vuetify 组件（<VBtn>）与 <RouterView>。
      // registeredComponentsOnly: false → 未注册的全局组件（Vuetify autoImport）也要检查。
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          // Vue 内置标签不是用户组件，避免把它们误判为未大驼峰：
          // <component>/<slot>/<template> 由规则自动忽略，其余需要显式列出。
          ignores: [
            'component',
            'slot',
            'template',
            'transition',
            'transition-group',
            'keep-alive',
            'teleport',
            'suspense',
          ],
        },
      ],

      // SFC 顶层块顺序：script → template → style（eslint --fix 可自动重排）。
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],

      // oxlint 是主 linter，脚本里的组件名 casing 交给它，避免和 ESLint 重复报告。
      'vue/component-definition-name-casing': 'off',

      // ---------------------------------------------------------------
      // 以下格式化规则由 oxfmt 负责：oxfmt 的输出与它们直接冲突
      // （验证方式：把 oxfmt --stdin-filepath 的输出直接交给 ESLint，见交付报告）
      // ---------------------------------------------------------------
      // oxfmt 会把放得下的属性收成一行，规则却限制单行属性个数 → 来回打架
      'vue/max-attributes-per-line': 'off',
      // oxfmt 不强制标签之间的空行，eslint 要求空行 → 来回打架
      'vue/padding-line-between-tags': 'off',
      // oxfmt 对 void 元素总是自闭合（<br />）、普通空元素保留 <div></div>，与规则要求相反
      'vue/html-self-closing': 'off',
      // oxfmt 决定 SFC <script> 的缩进（vueIndentScriptAndStyle，默认不缩进）
      'vue/script-indent': 'off',
    },
  },
  // 必须放在最后：关闭 oxlint 已覆盖的规则。
  // 本项目启用了 correctness / suspicious / perf 三个类别，所以三个级别都要关；
  // 仅 flat/recommended（= correctness）会漏掉 suspicious / perf 的重复报告。
  ...oxlint.configs['flat/recommended'],
  ...oxlint.configs['flat/suspicious'],
  ...oxlint.configs['flat/perf'],
];
