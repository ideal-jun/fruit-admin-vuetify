import type { ComputedRef, Ref } from 'vue';

import { computed, ref, shallowRef, toRaw } from 'vue';

/** Paginated payload an API can return when `pagination` is enabled. */
export interface PaginationData<T> {
  data: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

/** Minimum column shape the table composables understand. */
export interface TableColumn {
  key: string;
  title: string;
}

/** One entry of the column-visibility checks, shared with the table toolbar. */
export interface TableColumnCheck {
  key: string;
  title: string;
  checked: boolean;
}

export interface UseTableOptions<ResponseData, Row, Column extends TableColumn> {
  /** API function used to fetch the rows. */
  api: () => Promise<ResponseData>;
  /** Map the API response to rows, or to a paginated payload. */
  transform: (response: ResponseData) => Row[] | PaginationData<Row>;
  /** Column factory; re-run to rebuild titles after a locale change. */
  columns: () => Column[];
  /** Column checks factory; defaults to every column checked. */
  getColumnChecks?: (columns: Column[]) => TableColumnCheck[];
  /** Columns shown by the table; defaults to the checked columns. */
  getColumns?: (columns: Column[], checks: TableColumnCheck[]) => Column[];
  /** Whether the transform returns a paginated payload. */
  pagination?: boolean;
  /** Called after a successful fetch. */
  onFetched?: (data: Row[] | PaginationData<Row>) => void | Promise<void>;
  /** Fetch immediately on creation (default true). */
  immediate?: boolean;
}

/** Public state returned by {@link useTable}. */
export interface TableState<Row, Column extends TableColumn> {
  loading: Ref<boolean>;
  empty: ComputedRef<boolean>;
  data: Ref<Row[]>;
  columns: ComputedRef<Column[]>;
  columnChecks: Ref<TableColumnCheck[]>;
  reloadColumns: () => void;
  setColumnChecked: (key: string, checked: boolean) => void;
  getData: () => Promise<void>;
}

/** Public state returned by {@link useTableOperate}. */
export interface TableOperate<TableData, Key extends string | number> {
  drawerVisible: Ref<boolean>;
  openDrawer: () => void;
  closeDrawer: () => void;
  operateType: Ref<'add' | 'edit'>;
  handleAdd: () => void;
  editingData: Ref<TableData | null>;
  handleEdit: (id: Key) => void;
  checkedRowKeys: Ref<Key[]>;
  onBatchDeleted: () => Promise<void>;
  onDeleted: () => Promise<void>;
}

/** Default checks: every column visible. */
function createColumnChecks<Column extends TableColumn>(columns: Column[]): TableColumnCheck[] {
  return columns.map((column) => ({
    key: column.key,
    title: column.title,
    checked: true,
  }));
}

/** Default table columns: only the checked keys, in their original order. */
function filterColumns<Column extends TableColumn>(
  columns: Column[],
  checks: TableColumnCheck[],
): Column[] {
  const checked = new Set(checks.filter((check) => check.checked).map((check) => check.key));

  return columns.filter((column) => checked.has(column.key));
}

/**
 * Table data/column state, ported from the reference's core `useTable` hook.
 *
 * The composable deliberately stays UI-library agnostic: it owns the rows, loading flag,
 * column checks and fetch lifecycle; the page supplies the API, the transform and the
 * concrete column/header shapes (Vuetify in this project).
 */
export function useTable<ResponseData, Row, Column extends TableColumn>(
  options: UseTableOptions<ResponseData, Row, Column>,
): TableState<Row, Column> {
  const loading = ref(false);
  const data = ref<Row[]>([]) as Ref<Row[]>;
  const empty = computed(() => data.value.length === 0);

  const buildChecks = () =>
    options.getColumnChecks?.(options.columns()) ?? createColumnChecks(options.columns());

  const columnChecks = ref<TableColumnCheck[]>(buildChecks());

  /** Show only the checked columns (pages can override this to keep fixed columns). */
  const columns = computed<Column[]>(() => {
    const allColumns = options.columns();

    return (
      options.getColumns?.(allColumns, columnChecks.value) ??
      filterColumns(allColumns, columnChecks.value)
    );
  });

  /** Rebuild the checks from the current columns, preserving the user's visibility choices. */
  function reloadColumns() {
    const previous = new Map(
      columnChecks.value.map((check) => [check.key, check.checked] as const),
    );
    const allColumns = options.columns();
    const nextChecks = options.getColumnChecks?.(allColumns) ?? createColumnChecks(allColumns);

    columnChecks.value = nextChecks.map((check) => {
      const checked = previous.get(check.key) ?? check.checked;

      return { key: check.key, title: check.title, checked };
    });
  }

  /** Toggle one column from the toolbar's column menu. */
  function setColumnChecked(key: string, checked: boolean) {
    columnChecks.value = columnChecks.value.map((check) =>
      check.key === key ? { ...check, checked } : check,
    );
  }

  /** Fetch the rows through the supplied API and transform. */
  async function getData(): Promise<void> {
    loading.value = true;

    try {
      const response = await options.api();
      const transformed = options.transform(response);
      const rows = Array.isArray(transformed) ? transformed : transformed.data;

      data.value = rows;
      await options.onFetched?.(transformed);
    } finally {
      loading.value = false;
    }
  }

  if (options.immediate !== false) {
    void getData();
  }

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    setColumnChecked,
    getData,
  };
}

/**
 * Add/edit drawer + row selection state, ported from the reference's `useTableOperate`.
 *
 * Delete hooks only clear the selection and refetch; user-facing feedback (snackbar / toast)
 * stays in the page so the composable has no UI dependencies.
 */
export function useTableOperate<TableData, Key extends string | number>(
  data: Ref<TableData[]>,
  idKey: keyof TableData,
  getData?: () => Promise<void>,
): TableOperate<TableData, Key> {
  const drawerVisible = ref(false);
  const operateType = shallowRef<'add' | 'edit'>('add');
  const editingData: Ref<TableData | null> = shallowRef(null);
  const checkedRowKeys: Ref<Key[]> = ref([]);

  function openDrawer() {
    drawerVisible.value = true;
  }

  function closeDrawer() {
    drawerVisible.value = false;
  }

  function handleAdd() {
    operateType.value = 'add';
    editingData.value = null;
    openDrawer();
  }

  function handleEdit(id: Key) {
    operateType.value = 'edit';

    const found = data.value.find((row) => {
      const value: unknown = row[idKey];

      return value === id;
    });

    // Rows live in a reactive ref; structuredClone needs the raw object.
    editingData.value = found === undefined ? null : structuredClone(toRaw(found));
    openDrawer();
  }

  /** Clear the selection and refresh the table after a batch delete. */
  async function onBatchDeleted() {
    checkedRowKeys.value = [];
    await getData?.();
  }

  /** Refresh the table after a single delete. */
  async function onDeleted() {
    await getData?.();
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted,
  };
}
