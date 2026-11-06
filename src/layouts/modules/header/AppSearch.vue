<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from 'vuetify';
import { VCommandPalette } from 'vuetify/labs/VCommandPalette';

import { useNavigation } from '@/composables/useNavigation';

const { t } = useLocale();
const router = useRouter();
const navItems = useNavigation();

/** Search-first: the palette lists nothing until the user types a query. */
const keyword = shallowRef('');

/**
 * Query shared by the palette (`v-model:search`) and its custom input.
 *
 * VTextField's `clearable` button resets the model to `null`, which would make
 * `keyword.value.trim()` throw; normalize it back to an empty string.
 */
const query = computed<string, string | null>({
  get: () => keyword.value,
  set: (value) => {
    keyword.value = value ?? '';
  },
});

type KeydownHandler = (event: KeyboardEvent) => void;

function isKeydownHandler(value: unknown): value is KeydownHandler {
  return typeof value === 'function';
}

/**
 * VCommandPalette executes the selected item on Enter. While an IME composition is
 * active (typing Chinese, Japanese, …) Enter only commits the composition, so the
 * palette's keydown handler must not run — otherwise the palette navigates away.
 */
function withImeGuard(inputProps: Record<string, unknown>): Record<string, unknown> {
  const { onKeydown, ...rest } = inputProps;

  return {
    ...rest,
    onKeydown: (event: KeyboardEvent) => {
      // Keys typed while an IME composition is active (e.g. the Enter that commits
      // pinyin) belong to the input method, not to the palette.
      if (event.isComposing) {
        return;
      }

      if (isKeydownHandler(onKeydown)) {
        onKeydown(event);
      }
    },
  };
}

/**
 * Navigation entries as palette actions.
 *
 * VCommandPalette owns the dialog, the search field, filtering (title/subtitle),
 * keyboard navigation (↑/↓/Enter/Esc), selection and focus handling, so this
 * component only maps routes, gates the list on the query, and wires the trigger.
 */
const items = computed(() => {
  if (query.value.trim() === '') {
    return [];
  }

  return navItems.value.map((item) => ({
    title: item.title,
    subtitle: item.to,
    prependIcon: item.icon,
    appendIcon: '$enter',
    value: item.to,
    onClick: () => {
      void router.push(item.to);
    },
  }));
});
</script>

<template>
  <VCommandPalette
    v-model:search="query"
    class="rounded-lg"
    hotkey="meta+k"
    :items="items"
    :list-props="{
      nav: true,
      color: 'primary',
      prependGap: 10,
    }"
  >
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        class="text-medium-emphasis"
        prepend-icon="mdi-magnify"
        :text="t('layout.search')"
      >
        <template #append>
          <VHotkey
            color="text-medium-emphasis "
            display-mode="icon"
            keys="meta+k"
            platform="auto"
            variant="outlined"
          />
        </template>
      </VBtn>
    </template>
    <template #input="{ props }">
      <VTextField
        v-model="query"
        v-bind="withImeGuard(props)"
        autocomplete="off"
        clearable
        color="primary"
        density="comfortable"
        hide-details
        :placeholder="t('layout.searchPlaceholder')"
        prepend-inner-icon="$search"
        variant="filled"
      ></VTextField>
    </template>
    <!-- Empty query shows a prompt; only an actual miss shows the "no results" message. -->
    <template #no-data>
      <span v-if="query.trim() !== ''">{{ t('layout.searchEmpty') }}</span>
      <VEmptyState v-else icon="mdi-magnify" :text="t('layout.searchPrompt')" />
    </template>

    <template #append>
      <VDivider />
      <div class="px-4 py-2 text-label-small text-medium-emphasis">
        {{ t('layout.searchHint') }}
      </div>
    </template>
  </VCommandPalette>
</template>
