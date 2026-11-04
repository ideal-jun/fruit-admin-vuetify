<script setup lang="ts">
import { useLocale } from 'vuetify';

import { useAppLocale } from '@/composables/useAppLocale';

const { t } = useLocale();
const { currentLocale } = useAppLocale();
</script>

<template>
  <VCard class="md:col-span-2" variant="tonal">
    <VCardItem>
      <template #prepend>
        <VAvatar color="primary" icon="mdi-translate" variant="tonal" />
      </template>
      <template #title>{{ t('demo.title') }}</template>
      <template #subtitle>{{ t('demo.description') }}</template>
    </VCardItem>

    <VCardText>
      <VSelect :items="[]" :label="t('demo.selectLabel')" />
      <p class="text-body-small mt-3">
        {{ t('demo.currentLocale', currentLocale) }}
      </p>
    </VCardText>
  </VCard>
</template>
