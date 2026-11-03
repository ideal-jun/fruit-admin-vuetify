<script setup lang="ts">
import type { AppLocale } from '@/typings/i18n';

import { useLocale } from 'vuetify';

import AppIconButton from '@/components/common/AppIconButton.vue';
import { useAppLocale } from '@/composables/useAppLocale';

const { t } = useLocale();
const { currentLocale, localeOptions, setLocale } = useAppLocale();

function select(value: AppLocale) {
  setLocale(value);
}
</script>

<template>
  <VMenu location="bottom end">
    <template #activator="{ props }">
      <span v-bind="props">
        <AppIconButton icon="mdi-translate" :tooltip="t('locale.label')" />
      </span>
    </template>

    <VList density="compact" min-width="160" nav>
      <VListItem
        v-for="option in localeOptions"
        :key="option.value"
        :active="option.value === currentLocale"
        :title="option.label"
        @click="select(option.value)"
      />
    </VList>
  </VMenu>
</template>
