import type { TabAction, TabActionItem } from '@/typings/tabs';

import { useLocale } from 'vuetify';

import { useTabsStore } from '@/stores/tabs';

/** Menu icons; both tab menus render the same glyph for an action. */
const TAB_ACTION_ICONS: Record<TabAction, string> = {
  'close-current': 'mdi-close',
  'close-others': 'mdi-close-box-multiple-outline',
  'close-left': 'mdi-arrow-collapse-left',
  'close-right': 'mdi-arrow-collapse-right',
  'close-all': 'mdi-close-box-outline',
  pin: 'mdi-pin',
  unpin: 'mdi-pin-off',
};

/**
 * Tab action options shared by the tab-bar dropdown and the right-click context menu.
 *
 * Both entry points have to offer the same actions with the same disabled/pin rules,
 * so those rules live here instead of in the two presentational menus.
 */
export function useTabMenu() {
  const tabsStore = useTabsStore();
  const { t } = useLocale();

  function getMenuOptions(tabId: string): TabActionItem[] {
    const retained = tabsStore.isRetained(tabId);
    const pinned = tabsStore.isPinned(tabId);

    const options: TabActionItem[] = [
      {
        key: 'close-current',
        label: t('tabs.closeCurrent'),
        icon: TAB_ACTION_ICONS['close-current'],
        disabled: retained,
      },
      {
        key: 'close-others',
        label: t('tabs.closeOthers'),
        icon: TAB_ACTION_ICONS['close-others'],
        disabled: false,
      },
      {
        key: 'close-left',
        label: t('tabs.closeLeft'),
        icon: TAB_ACTION_ICONS['close-left'],
        disabled: retained,
      },
      {
        key: 'close-right',
        label: t('tabs.closeRight'),
        icon: TAB_ACTION_ICONS['close-right'],
        disabled: false,
      },
      {
        key: 'close-all',
        label: t('tabs.closeAll'),
        icon: TAB_ACTION_ICONS['close-all'],
        disabled: false,
      },
    ];

    // The home tab is retained forever, so it offers no pin/unpin action.
    if (tabId !== tabsStore.homeTab?.id) {
      options.push({
        key: pinned ? 'unpin' : 'pin',
        label: pinned ? t('tabs.unpin') : t('tabs.pin'),
        icon: TAB_ACTION_ICONS[pinned ? 'unpin' : 'pin'],
        disabled: false,
      });
    }

    return options;
  }

  return { getMenuOptions };
}
