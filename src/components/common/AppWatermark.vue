<script setup lang="ts">
import type { WatermarkTimeFormat } from '@/typings/theme';

import { computed, onBeforeUnmount, ref, watch } from 'vue';

import { useAuthStore } from '@/stores/auth';
import { formatWatermarkTime } from '@/theme/watermark';

interface Props {
  /** Text used when neither the user name nor the time is enabled. */
  text: string;
  /** Use the signed-in user name. */
  enableUsername?: boolean;
  /** Use the current time. */
  enableTime?: boolean;
  /** Placeholder format used when the time is enabled. */
  timeFormat?: WatermarkTimeFormat;
}

// Vue 3.5 reactive props destructure: native defaults instead of withDefaults().
const {
  text,
  enableUsername = false,
  enableTime = false,
  timeFormat = 'YYYY-MM-DD HH:mm',
} = defineProps<Props>();

const authStore = useAuthStore();

const now = ref(new Date());

/** 8 columns × 5 rows of watermark text, like the reference implementation. */
const items = Array.from({ length: 40 }, (_, index) => index);

let timer: number | undefined;

function syncTimer() {
  if (timer !== undefined) {
    window.clearInterval(timer);
    timer = undefined;
  }

  if (enableTime) {
    timer = window.setInterval(() => {
      now.value = new Date();
    }, 1000);
  }
}

watch(() => enableTime, syncTimer, { immediate: true });

onBeforeUnmount(() => {
  if (timer !== undefined) {
    window.clearInterval(timer);
  }
});

const content = computed(() => {
  if (enableUsername && authStore.displayName !== '') {
    return authStore.displayName;
  }

  if (enableTime) {
    return formatWatermarkTime(now.value, timeFormat);
  }

  return text;
});
</script>

<template>
  <div aria-hidden="true" class="pointer-events-none fixed inset-0 z-[2500] overflow-hidden">
    <span
      v-for="item in items"
      :key="item"
      class="watermark-item"
      :style="{
        left: `${(item % 8) * 14}%`,
        top: `${Math.floor(item / 8) * 22}%`,
      }"
    >
      {{ content }}
    </span>
  </div>
</template>

<style scoped>
.watermark-item {
  position: absolute;
  display: block;
  /* Follows the active theme (Vuetify's on-surface color) instead of a fixed black/white. */
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 6%, transparent);
  font-size: 16px;
  white-space: nowrap;
  transform: rotate(-24deg);
  user-select: none;
}

.v-theme--dark .watermark-item {
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 7%, transparent);
}
</style>
