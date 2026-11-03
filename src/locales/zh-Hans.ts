import type { AppMessages } from '@/typings/i18n';

const messages: AppMessages = {
  app: {
    name: '水果管理系统',
    tagline: 'Vue 3 + Vuetify 4 + UnoCSS 后台脚手架',
  },
  locale: {
    label: '语言',
    zhHans: '中文',
    en: 'English',
  },
  demo: {
    title: 'i18n 演示',
    description:
      '语言由 vue-i18n 控制，Vuetify 内置文案（以及日期、分页等）使用同一个 $vuetify 命名空间。',
    selectLabel: '选择一个水果（列表为空，展示 Vuetify 内置空状态文案）',
    currentLocale: '当前语言：{locale}',
  },
};

export default messages;
