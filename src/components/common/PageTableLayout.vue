<script setup lang="ts">
interface Props {
  /** Card title (already translated). */
  title: string;
  /**
   * Fill the remaining viewport height. The route must expose the layout height
   * (`meta.fullHeight`) so BaseLayout gives the container `h-full`.
   */
  fillHeight?: boolean;
}

const { title, fillHeight = true } = defineProps<Props>();
</script>

<template>
  <div class="page-table" :class="{ 'page-table--fill': fillHeight }">
    <div v-if="$slots.search" class="shrink-0">
      <slot name="search" />
    </div>

    <VCard class="page-table__card flex min-h-0 flex-1 flex-col overflow-hidden" elevation="1">
      <VCardItem class="shrink-0">
        <VCardTitle>{{ title }}</VCardTitle>

        <template v-if="$slots.actions" #append>
          <div class="flex items-center gap-1">
            <slot name="actions" />
          </div>
        </template>
      </VCardItem>

      <VDivider class="shrink-0" />

      <div class="page-table__content flex min-h-0 flex-1 flex-col">
        <slot />
      </div>
    </VCard>

    <!-- Overlays (drawer/dialog/snackbar) live outside the card in the same page root. -->
    <slot name="modals" />
  </div>
</template>

<style scoped>
.page-table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-table--fill {
  height: 100%;
  min-height: 0;
}

/* The default slot is expected to be a single table-like root: let it own the rest of
   the card and scroll internally (VDataTable already renders a flex column wrapper). */
.page-table__content > :deep(*) {
  flex: 1 1 auto;
  min-height: 0;
}

/* On phones the reference page scrolls as a whole instead of squeezing the table. */
@media (max-width: 600px) {
  .page-table--fill {
    height: auto;
  }

  .page-table__card,
  .page-table__content {
    flex: 0 0 auto;
  }
}
</style>
