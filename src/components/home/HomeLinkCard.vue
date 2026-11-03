<script setup lang="ts">
import type { HomeLink } from '@/typings/home';

/** One navigation card; the page owns the data and passes it down (props down). */
const { link } = defineProps<{ link: HomeLink }>();
</script>

<template>
  <VCard
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
</template>
