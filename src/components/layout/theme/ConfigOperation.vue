<script setup lang="ts">
import { shallowRef } from 'vue';
import { useLocale } from 'vuetify';

import { useThemeStore } from '@/stores/theme';

const { t } = useLocale();
const themeStore = useThemeStore();

const message = shallowRef('');
const messageVisible = shallowRef(false);

function showMessage(text: string) {
  message.value = text;
  messageVisible.value = true;
}

/**
 * Fallback for contexts without the async Clipboard API (non-secure origins):
 * copy through a temporary textarea + the deprecated but universally supported
 * `document.execCommand('copy')`.
 */
function copyWithTextarea(text: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

async function copySettings() {
  const json = themeStore.settingsJson;
  let copied = false;

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(json);
      copied = true;
    } catch {
      copied = false;
    }
  }

  if (!copied) {
    copied = copyWithTextarea(json);
  }

  if (copied) {
    showMessage(t('theme.config.copySuccess'));
  }
}

function resetSettings() {
  themeStore.reset();
  showMessage(t('theme.config.resetSuccess'));
}
</script>

<template>
  <div class="flex w-full items-center justify-between gap-3 p-4">
    <VBtn
      color="error"
      prepend-icon="mdi-restore"
      size="small"
      variant="outlined"
      @click="resetSettings"
    >
      {{ t('theme.config.reset') }}
    </VBtn>

    <VBtn color="primary" prepend-icon="mdi-content-copy" size="small" @click="copySettings">
      {{ t('theme.config.copy') }}
    </VBtn>
  </div>

  <VSnackbar v-model="messageVisible" location="bottom" :text="message" timeout="2000" />
</template>
