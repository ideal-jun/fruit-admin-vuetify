<script setup lang="ts">
import { useRouter } from 'vue-router';

import LoginCard from '@/components/auth/LoginCard.vue';
import AppLocaleMenu from '@/components/common/AppLocaleMenu.vue';
import AppThemeToggle from '@/components/common/AppThemeToggle.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

// Demo only: any credentials sign in, swap for a real auth call.
function signIn({ username }: { username: string; password: string }) {
  auth.signIn(username);
  void router.push({ name: 'home' });
}
</script>

<template>
  <div class="w-full max-w-[420px]">
    <div class="mb-3 flex justify-end gap-1">
      <AppLocaleMenu />
      <AppThemeToggle />
    </div>

    <LoginCard @submit="signIn" />
  </div>
</template>
