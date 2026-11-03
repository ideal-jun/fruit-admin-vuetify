/** A single entry of the sidebar navigation (derived from router routes). */
export interface NavigationItem {
  readonly to: string;
  readonly title: string;
  readonly icon: string;
}

/** One crumb rendered by the app bar (derived from the matched route). */
export interface BreadcrumbItem {
  readonly title: string;
  readonly icon?: string;
  readonly to?: string;
}
