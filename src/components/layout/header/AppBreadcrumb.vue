<script setup lang="ts">
import { useDisplay } from 'vuetify';

import { useBreadcrumb } from '@/composables/useBreadcrumb';
import { usePageTitle } from '@/composables/usePageTitle';

const { mobile, smAndUp } = useDisplay();
const items = useBreadcrumb();
const { title } = usePageTitle();
</script>

<template>
  <!-- Phones: the app bar only shows controls, the page heading lives in the view. -->
  <VAppBarTitle v-if="mobile && smAndUp">{{ title }}</VAppBarTitle>

  <VBreadcrumbs v-else-if="!mobile" class="ms-2" density="compact">
    <VBreadcrumbsItem
      v-for="(item, index) in items"
      :key="item.title"
      :class="index === items.length - 1 ? 'text-primary font-semibold' : ''"
      :to="index === items.length - 1 ? undefined : item.to"
    >
      <VIcon v-if="item.icon" class="me-1" :icon="item.icon" size="16" />
      {{ item.title }}
    </VBreadcrumbsItem>
  </VBreadcrumbs>
</template>
