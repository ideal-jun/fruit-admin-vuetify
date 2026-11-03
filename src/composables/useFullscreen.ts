import { onBeforeUnmount, onMounted, shallowRef } from 'vue';

/** Toggle the browser's fullscreen mode (no-op when unsupported or denied). */
async function toggleFullscreen() {
  try {
    await (document.fullscreenElement === null
      ? document.documentElement.requestFullscreen()
      : document.exitFullscreen());
  } catch {
    // Unsupported or denied by the browser: keep the current state.
  }
}

/**
 * Thin wrapper around the browser Fullscreen API, used by the app-bar toggle.
 *
 * The listener is registered in `onMounted`, so calling this during SSR never
 * touches `document`.
 */
export function useFullscreen() {
  const isFullscreen = shallowRef(false);

  function sync() {
    isFullscreen.value = document.fullscreenElement !== null;
  }

  onMounted(() => {
    sync();
    document.addEventListener('fullscreenchange', sync);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', sync);
  });

  return { isFullscreen, toggle: toggleFullscreen };
}
