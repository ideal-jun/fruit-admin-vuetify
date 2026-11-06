<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useDisplay, useLocale } from 'vuetify';

import { useAuthStore } from '@/stores/auth';

const { t } = useLocale();
const { mobile } = useDisplay();
const auth = useAuthStore();
const router = useRouter();

function goLogin() {
  void router.push({ name: 'login' });
}

function signOut() {
  auth.signOut();
  void router.push({ name: 'login' });
}
</script>

<template>
  <VBtn v-if="!auth.isAuthenticated" color="primary" variant="tonal" @click="goLogin">
    <VIcon v-if="mobile" icon="mdi-login" />
    <span v-else>{{ t('layout.signIn') }}</span>
  </VBtn>

  <VMenu v-else location="bottom end">
    <template #activator="{ props }">
      <VBtn v-bind="props" variant="text">
        <template #prepend>
          <VAvatar color="primary" size="24">
            <span class="text-label-large">{{ auth.initials }}</span>
          </VAvatar>
        </template>

        <span class="hidden text-label-large sm:block">{{ auth.displayName }}</span>

        <template #append>
          <VIcon icon="mdi-chevron-down" size="18" />
        </template>
      </VBtn>
    </template>

    <VList density="compact" min-width="200" nav>
      <VListItem
        prepend-icon="mdi-account-circle-outline"
        :subtitle="t('layout.signedInAs')"
        :title="auth.displayName"
      />
      <VDivider class="my-1" />
      <VListItem
        base-color="error"
        prepend-icon="mdi-logout"
        :title="t('layout.signOut')"
        @click="signOut"
      />
    </VList>
  </VMenu>
</template>
