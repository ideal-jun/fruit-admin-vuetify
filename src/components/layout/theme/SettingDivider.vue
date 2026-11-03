<script setup lang="ts">
interface Props {
  /** Divider title. */
  title: string;
}

const { title } = defineProps<Props>();
</script>

<template>
  <VDivider class="my-3 text-label-medium">{{ title }}</VDivider>
</template>
