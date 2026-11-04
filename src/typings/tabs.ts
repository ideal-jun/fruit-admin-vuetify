/**
 * Global page tabs.
 *
 * A tab stores the route identity plus the i18n key of its label — never the
 * translated text itself. The tab bar translates `titleKey` at render time, so
 * switching locale relabels every tab (and restored tabs stay valid), the same
 * way `useNavigation` derives the sidebar from route metadata.
 */

/** One page tab in the global tab bar. */
export interface AppTab {
  /** Stable identity: the route path (query/hash excluded). */
  readonly id: string;
  /** Navigation target pushed when the tab is activated (query/hash included). */
  readonly fullPath: string;
  /** Route path without query/hash. */
  readonly path: string;
  /** Route name, used to validate restored tabs against the route table. */
  readonly name?: string;
  /** i18n key of the label (route `meta.titleKey`), translated at render time. */
  readonly titleKey: string;
  /** Icon from the route `meta.icon`. */
  readonly icon?: string;
  /** Pin order for pinned tabs; `undefined` when the tab is not pinned. */
  readonly fixedIndex?: number;
}

/** A tab action offered by the context menu and the tab-bar actions menu. */
export type TabAction =
  | 'close-current'
  | 'close-others'
  | 'close-left'
  | 'close-right'
  | 'close-all'
  | 'pin'
  | 'unpin';

/** One entry of the tab right-click context menu. */
export interface TabActionItem {
  /** Action identifier. */
  readonly key: TabAction;
  /** Translated label. */
  readonly label: string;
  /** MDI icon name. */
  readonly icon: string;
  /** Whether the action is unavailable for the current tab. */
  readonly disabled: boolean;
}
