import type { AppMessages } from '@/typings/i18n';

const messages: AppMessages = {
  app: {
    name: '水果管理系统',
    tagline: 'Vue 3 + Vuetify 4 + UnoCSS 后台脚手架',
  },
  nav: {
    menu: '菜单',
    home: '首页',
    fruits: '水果列表',
  },
  layout: {
    toggleTheme: '切换主题',
    signIn: '登录',
    signOut: '退出登录',
    signedInAs: '当前账号',
    openMenu: '打开菜单',
    expandSidebar: '展开侧边栏',
    collapseSidebar: '收起侧边栏',
    search: '搜索',
    searchPlaceholder: '搜索页面…',
    searchEmpty: '没有匹配的页面',
    searchPrompt: '您的搜索结果将显示在这里',
    searchHint: '↑↓ 选择 · Enter 打开 · Esc 关闭',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
  },
  theme: {
    title: '外观设置',
    mode: '主题模式',
    modeLight: '浅色',
    modeDark: '深色',
    modeSystem: '跟随系统',
    primary: '主题色',
    reset: '恢复默认',
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
    currentLocale: '当前语言：{0}',
  },
  views: {
    login: {
      title: '登录',
      subtitle: '欢迎回来，请登录你的账号',
      username: '用户名',
      password: '密码',
      submit: '登录',
      hint: '演示用：任意账号密码均可进入',
    },
    fruits: {
      title: '水果列表',
      name: '名称',
      price: '价格（元）',
      items: {
        apple: '苹果',
        banana: '香蕉',
        orange: '橙子',
      },
    },
  },
};

export default messages;
