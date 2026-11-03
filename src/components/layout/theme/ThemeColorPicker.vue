<script setup lang="ts">
import { useLocale } from 'vuetify';

import { useThemeStore } from '@/stores/theme';
import { isLightHexColor, PRIMARY_COLOR_SWATCHES } from '@/theme/appearance';

const { t } = useLocale();
const themeStore = useThemeStore();
</script>

<template>
  <section>
    <div class="mb-2 flex items-center justify-between">
      <span class="text-label-large opacity-80">{{ t('theme.primary') }}</span>
      <span class="text-label-small opacity-60">{{ themeStore.primary }}</span>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="color in PRIMARY_COLOR_SWATCHES"
        :key="color"
        :aria-label="color"
        :class="[
          'h-8 w-8 flex cursor-pointer items-center justify-center rounded-full border border-black/10 transition hover:scale-110',
          themeStore.primary === color ? 'scale-110 ring-2 ring-primary' : '',
        ]"
        :style="{ backgroundColor: color }"
        type="button"
        @click="themeStore.setPrimary(color)"
      >
        <VIcon
          v-if="themeStore.primary === color"
          :class="isLightHexColor(color) ? 'text-black/70' : 'text-white'"
          icon="mdi-check"
          size="18"
        />
      </button>
    </div>

    <VBtn
      class="mt-3"
      prepend-icon="mdi-restore"
      size="small"
      variant="text"
      @click="themeStore.reset()"
    >
      {{ t('theme.reset') }}
    </VBtn>
  </section>
</template>
