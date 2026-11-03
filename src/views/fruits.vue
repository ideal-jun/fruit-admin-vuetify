<script setup lang="ts">
import type { FruitRow } from '@/typings/fruit';

import { useLocale } from 'vuetify';

import FruitsTable from '@/components/fruits/FruitsTable.vue';

const { t } = useLocale();

const fruits: FruitRow[] = [
  { nameKey: 'views.fruits.items.apple', price: 8.5 },
  { nameKey: 'views.fruits.items.banana', price: 3.2 },
  { nameKey: 'views.fruits.items.orange', price: 6 },
];
</script>

<template>
  <VContainer>
    <VCard elevation="1" rounded="xl">
      <VCardItem prepend-icon="mdi-fruit-cherries" :title="t('views.fruits.title')" />
      <FruitsTable :rows="fruits" />
    </VCard>
  </VContainer>
</template>
