<script setup lang="ts">
import { useLocale } from 'vuetify';

import { useNavigation } from '@/composables/useNavigation';

interface Props {
  /** Temporary (overlay) drawer, used on mobile. */
  temporary?: boolean;
  /** Collapsed rail showing icons only (desktop). */
  rail?: boolean;
}

const { temporary = false, rail = false } = defineProps<Props>();

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
    :temporary="temporary"
    width="264"
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
