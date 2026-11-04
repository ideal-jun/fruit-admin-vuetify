<script setup lang="ts">
import type { HomeLink } from '@/typings/home';

import HomeFeatureCard from '@/views/home/modules/HomeFeatureCard.vue';
import HomeHero from '@/views/home/modules/HomeHero.vue';
import HomeI18nDemo from '@/views/home/modules/HomeI18nDemo.vue';
import HomeLinkCard from '@/views/home/modules/HomeLinkCard.vue';

const links: HomeLink[] = [
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
      <HomeHero />

      <div class="grid md:grid-cols-2 gap-4">
        <HomeI18nDemo />
        <HomeFeatureCard />
        <HomeLinkCard v-for="link in links" :key="link.href" :link="link" />
      </div>
    </div>
  </VContainer>
</template>

<style scoped>
/*
  Page-wide card surface. Demonstrates `:deep()` + `@apply` (kept on the view because it
  targets cards from several child components):
  1. mixing helper classes and @apply for demonstration purposes only
  2. the classes below are NOT wrapped in any CSS layer, so they "win" over everything else
*/
:deep(.v-card) {
  @apply bg-gray-200;
  @apply dark:bg-black dark:bg-linear-to-r dark:from-primary/50 dark:to-primary/30 dark:text-white/80;
}
</style>
