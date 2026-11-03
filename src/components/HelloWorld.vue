<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useAppLocale } from '@/composables/useAppLocale';

const { t } = useI18n({ useScope: 'global' });
const { currentLocale } = useAppLocale();

const links = [
  {
    href: 'https://vuetifyjs.com/',
    icon: 'mdi-text',
    subtitle: 'Learn about all things Vuetify in our documentation.',
    title: 'Documentation',
  },
  {
    href: 'https://vuetifyjs.com/introduction/why-vuetify/#feature-guides',
    icon: 'mdi-star',
    subtitle: 'Explore available framework Features.',
    title: 'Features',
  },
  {
    href: 'https://vuetifyjs.com/components/all',
    icon: 'mdi-widgets-outline',
    subtitle: 'Discover components in the API Explorer.',
    title: 'Components',
  },
  {
    href: 'https://discord.vuetifyjs.com',
    icon: 'mdi-account-group-outline',
    subtitle: 'Connect with Vuetify developers.',
    title: 'Community',
  },
];
</script>

<template>
  <VContainer class="h-full flex items-center" max-width="900">
    <div>
      <VImg alt="Placeholder logo" class="mb-4" height="150" src="@/assets/logo.png" />

      <div class="mb-8 text-center">
        <div class="font-light -mb-1">Welcome to</div>
        <h1 class="text-6xl font-heading font-bold">Vuetify</h1>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
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
              {{ t('demo.currentLocale', { locale: currentLocale }) }}
            </p>
          </VCardText>
        </VCard>

        <VCard
          class="hero-card md:col-span-2"
          image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
          rounded="3xl"
          variant="flat"
        >
          <template #prepend>
            <VAvatar class="ml-2 mr-4" icon="mdi-rocket-launch-outline" size="60" variant="tonal" />
          </template>

          <template #image>
            <VImg class="hidden md:flex" position="top right" />
          </template>

          <template #title>
            <h2 class="text-2xl font-medium my-0">Get started</h2>
          </template>

          <template #subtitle>
            <div class="leading-7">
              Change this page by updating <VCode>components/HelloWorld.vue</VCode>.
            </div>
          </template>
        </VCard>

        <VCard
          v-for="link in links"
          :key="link.href"
          class="h-full py-3 rounded-3xl transition-[border-radius] hover:rounded-lg flex items-center [&>.v-card-item]:w-full group"
          :href="link.href"
          rel="noopener noreferrer"
          :subtitle="link.subtitle"
          target="_blank"
          :title="link.title"
          variant="flat"
        >
          <template #prepend>
            <VAvatar class="ml-2 mr-4" :icon="link.icon" size="60" variant="tonal" />
          </template>
          <template #append>
            <VIcon
              class="ml-1 opacity-0 transition group-hover:opacity-90 group-hover:-translate-x-1"
              icon="mdi-open-in-new"
            />
          </template>
          <template #subtitle>
            <div class="line-clamp-2 text-wrap">{{ link.subtitle }}</div>
          </template>
        </VCard>
      </div>
    </div>
  </VContainer>
</template>

<style scoped>
/*
  1. mixing helper classes and @apply for demonstration purposes only
  2. the classes below are NOT wrapped in any CSS layer, so they "win" over everything else
*/
.hero-card {
  @apply py-3 md:pr-[120px] w-full transition-none;
}

:deep(.v-card) {
  @apply bg-gray-200;
  @apply dark:bg-black dark:bg-linear-to-r dark:from-primary/50 dark:to-primary/30 dark:text-white/80;
}
</style>
