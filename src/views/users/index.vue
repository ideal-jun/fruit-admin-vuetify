<script setup lang="ts">
import type { TableColumn } from '@/composables/useTable';
import type { UserRecord, UserSavePayload, UserSearchParams } from '@/typings/user';
import type { DataTableHeader } from 'vuetify';

import { computed, ref, shallowRef, watch } from 'vue';
import { useLocale } from 'vuetify';

import AppIconButton from '@/components/common/AppIconButton.vue';
import { useTable, useTableOperate } from '@/composables/useTable';
import {
  createInitialUsers,
  createUserSearchParams,
  getUserRoleLabelKey,
} from '@/views/users/modules/userData';
import UserOperateDrawer from '@/views/users/modules/UserOperateDrawer.vue';
import UserSearch from '@/views/users/modules/UserSearch.vue';

defineOptions({ name: 'UsersView' });

/** Column metadata consumed by both the Vuetify table and the column menu. */
interface UserColumn extends TableColumn {
  align?: 'start' | 'center' | 'end';
  fixed?: 'start' | 'end';
  sortable?: boolean;
  width?: number;
  /** Fixed columns (index/actions) never appear in the column menu. */
  locked?: boolean;
}

type DeleteTarget =
  | { readonly mode: 'single'; readonly user: UserRecord }
  | { readonly mode: 'batch' };

const MOCK_REQUEST_DELAY = 220;

/** Zero-pad a date part for the demo `createTime` value. */
function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Client-side equivalent of the reference API filter. */
function filterUsers(source: readonly UserRecord[], search: UserSearchParams): UserRecord[] {
  const username = search.username.trim().toLowerCase();
  const nickname = search.nickname.trim().toLowerCase();
  const userPhone = search.userPhone.trim();
  const userEmail = search.userEmail.trim().toLowerCase();

  return source.filter((user) => {
    return (
      (username === '' || user.username.toLowerCase().includes(username)) &&
      (nickname === '' || user.nickname.toLowerCase().includes(nickname)) &&
      (userPhone === '' || user.userPhone.includes(userPhone)) &&
      (userEmail === '' || user.userEmail.toLowerCase().includes(userEmail)) &&
      (search.userGender === null || user.userGender === search.userGender) &&
      (search.status === null || user.status === search.status)
    );
  });
}

const { t, current } = useLocale();

const users = ref<UserRecord[]>(createInitialUsers());
const searchModel = ref<UserSearchParams>(createUserSearchParams());
const appliedSearch = ref<UserSearchParams>(createUserSearchParams());

const page = ref(1);
const pageSize = ref(10);

const snackbarOpen = shallowRef(false);
const snackbarText = shallowRef('');

const confirmOpen = shallowRef(false);
const deleteTarget = shallowRef<DeleteTarget | null>(null);

/** Columns rebuilt on locale changes so titles follow the active language. */
function buildColumns(): UserColumn[] {
  return [
    {
      key: 'index',
      title: t('views.users.index'),
      align: 'center',
      sortable: false,
      width: 72,
      locked: true,
    },
    { key: 'username', title: t('views.users.username'), align: 'start' },
    { key: 'nickname', title: t('views.users.nickname'), align: 'start' },
    { key: 'userGender', title: t('views.users.userGender'), align: 'center' },
    { key: 'userPhone', title: t('views.users.userPhone'), align: 'start' },
    { key: 'userEmail', title: t('views.users.userEmail'), align: 'start' },
    { key: 'status', title: t('views.users.userStatus'), align: 'center' },
    { key: 'roles', title: t('views.users.userRole'), align: 'start', sortable: false },
    { key: 'createTime', title: t('views.users.createTime'), align: 'start' },
    {
      key: 'actions',
      title: t('views.users.operate'),
      align: 'end',
      fixed: 'end',
      sortable: false,
      locked: true,
    },
  ];
}

/** Mock API: filter the local rows after a short delay (reference-style request lifecycle). */
async function fetchUsers(): Promise<UserRecord[]> {
  await delay(MOCK_REQUEST_DELAY);

  return filterUsers(users.value, appliedSearch.value);
}

