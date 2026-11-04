<script setup lang="ts">
import { shallowRef } from 'vue';
import { useLocale } from 'vuetify';

interface Emits {
  /** The form was submitted; the view decides what to do with the credentials. */
  submit: [payload: { username: string; password: string }];
}

const emit = defineEmits<Emits>();
const { t } = useLocale();

// Primitive form state → shallowRef (no deep proxying needed).
const username = shallowRef('');
const password = shallowRef('');

function onSubmit() {
  emit('submit', { username: username.value, password: password.value });
}
</script>

<template>
  <VCard rounded="xl" variant="elevated">
    <VCardItem>
      <template #prepend>
        <VAvatar color="primary" icon="mdi-fruit-cherries" variant="tonal" />
      </template>
      <template #title>{{ t('views.login.title') }}</template>
      <template #subtitle>{{ t('views.login.subtitle') }}</template>
    </VCardItem>

    <VCardText class="flex flex-col gap-3">
      <VTextField
        v-model="username"
        :label="t('views.login.username')"
        prepend-inner-icon="mdi-account-outline"
      />
      <VTextField
        v-model="password"
        :label="t('views.login.password')"
        prepend-inner-icon="mdi-lock-outline"
        type="password"
      />
    </VCardText>

    <VCardActions class="px-4 pb-2">
      <VBtn block color="primary" variant="flat" @click="onSubmit">
        {{ t('views.login.submit') }}
      </VBtn>
    </VCardActions>

    <VCardText class="pt-0 text-caption">
      {{ t('views.login.hint') }}
    </VCardText>
  </VCard>
</template>
