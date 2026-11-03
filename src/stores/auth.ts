import type { AuthUser } from '@/typings/auth';

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/** localStorage key for the demo session. */
export const AUTH_STORAGE_KEY = 'fruit-admin.user';

function readStoredUser(): AuthUser | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (raw === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const { username } = parsed as { username?: unknown };

    return typeof username === 'string' && username !== ''
      ? { username, displayName: username }
      : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user: AuthUser | null): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    if (user === null) {
      localStorage.removeItem(AUTH_STORAGE_KEY);

      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Storage can be unavailable: the session still works in memory.
  }
}

/**
 * Demo authentication: the login view accepts any credentials and the session is
 * kept in localStorage. Swap the actions for a real API call when wiring a backend.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(readStoredUser());

  const isAuthenticated = computed(() => user.value !== null);
  const displayName = computed(() => user.value?.displayName ?? '');
  const initials = computed(() => displayName.value.slice(0, 1).toUpperCase() || '?');

  function signIn(username: string) {
    const name = username.trim();
    const normalized = name === '' ? 'guest' : name;

    user.value = { username: normalized, displayName: normalized };
    writeStoredUser(user.value);
  }

  function signOut() {
    user.value = null;
    writeStoredUser(null);
  }

  return { user, isAuthenticated, displayName, initials, signIn, signOut };
});
