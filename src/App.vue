<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import LocaleSwitcher from '@/components/LocaleSwitcher.vue';

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <VApp>
    <VAppBar class="px-2" flat>
      <VAppBarTitle>{{ t('app.name') }}</VAppBarTitle>
      <VSpacer />
      <LocaleSwitcher />
    </VAppBar>
    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>
