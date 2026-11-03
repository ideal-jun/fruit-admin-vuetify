/** The signed-in user (demo only: no credentials are verified, see `useAuthStore`). */
export interface AuthUser {
  readonly username: string;
  readonly displayName: string;
}
