<script setup lang="ts">
import { useLocale } from 'vuetify';

import { useNavigation } from '@/composables/useNavigation';

interface Props {
  /** Temporary (overlay) drawer, used on mobile. */
  temporary?: boolean;
  /** Collapsed rail showing icons only (desktop). */
  rail?: boolean;
  /** Expanded drawer width in pixels. */
  width?: number;
  /** Rail width in pixels when the sidebar is collapsed. */
  collapsedWidth?: number;
}

const { temporary = false, rail = false, width = 264, collapsedWidth = 56 } = defineProps<Props>();

/** Two-way binding owned by BaseLayout: `<AppSidebar v-model="drawer" />`. */
const open = defineModel<boolean>({ required: true });

const { t } = useLocale();
const navItems = useNavigation();
</script>

<template>
  <VNavigationDrawer
    v-model="open"
    :expand-on-hover="rail"
    :permanent="!temporary"
    :rail="rail"
    :rail-width="collapsedWidth"
    :temporary="temporary"
    :width="width"
  >
    <template #prepend>
      <VList>
        <VListItem prepend-icon="mdi-fruit-cherries">
          <VListItemTitle class="text-h6 font-bold">
            <RouterLink class="text-inherit no-underline" to="/">
              {{ t('app.name') }}
            </RouterLink>
          </VListItemTitle>
        </VListItem>
      </VList>
      <VDivider />
    </template>
    <VList color="primary" density="compact" nav>
      <VListItem
        v-for="item in navItems"
        :key="item.to"
        :prepend-icon="item.icon"
        rounded="lg"
        :title="item.title"
        :to="item.to"
      />
    </VList>
  </VNavigationDrawer>
</template>
