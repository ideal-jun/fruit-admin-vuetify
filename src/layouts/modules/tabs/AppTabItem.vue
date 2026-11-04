<script setup lang="ts">
import type { AppTab } from '@/typings/tabs';
import type { TabMode } from '@/typings/theme';

import { useLocale } from 'vuetify';

import PageTab from '@/components/advanced/page-tab/PageTab.vue';
import { DEFAULT_PRIMARY_COLOR } from '@/theme/appearance';

interface Props {
  /** Tab data; the label is translated from `titleKey` at render time. */
  tab: AppTab;
  /** Visual style shared by the whole tab bar. */
  mode?: TabMode;
  /** Whether this tab matches the current route. */
  active?: boolean;
  /** Whether the dark theme is active (drives the chrome-tab background). */
  darkMode?: boolean;
  /** Show the close button; retained tabs are never closable. */
  closable?: boolean;
  /** Show the pinned indicator. */
  pinned?: boolean;
  /** Base color of the active tab tint. */
  activeColor?: string;
}

interface Emits {
  /** The tab was clicked or activated with Enter/Space. */
  activate: [];
  /** The close button was pressed. */
  close: [];
  /** Right click: the container opens the tab context menu. */
  'open-menu': [event: MouseEvent];
  /** Middle mouse button: the container decides whether the tab closes. */
  'middle-click': [event: MouseEvent];
}

// Vue 3.5 reactive props destructure: native defaults instead of withDefaults().
const {
  tab,
  mode = 'chrome',
  active = false,
  darkMode = false,
  closable = true,
  pinned = false,
  activeColor = DEFAULT_PRIMARY_COLOR,
} = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useLocale();
</script>

<template>
  <PageTab
    :active="active"
    :active-color="activeColor"
    :closable="closable"
    :close-label="t('tabs.close')"
    :dark-mode="darkMode"
    :data-tab-id="tab.id"
    :label="t(tab.titleKey)"
    :mode="mode"
    :pinned="pinned"
    @activate="emit('activate')"
    @close="emit('close')"
    @middle-click="emit('middle-click', $event)"
    @open-menu="emit('open-menu', $event)"
  >
    <template v-if="tab.icon" #prefix>
      <VIcon :icon="tab.icon" size="16" />
    </template>
    {{ t(tab.titleKey) }}
  </PageTab>
</template>
