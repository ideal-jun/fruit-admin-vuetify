<script setup lang="ts">
/**
 * BlankLayout — full-screen canvas without navigation chrome.
 *
 * Used by routes that own the whole viewport (sign-in, error views, onboarding, …):
 * child views are rendered by the `<RouterView />` centred horizontally and vertically,
 * filling the screen (see src/router/routes.ts).
 */
</script>

<template>
  <VMain class="flex min-h-screen items-center justify-center bg-background p-4">
    <RouterView />
  </VMain>
</template>
