<script setup lang="ts">
import { useAppLocale } from '@/composables/useAppLocale';
import { isAppLocale, SUPPORTED_LOCALES } from '@/locales';

const { currentLocale, setLocale } = useAppLocale();

function onLocaleChange(value: unknown) {
  if (isAppLocale(value)) {
    setLocale(value);
  }
}
</script>

<template>
  <VBtnToggle
    class="locale-switcher ms-2"
    density="comfortable"
    divided
    mandatory
    :model-value="currentLocale"
    variant="text"
    @update:model-value="onLocaleChange"
  >
    <VBtn v-for="option in SUPPORTED_LOCALES" :key="option.value" :value="option.value">
      {{ option.label }}
    </VBtn>
  </VBtnToggle>
</template>
