<template>
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
      <div class="leading-7">Change this page by updating <VCode>views/home/index.vue</VCode>.</div>
    </template>
  </VCard>
</template>

<style scoped>
/* Demo of mixing utility classes with `@apply` (see README » UnoCSS). */
.hero-card {
  @apply py-3 md:pr-[120px] w-full transition-none;
}
</style>