const {
  columnChecks,
  columns,
  data: tableData,
  getData,
  loading,
  reloadColumns,
  setColumnChecked,
} = useTable<UserRecord[], UserRecord, UserColumn>({
  api: fetchUsers,
  transform: (rows) => rows,
  columns: buildColumns,
  getColumnChecks: (allColumns) =>
    allColumns
      .filter((column) => column.locked !== true)
      .map((column) => ({ key: column.key, title: column.title, checked: true })),
  getColumns: (allColumns, checks) => {
    const checked = new Set(checks.filter((check) => check.checked).map((check) => check.key));

    return allColumns.filter((column) => column.locked === true || checked.has(column.key));
  },
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  closeDrawer,
  onBatchDeleted,
  onDeleted,
} = useTableOperate<UserRecord, number>(users, 'id', getData);

const headers = computed<DataTableHeader<UserRecord>[]>(() =>
  columns.value.map((column) => ({
    key: column.key,
    title: column.title,
    align: column.align,
    fixed: column.fixed,
    sortable: column.sortable,
    width: column.width,
  })),
);

const deleteMessage = computed(() => {
  const target = deleteTarget.value;

  if (target === null) {
    return '';
  }

  return target.mode === 'single'
    ? t('views.users.confirmDelete', target.user.username)
    : t('views.users.confirmBatchDelete', checkedRowKeys.value.length);
});

watch(current, reloadColumns);

function showMessage(message: string) {
  snackbarText.value = message;
  snackbarOpen.value = true;
}

function roleLabel(code: string): string {
  return t(getUserRoleLabelKey(code));
}

function statusLabel(status: number): string {
  return status === 1 ? t('views.users.enabled') : t('views.users.disabled');
}

async function applySearch() {
  appliedSearch.value = { ...searchModel.value };
  page.value = 1;
  checkedRowKeys.value = [];
  await getData();
}

async function resetSearch() {
  searchModel.value = createUserSearchParams();
  appliedSearch.value = createUserSearchParams();
  page.value = 1;
  checkedRowKeys.value = [];
  await getData();
}

function onColumnToggle(key: string, value: unknown) {
  if (typeof value === 'boolean') {
    setColumnChecked(key, value);
  }
}

function refresh() {
  void getData();
}

/** Current local time as the demo's `createTime` value. */
function nowText(): string {
  const now = new Date();

  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ${pad2(
    now.getHours(),
  )}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
}

async function saveUser(payload: UserSavePayload) {
  const form = payload.user;

  if (payload.operateType === 'add') {
    const nextId = users.value.reduce((max, user) => Math.max(max, user.id), 0) + 1;

    users.value = [
      {
        id: nextId,
        username: form.username.trim(),
        nickname: form.nickname.trim(),
        userGender: form.userGender,
        userPhone: form.userPhone.trim(),
        userEmail: form.userEmail.trim(),
        status: form.status,
        roles: [...form.userRoleCodes],
        createTime: nowText(),
      },
      ...users.value,
    ];

    showMessage(t('views.users.addSuccess'));
  } else if (editingData.value !== null) {
    const editingId = editingData.value.id;

    users.value = users.value.map((user) =>
      user.id === editingId
        ? {
            ...user,
            username: form.username.trim(),
            nickname: form.nickname.trim(),
            userGender: form.userGender,
            userPhone: form.userPhone.trim(),
            userEmail: form.userEmail.trim(),
            status: form.status,
            roles: [...form.userRoleCodes],
          }
        : user,
    );

    showMessage(t('views.users.updateSuccess'));
  }

  closeDrawer();
  editingData.value = null;
  await getData();
}

function openDelete(user: UserRecord) {
  deleteTarget.value = { mode: 'single', user };
  confirmOpen.value = true;
}

function openBatchDelete() {
  if (checkedRowKeys.value.length === 0) {
    return;
  }

  deleteTarget.value = { mode: 'batch' };
  confirmOpen.value = true;
}

async function confirmDelete() {
  const target = deleteTarget.value;

  if (target === null) {
    return;
  }

  if (target.mode === 'single') {
    users.value = users.value.filter((user) => user.id !== target.user.id);
    await onDeleted();
    showMessage(t('views.users.deleteSuccess'));
  } else {
    const ids = new Set(checkedRowKeys.value);

    users.value = users.value.filter((user) => !ids.has(user.id));
    await onBatchDeleted();
    showMessage(t('views.users.batchDeleteSuccess'));
  }

  confirmOpen.value = false;
  deleteTarget.value = null;
}
</script>

<template>
  <div class="users-page flex flex-col gap-4">
    <UserSearch
      v-model:model="searchModel"
      class="shrink-0"
      @reset="resetSearch"
      @search="applySearch"
    />

    <VCard
      border
      class="users-table-card flex min-h-0 flex-1 flex-col overflow-hidden"
      variant="flat"
    >
      <VCardItem class="shrink-0">
        <VCardTitle>{{ t('views.users.title') }}</VCardTitle>

        <template #append>
          <div class="flex items-center gap-1">
            <VBtn
              color="primary"
              prepend-icon="mdi-account-plus-outline"
              size="small"
              variant="flat"
              @click="handleAdd"
            >
              {{ t('views.users.addUser') }}
            </VBtn>

            <VBtn
              color="error"
              :disabled="checkedRowKeys.length === 0"
              prepend-icon="mdi-delete-outline"
              size="small"
              variant="text"
              @click="openBatchDelete"
            >
              {{ t('views.users.batchDelete') }}
            </VBtn>

            <VMenu location="bottom end">
              <template #activator="{ props: menuProps }">
                <VBtn
                  v-bind="menuProps"
                  :aria-label="t('views.users.columns')"
                  icon="mdi-view-column-outline"
                  size="small"
                  variant="text"
                />
              </template>

              <VList density="compact">
                <VListItem v-for="check in columnChecks" :key="check.key">
                  <template #prepend>
                    <VCheckbox
                      density="compact"
                      hide-details
                      :model-value="check.checked"
                      @update:model-value="onColumnToggle(check.key, $event)"
                    />
                  </template>
                  <VListItemTitle>{{ check.title }}</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>

            <AppIconButton
              icon="mdi-refresh"
              :loading="loading"
              :tooltip="t('views.users.refresh')"
              @click="refresh"
            />
          </div>
        </template>
      </VCardItem>

      <VDivider class="shrink-0" />

      <VDataTable
        v-model="checkedRowKeys"
        v-model:items-per-page="pageSize"
        v-model:page="page"
        class="users-table min-h-0 flex-1"
        fixed-header
        :headers="headers"
        item-value="id"
        :items="tableData"
        :items-per-page-options="[5, 10, 25]"
        :loading="loading"
        :no-data-text="t('views.users.empty')"
        show-select
      >
        <template #item.index="{ index }">
          {{ (page - 1) * pageSize + index + 1 }}
        </template>

        <template #item.userGender="{ item }">
          <VChip :color="item.userGender === 1 ? 'primary' : 'pink'" size="small" variant="tonal">
            {{ item.userGender === 1 ? t('views.users.male') : t('views.users.female') }}
          </VChip>
        </template>

        <template #item.status="{ item }">
          <VChip :color="item.status === 1 ? 'success' : 'warning'" size="small" variant="tonal">
            {{ statusLabel(item.status) }}
          </VChip>
        </template>

        <template #item.roles="{ item }">
          <div class="flex flex-wrap gap-1">
            <VChip v-for="code in item.roles" :key="code" size="x-small" variant="outlined">
              {{ roleLabel(code) }}
            </VChip>
          </div>
        </template>

        <template #item.actions="{ item }">
          <div class="flex justify-end gap-1">
            <VBtn color="primary" size="small" variant="text" @click="handleEdit(item.id)">
              {{ t('views.users.editUser') }}
            </VBtn>
            <VBtn color="error" size="small" variant="text" @click="openDelete(item)">
              {{ t('views.users.delete') }}
            </VBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <UserOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :user="editingData"
      @save="saveUser"
    />

    <VDialog v-model="confirmOpen" max-width="420">
      <VCard>
        <VCardTitle>{{ t('views.users.confirmDeleteTitle') }}</VCardTitle>
        <VCardText>{{ deleteMessage }}</VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="confirmOpen = false">
            {{ t('views.users.cancel') }}
          </VBtn>
          <VBtn color="error" variant="flat" @click="confirmDelete">
            {{ t('views.users.confirm') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar v-model="snackbarOpen" :text="snackbarText" timeout="2000" />
  </div>
</template>

<style scoped>
/* Fill the VMain scroller: BaseLayout gives VContainer `h-full`, so the page can use the
   remaining height and the table card flexes below the search card. */
.users-page {
  height: 100%;
  min-height: 0;
}

/* On phones the reference page scrolls as a whole instead of squeezing the table. */
@media (max-width: 600px) {
  .users-page {
    height: auto;
    min-height: 0;
  }

  .users-table-card,
  .users-table {
    flex: 0 0 auto;
  }
}
</style>
