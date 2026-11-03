<script setup lang="ts">
import type { FruitRow } from '@/typings/fruit';

import { useLocale } from 'vuetify';

const { rows } = defineProps<{ rows: readonly FruitRow[] }>();

const { t } = useLocale();
</script>

<template>
  <VTable>
    <thead>
      <tr>
        <th>{{ t('views.fruits.name') }}</th>
        <th class="text-end">{{ t('views.fruits.price') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.nameKey">
        <td>{{ t(row.nameKey) }}</td>
        <td class="text-end">{{ row.price }}</td>
      </tr>
    </tbody>
  </VTable>
</template>
